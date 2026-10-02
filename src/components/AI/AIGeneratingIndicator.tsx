import React, { useEffect, useState } from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LuminaAnimatedFace } from '@/components/ui';
import { aiStreamService } from '@/services/aiStreamService';
import { surfaceColor } from '@/context';

const floatIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 8px 24px rgba(0, 135, 103, 0.25), 0 0 0 1px rgba(0, 135, 103, 0.35);
  }
  50% {
    box-shadow: 0 12px 32px rgba(0, 135, 103, 0.4), 0 0 0 2px rgba(5, 150, 105, 0.5);
  }
`;

interface AIGeneratingIndicatorProps {
  onOpenChat: () => void;
}

export const AIGeneratingIndicator: React.FC<AIGeneratingIndicatorProps> = ({
  onOpenChat,
}) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(
    aiStreamService.isGenerating(),
  );

  useEffect(() => {
    const unsubscribe = aiStreamService.subscribe((event) => {
      if (event.type === 'chunk') {
        setIsGenerating(true);
      } else if (event.type === 'done' || event.type === 'error') {
        setIsGenerating(false);
      }
    });

    return unsubscribe;
  }, []);

  if (!isGenerating) {
    return null;
  }

  return (
    <Box
      onClick={onOpenChat}
      role="button"
      tabIndex={0}
      aria-label="Volver a Lumina AI Chat"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.2,
        borderRadius: '9999px',
        bgcolor: (theme) =>
          surfaceColor(
            theme,
            'rgba(15, 15, 22, 0.88)',
            'rgba(25, 25, 25, 0.88)',
            'rgba(255, 255, 255, 0.92)',
          ),
        backdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(0, 135, 103, 0.4)'
            : 'rgba(0, 135, 103, 0.3)',
        color: (theme) => theme.palette.text.primary,
        cursor: 'pointer',
        animation: `${floatIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1), ${pulseGlow} 2.5s infinite ease-in-out`,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px) scale(1.02)',
        },
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LuminaAnimatedFace size={20} primaryColor="#008767" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #059669 0%, #008767 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('askAi.generatingTitle', 'Lumina está respondiendo...')}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '10.5px',
            color: 'text.secondary',
            lineHeight: 1.1,
          }}
        >
          {t('askAi.clickToView', 'Haz clic para ver')}
        </Typography>
      </Box>
    </Box>
  );
};
