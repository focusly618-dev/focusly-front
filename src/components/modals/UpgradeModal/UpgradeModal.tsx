import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { sileo } from '@/utils';
import { LuminaAnimatedFace } from '@/components/ui';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onClose,
}) => {
  const handleUpgrade = (planName: string) => {
    onClose();
    sileo.success({
      title: 'Plan Actualizado',
      description: `¡Gracias por actualizar tu suscripción a ${planName}!`,
      duration: 4500,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 3.5,
          width: '840px',
          maxWidth: 'calc(100vw - 32px)',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#191919' : '#ffffff',
          backgroundImage: 'none',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LuminaAnimatedFace size={24} />
          <Typography variant="subtitle1" fontWeight={750} color="text.primary">
            Mejorar Plan de Focusly
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Main Intro */}
      <Box mb={3}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          Elige el plan que mejor se adapte a tu ritmo de trabajo y desbloquea
          el poder del asistente de IA.
        </Typography>
      </Box>

      {/* Plans Container */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' }}
        gap={3.5}
      >
        {/* Free Plan */}
        <Box
          flex={1}
          minWidth="220px"
          sx={{
            p: 2.2,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.01)'
                : 'rgba(0,0,0,0.005)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              mb={0.5}
              color="text.primary"
            >
              Focusly Free
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              mb={2}
              color="text.primary"
            >
              $0
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                / siempre gratis
              </Typography>
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={1.75} mb={3}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  📋
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Límite de 4 conversaciones
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  ⚡
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Respuestas básicas del asistente
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  ❌
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Sin IA en el editor de workspaces
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            disabled
            fullWidth
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '6px',
              color: 'text.disabled',
              borderColor: 'divider',
              fontSize: '11px',
            }}
          >
            Plan Actual
          </Button>
        </Box>

        {/* Pro Plan */}
        <Box
          flex={1}
          minWidth="220px"
          sx={{
            p: 2.2,
            borderRadius: '8px',
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.04)'
                : 'rgba(99, 102, 241, 0.01)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)',
          }}
        >
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0.5}
            >
              <Typography
                variant="subtitle2"
                fontWeight={800}
                color="primary.main"
              >
                Focusly Pro
              </Typography>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '4px',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '8px',
                  fontWeight: 800,
                }}
              >
                POPULAR
              </Box>
            </Box>
            <Typography
              variant="h5"
              fontWeight={850}
              mb={2}
              color="text.primary"
            >
              $8
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                / mes
              </Typography>
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={1.75} mb={3}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  ✨
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Chats ilimitados con IA
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  📝
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Editor de workspaces con IA</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Genera y expande textos)
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🧠
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Contexto avanzado de tareas
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  📅
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Hábitos inteligentes</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Optimización diaria de rutinas)
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  📂
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Exportación rápida</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Descarga notas en Markdown y PDF)
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => handleUpgrade('Focusly Pro')}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '6px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 'none',
              fontSize: '11px',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: 'none',
              },
            }}
          >
            Pagar y Desbloquear
          </Button>
        </Box>

        {/* Max/Elite Plan */}
        <Box
          flex={1}
          minWidth="220px"
          sx={{
            p: 2.2,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.01)'
                : 'rgba(0,0,0,0.005)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              mb={0.5}
              color="text.primary"
            >
              Focusly Elite
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              mb={2}
              color="text.primary"
            >
              $15
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                / mes
              </Typography>
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={1.75} mb={3}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🚀
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Respuestas rápidas prioritarias
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🪄
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>IA en Editor ilimitada</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Fórmulas, traducción y bloques)
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  👥
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Trabajo en equipo colaborativo
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  📈
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  Insights profundos de productividad
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🛡️
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Historial de versiones</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Respaldos automáticos de workspaces)
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🎙️
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Notas por voz con IA</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Transcripción de audios a tareas)
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🚀
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Modelos de IA premium</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Acceso a Claude 3 Opus y Gemini Pro)
                  </span>
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <Typography
                  component="span"
                  sx={{ fontSize: '13px', lineHeight: 1.3 }}
                >
                  🎨
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ fontSize: '11px', lineHeight: 1.4 }}
                >
                  <strong>Personalización completa</strong>
                  <br />
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--mui-palette-text-secondary)',
                    }}
                  >
                    (Temas y branding a tu medida)
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleUpgrade('Focusly Elite')}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '6px',
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: '11px',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'rgba(99, 102, 241, 0.04)',
              },
            }}
          >
            Mejorar a Elite
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
export default UpgradeModal;
