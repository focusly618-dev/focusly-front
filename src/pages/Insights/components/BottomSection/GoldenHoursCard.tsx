import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import {
  WbSunny,
  InfoOutlined as InfoIcon,
  AutoAwesome as SparklesIcon,
} from '@mui/icons-material';
import { ChartCard } from '../../Insights.styles';
import {
  fetchAIBehavioralPatterns,
  type PatternAnalysisData,
} from '@/api/AI/apiAIInsights';
import { sileo } from '@/utils';

import { useAppSelector } from '@/redux/hooks';

export interface GoldenHoursCardProps {
  fallbackGoldenWindow: string;
}

const CACHE_KEY_PREFIX = 'focusly_ai_patterns_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const GoldenHoursCard: React.FC<GoldenHoursCardProps> = ({
  fallbackGoldenWindow,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<PatternAnalysisData | null>(
    null,
  );

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
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Style chip & summary */}
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

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  PATRONES DETECTADOS
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {analysisData.patterns.map((p) => (
                    <Chip
                      key={p.label}
                      icon={<span>{p.icon}</span>}
                      label={p.label}
                      size="small"
                      sx={{
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.04)',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                >
                  ANÁLISIS DE COMPORTAMIENTO
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
    </ChartCard>
  );
};
