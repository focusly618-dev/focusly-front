import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { sileo } from '@/utils';
import { LuminaAnimatedFace } from '@/components/ui';
import { useAppDispatch } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { billingApi } from '@/api/Billing/billingApi';
import { DEFAULT_PRO_PRICE_ID } from '@/config/stripe';
import { StripeCheckoutModal } from '@/components/Billing/StripeCheckoutModal';
import type { UpgradeModalProps } from './UpgradeModal.types';
import { UPGRADE_PLANS } from './UpgradeModal.utils';
import {
  dialogPaperSx,
  planCardSx,
  popularBadgeSx,
  bulletRowSx,
  bulletEmojiSx,
  bulletTextSx,
  bulletSubTextSx,
  ctaButtonSx,
  headerRowSx,
  logoTitleRowSx,
  closeIconButtonSx,
  closeIconSx,
  introBoxSx,
  introTextSx,
  plansContainerSx,
  priceSuffixSx,
  dividerSx,
  featuresListSx,
} from './UpgradeModal.styles';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onClose,
  onUpgradeSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const data = await billingApi.createSubscription(
        DEFAULT_PRO_PRICE_ID,
        'pro_monthly',
      );
      setClientSecret(data.client_secret);
      setIsCheckoutOpen(true);
    } catch (err: unknown) {
      console.error('Error starting subscription:', err);
      sileo.error({
        title: 'Error al iniciar suscripción',
        description:
          'No se pudo conectar con la pasarela de pagos. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    dispatch(updateUser({ subscriptionStatus: 'pro' }));
    onClose();
    sileo.success({
      title: '¡Plan Actualizado!',
      description: '¡Gracias por suscribirte a Focusly Pro!',
      duration: 4500,
    });
    onUpgradeSuccess?.('Focusly Pro');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: dialogPaperSx,
        }}
      >
        {/* Header */}
        <Box sx={headerRowSx}>
          <Box sx={logoTitleRowSx}>
            <LuminaAnimatedFace size={24} />
            <Typography
              variant="subtitle1"
              fontWeight={750}
              color="text.primary"
            >
              Mejorar Plan de Focusly
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={closeIconButtonSx}>
            <CloseIcon sx={closeIconSx} />
          </IconButton>
        </Box>

        {/* Main Intro */}
        <Box sx={introBoxSx}>
          <Typography variant="body2" color="text.secondary" sx={introTextSx}>
            Elige el plan que mejor se adapte a tu ritmo de trabajo y desbloquea
            el poder del asistente de IA.
          </Typography>
        </Box>

        {/* Plans Container */}
        <Box sx={plansContainerSx}>
          {UPGRADE_PLANS.map((plan) => (
            <Box
              key={plan.id}
              sx={planCardSx(plan.featured ? 'featured' : 'default')}
            >
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
                    color="text.primary"
                    mb={0.5}
                  >
                    {plan.name}
                  </Typography>
                )}

                <Box display="flex" alignItems="baseline" mb={1.75}>
                  <Typography
                    variant="h5"
                    fontWeight={850}
                    color="text.primary"
                  >
                    {plan.price}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={priceSuffixSx}
                  >
                    {plan.priceSuffix}
                  </Typography>
                </Box>

                <Divider sx={dividerSx} />

                <Box sx={featuresListSx}>
                  {plan.features.map((feature, idx) => (
                    <Box key={idx} sx={bulletRowSx}>
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
                            <Box component="span" sx={bulletSubTextSx}>
                              {feature.subText}
                            </Box>
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
                disabled={plan.cta.disabled || isLoading}
                variant={plan.cta.variant}
                onClick={plan.cta.disabled ? undefined : handleUpgrade}
                sx={ctaButtonSx(plan.id)}
              >
                {isLoading && plan.id === 'pro' ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  plan.cta.label
                )}
              </Button>
            </Box>
          ))}
        </Box>
      </Dialog>

      {/* Stripe Payment Element Checkout Modal */}
      <StripeCheckoutModal
        open={isCheckoutOpen}
        clientSecret={clientSecret}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleSuccess}
        planName="Focusly Pro"
        amountDisplay="$9.99 USD / mes"
      />
    </>
  );
};

export default UpgradeModal;
