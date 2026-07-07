import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  WbSunny,
  InfoOutlined as InfoIcon,
  AutoAwesome as SparklesIcon,
  Close as CloseIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LightbulbOutlined as LightbulbIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { ChartCard } from '../../Insights.styles';
import {
  fetchAIBehavioralPatterns,
  type PatternAnalysisData,
  type TimelineBlock,
} from '@/api/AI/apiAIInsights';
import { UPDATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import { sileo } from '@/utils';
import { useAppSelector } from '@/redux/hooks';

export interface GoldenHoursCardProps {
  fallbackGoldenWindow: string;
}

const CACHE_KEY_PREFIX = 'focusly_ai_patterns_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const TimelineView = ({ blocks }: { blocks: TimelineBlock[] }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '34px',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.03)',
        borderRadius: '8px',
        overflow: 'hidden',
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {blocks.map((block, idx) => {
        const left = (block.startHour / 24) * 100;
        const width = ((block.endHour - block.startHour) / 24) * 100;
        return (
          <Tooltip
            key={idx}
            title={`${block.label}: ${block.startHour}:00 - ${block.endHour}:00`}
            arrow
          >
            <Box
              sx={{
                position: 'absolute',
                left: `${left}%`,
                width: `${width}%`,
                height: '100%',
                bgcolor: block.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                px: 0.5,
                borderRight: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {block.label}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

const HourMarkers = () => {
  const hours = [0, 4, 8, 12, 16, 20, 24];
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        px: 0.5,
        mt: 0.5,
        mb: 2,
      }}
    >
      {hours.map((h) => (
        <Typography
          key={h}
          variant="caption"
          sx={{ fontSize: '9px', color: 'text.secondary', fontWeight: 600 }}
        >
          {h === 24 ? '24:00' : `${h.toString().padStart(2, '0')}:00`}
        </Typography>
      ))}
    </Box>
  );
};

export const GoldenHoursCard: React.FC<GoldenHoursCardProps> = ({
  fallbackGoldenWindow,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<PatternAnalysisData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedTasks, setAppliedTasks] = useState<Set<string>>(new Set());

  const [updateTaskMutation, { loading: isMutating }] =
    useMutation(UPDATE_TASK);

  const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;

  // Load from cache on mount
  useEffect(() => {
    if (!userId) return;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setAnalysisData(data);
        } else {
          localStorage.removeItem(cacheKey); // Expired
        }
      } catch (err) {
        console.error('Error reading cached patterns:', err);
      }
    }
  }, [userId, cacheKey]);

  const handleAnalyze = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetchAIBehavioralPatterns();
      if (response.success && response.data) {
        setAnalysisData(response.data);
        // Save to cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: response.data,
            timestamp: Date.now(),
          }),
        );
        sileo.success({
          title: 'Análisis Completo',
          description: 'Lumina ha identificado tus patrones de productividad.',
          duration: 4000,
        });
      } else {
        throw new Error('API Response was not successful');
      }
    } catch (err) {
      console.error('Error analyzing patterns:', err);
      sileo.error({
        title: 'Error de Análisis',
        description:
          'No pudimos analizar tus patrones de productividad en este momento.',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAction = async (rec: {
    action?: {
      type: string;
      payload: {
        taskId: string;
        estimated_start_date: string;
        estimated_end_date: string;
      };
    };
  }) => {
    if (!rec.action || rec.action.type !== 'RESCHEDULE_TASK') return;
    const { taskId, estimated_start_date, estimated_end_date } =
      rec.action.payload;
    try {
      await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: taskId,
            estimated_start_date,
            estimated_end_date,
          },
        },
      });
      setAppliedTasks((prev) => {
        const next = new Set(prev);
        next.add(taskId);
        return next;
      });
      sileo.success({
        title: '¡Cambio Aplicado con éxito! 🚀',
        description:
          'La tarea ha sido agendada en tu calendario durante tus Golden Hours.',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error applying recommendation action:', err);
      sileo.error({
        title: 'Error al aplicar cambio',
        description: 'No pudimos reagendar la tarea en este momento.',
        duration: 4000,
      });
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'success.main';
    if (conf >= 0.5) return 'warning.main';
    return 'text.secondary';
  };

  return (
    <ChartCard
      sx={{
        height: 'auto',
        minHeight: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="h6" fontWeight="bold">
            Golden Hours
          </Typography>
          <Tooltip
            title="Identificamos tus momentos pico de concentración analizando a qué horas del día completas tareas, haces sesiones de foco y editas tus notas."
            arrow
          >
            <InfoIcon
              sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }}
            />
          </Tooltip>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={handleAnalyze}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              <SparklesIcon sx={{ fontSize: 14 }} />
            )
          }
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            py: 0.5,
            px: 1.5,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'rgba(59, 130, 246, 0.08)',
            },
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze with AI'}
        </Button>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex={1}
          py={4}
          gap={2}
        >
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Lumina está analizando tus workspaces, tareas y hábitos de
            productividad...
          </Typography>
        </Box>
      )}

      {/* Result or Fallback */}
      {!loading && (
        <Box display="flex" flexDirection="column" gap={2} flex={1}>
          {analysisData && (
            <Box
              p={2}
              bgcolor="warning.light"
              borderRadius={2}
              display="flex"
              gap={2}
              alignItems="start"
            >
              <WbSunny sx={{ color: 'warning.main', mt: 0.5 }} />
              <Box flex={1}>
                <Typography variant="body2" color="warning.main">
                  Eres más productivo entre{' '}
                  <b>
                    {analysisData
                      ? analysisData.goldenHours
                      : fallbackGoldenWindow}
                  </b>
                </Typography>
                {analysisData && (
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Confianza:
                    </Typography>
                    <Box
                      sx={{
                        width: '60px',
                        height: '4px',
                        bgcolor: 'rgba(0,0,0,0.06)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${analysisData.goldenHoursConfidence * 100}%`,
                          height: '100%',
                          bgcolor: getConfidenceColor(
                            analysisData.goldenHoursConfidence,
                          ),
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      color={getConfidenceColor(
                        analysisData.goldenHoursConfidence,
                      )}
                    >
                      {Math.round(analysisData.goldenHoursConfidence * 100)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {analysisData ? (
            <Box display="flex" flexDirection="column" gap={2} flex={1}>
              {/* Style chip & summary */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={0.5}
                  >
                    ESTILO DE TRABAJO
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ⚡ {analysisData.workStyle}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setIsModalOpen(true)}
                  startIcon={<SparklesIcon sx={{ fontSize: 13 }} />}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Ver Diagnóstico (AI)
                </Button>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  RESUMEN GENERAL
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    lineHeight: 1.5,
                    p: 1.5,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(0,0,0,0.2)'
                        : 'rgba(0,0,0,0.01)',
                    borderRadius: '8px',
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  {analysisData.behaviorSummary}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={3}
              bgcolor={(theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.01)'
                  : 'rgba(0, 0, 0, 0.01)'
              }
              borderRadius="12px"
              border="1px dashed"
              borderColor="divider"
              textAlign="center"
              gap={1}
            >
              <Typography variant="body2" fontWeight="bold">
                ¿Quieres optimizar tu tiempo?
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ maxWidth: '220px' }}
              >
                Usa el botón de arriba para que Lumina analice tus workspaces y
                hábitos, personalizando tu ventana de concentración.
              </Typography>
            </Box>
          )}

          {/* Footer Text */}
          <Typography variant="caption" color="text.secondary" mt="auto">
            PRODUCTIVITY SCORE (LAST 7 DAYS)
          </Typography>
        </Box>
      )}

      {/* Deep-dive AI Advisor Modal */}
      {analysisData && (
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="sm"
          fullWidth
          scroll="body"
          PaperProps={{
            sx: {
              borderRadius: '16px',
              p: 1,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              pb: 1.5,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <SparklesIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              Lumina: Tu Coach de Productividad AI
            </Box>
            <IconButton size="small" onClick={() => setIsModalOpen(false)}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </DialogTitle>
          <Divider />

          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pt: 3 }}
          >
            {/* Work Style Details */}
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
                fontWeight="bold"
                letterSpacing="0.5px"
              >
                PERFIL DE TRABAJO
              </Typography>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  ⚡ {analysisData.workStyle}
                </Typography>
                <Chip
                  label={`Confianza: ${Math.round(analysisData.goldenHoursConfidence * 100)}%`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '10px',
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  lineHeight: 1.5,
                  p: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(0, 0, 0, 0.01)',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {analysisData.behaviorSummary}
              </Typography>
            </Box>

            {/* Timeline Comparison Diagram */}
            {analysisData.timelines && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={2}
                  fontWeight="bold"
                  letterSpacing="0.5px"
                >
                  COMPARACIÓN DE RUTINAS (24H)
                </Typography>
                <Box
                  sx={{
                    p: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.01)'
                        : 'rgba(0,0,0,0.005)',
                  }}
                >
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontWeight: 700,
                        color: 'text.secondary',
                      }}
                    >
                      DISTRIBUCIÓN DETECTADA
                    </Typography>
                    <TimelineView blocks={analysisData.timelines.current} />
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      PLAN OPTIMIZADO POR LUMINA (AI)
                    </Typography>
                    <TimelineView blocks={analysisData.timelines.recommended} />
                  </Box>

                  <HourMarkers />

                  <Box
                    display="flex"
                    gap={2}
                    justifyContent="center"
                    flexWrap="wrap"
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      pt: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#475569',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        Sueño
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#8b5cf6',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        Golden Hour
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#06b6d4',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        Secundario
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#f43f5e',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '10px', fontWeight: 600 }}
                      >
                        Ocio/Otros
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Recommendations List */}
            {analysisData.recommendations &&
              analysisData.recommendations.length > 0 && (
                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={0.5}
                    fontWeight="bold"
                    letterSpacing="0.5px"
                  >
                    RECOMENDACIONES RELEVANTES
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {analysisData.recommendations.map((rec, index) => {
                      const isWarning = rec.type === 'warning';
                      const isSuccess = rec.type === 'success';
                      const iconColor = isWarning
                        ? 'warning.main'
                        : isSuccess
                          ? 'success.main'
                          : 'primary.main';

                      const bgColor = isWarning
                        ? (t: { palette: { mode: string } }) =>
                            t.palette.mode === 'dark'
                              ? 'rgba(239, 140, 0, 0.08)'
                              : 'rgba(239, 140, 0, 0.03)'
                        : isSuccess
                          ? (t: { palette: { mode: string } }) =>
                              t.palette.mode === 'dark'
                                ? 'rgba(16, 185, 129, 0.08)'
                                : 'rgba(16, 185, 129, 0.03)'
                          : (t: { palette: { mode: string } }) =>
                              t.palette.mode === 'dark'
                                ? 'rgba(59, 130, 246, 0.08)'
                                : 'rgba(59, 130, 246, 0.03)';

                      const borderColor = isWarning
                        ? 'rgba(239, 140, 0, 0.2)'
                        : isSuccess
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)';

                      const isApplied =
                        rec.action &&
                        appliedTasks.has(rec.action.payload.taskId);

                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: bgColor,
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: borderColor,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                          }}
                        >
                          <Box display="flex" gap={1.5} alignItems="start">
                            <Box sx={{ mt: 0.25 }}>
                              {isWarning ? (
                                <WarningAmberIcon
                                  sx={{ color: iconColor, fontSize: 18 }}
                                />
                              ) : isSuccess ? (
                                <CheckCircleOutlineIcon
                                  sx={{ color: iconColor, fontSize: 18 }}
                                />
                              ) : (
                                <LightbulbIcon
                                  sx={{ color: iconColor, fontSize: 18 }}
                                />
                              )}
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{ fontSize: '13px', mb: 0.25 }}
                              >
                                {rec.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '12px', lineHeight: 1.45 }}
                              >
                                {rec.description}
                              </Typography>
                            </Box>
                          </Box>

                          {rec.action &&
                            rec.action.type === 'RESCHEDULE_TASK' && (
                              <Box
                                display="flex"
                                justifyContent="flex-end"
                                sx={{ mt: 0.5 }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleApplyAction(rec)}
                                  disabled={isApplied || isMutating}
                                  startIcon={
                                    isApplied ? (
                                      <CheckCircleOutlineIcon />
                                    ) : (
                                      <SparklesIcon sx={{ fontSize: 11 }} />
                                    )
                                  }
                                  sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    py: 0.25,
                                    px: 1.5,
                                    borderColor: isApplied
                                      ? 'success.main'
                                      : iconColor,
                                    color: isApplied
                                      ? 'success.main'
                                      : iconColor,
                                    '&:hover': {
                                      borderColor: isApplied
                                        ? 'success.main'
                                        : iconColor,
                                      bgcolor: `${iconColor}15`,
                                    },
                                  }}
                                >
                                  {isApplied
                                    ? 'Aplicado con Éxito'
                                    : rec.action.label}
                                </Button>
                              </Box>
                            )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
          </DialogContent>
        </Dialog>
      )}
    </ChartCard>
  );
};
