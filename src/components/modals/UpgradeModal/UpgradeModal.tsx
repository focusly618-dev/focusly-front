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
import type { UpgradeModalProps } from './UpgradeModal.types';
import { UPGRADE_PLANS } from './UpgradeModal.utils';
import {
  dialogPaperSx,
  planCardSx,
  popularBadgeSx,
  bulletRowSx,
  bulletEmojiSx,
  bulletTextSx,
  bulletSubTextStyle,
  ctaButtonSx,
} from './UpgradeModal.styles';

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
        sx: dialogPaperSx,
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
        {UPGRADE_PLANS.map((plan) => (
          <Box key={plan.id} sx={planCardSx(plan.featured ? 'featured' : 'default')}>
            <Box>
              {plan.popular ? (
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
                    {plan.name}
                  </Typography>
                  <Box sx={popularBadgeSx}>POPULAR</Box>
                </Box>
              ) : (
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  mb={0.5}
                  color="text.primary"
                >
                  {plan.name}
                </Typography>
              )}
              <Typography
                variant="h5"
                fontWeight={plan.featured ? 850 : 800}
                mb={2}
                color="text.primary"
              >
                {plan.price}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                >
                  {plan.priceSuffix}
                </Typography>
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={1.75} mb={3}>
                {plan.features.map((feature, index) => (
                  <Box key={index} sx={bulletRowSx}>
                    <Typography component="span" sx={bulletEmojiSx}>
                      {feature.emoji}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={bulletTextSx(feature.highlighted)}
                    >
                      {feature.boldText ? (
                        <>
                          <strong>{feature.boldText}</strong>
                          <br />
                          <span style={bulletSubTextStyle}>
                            {feature.subText}
                          </span>
                        </>
                      ) : (
                        feature.text
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button
              fullWidth
              disabled={plan.cta.disabled}
              variant={plan.cta.variant}
              onClick={
                plan.cta.disabled ? undefined : () => handleUpgrade(plan.name)
              }
              sx={ctaButtonSx(plan.id)}
            >
              {plan.cta.label}
            </Button>
          </Box>
        ))}
      </Box>
    </Dialog>
  );
};
export default UpgradeModal;
