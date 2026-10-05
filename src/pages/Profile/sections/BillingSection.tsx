import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  CreditCard as CreditCardIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { billingApi } from '@/api/Billing/billingApi';
import { DEFAULT_PRO_PRICE_ID } from '@/config/stripe';
import { StripeCheckoutModal } from '@/components/Billing/StripeCheckoutModal';
import { sileo } from '@/utils';
import { Card, CardDescription, CardTitle, Divider } from '../Profile.styles';

export const BillingSection = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isPro = user?.subscriptionStatus === 'pro';

  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Inicia el proceso de suscripción obteniendo el client_secret de Stripe
  const handleStartUpgrade = async () => {
    setIsLoading(true);
    try {
      const data = await billingApi.createSubscription(
        DEFAULT_PRO_PRICE_ID,
        'pro_monthly',
      );
      setClientSecret(data.client_secret);
      setIsCheckoutOpen(true);
    } catch (err: unknown) {
      console.error('Error al iniciar suscripción:', err);
      sileo.error({
        title: 'Error al iniciar pago',
        description:
          'No se pudo conectar con la pasarela de Stripe. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Abre el portal oficial de Stripe para que el usuario gestione su método de pago o facturas
  const handleOpenPortal = async () => {
    setIsLoading(true);
    try {
      const data = await billingApi.getPortalUrl();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      console.error('Error al abrir portal:', err);
      sileo.error({
        title: 'Error al abrir portal',
        description:
          'No se pudo generar la sesión del portal de cliente de Stripe.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(updateUser({ subscriptionStatus: 'pro' }));
    sileo.success({
      title: '¡Bienvenido a Focusly Pro!',
      description: 'Tu suscripción mensual se ha activado exitosamente.',
    });
  };

  return (
    <>
      {/* 1. Tarjeta de Estado Actual */}
      <Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box>
            <CardTitle>Plan y Suscripción</CardTitle>
            <CardDescription>
              Administra tu facturación, métodos de pago guardados y beneficios
              de tu cuenta.
            </CardDescription>
          </Box>
          <Chip
            icon={isPro ? <StarIcon /> : undefined}
            label={isPro ? 'Plan Pro Activo ✨' : 'Plan Gratuito'}
            color={isPro ? 'primary' : 'default'}
            sx={{ fontWeight: 700, px: 1 }}
          />
        </Box>

        <Box sx={{ mt: 3, p: 2.5, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {isPro
              ? 'Tienes acceso total a todas las herramientas Pro'
              : 'Estás utilizando el plan Básico de Focusly'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isPro
              ? 'Tu suscripción mensual se renueva automáticamente. Puedes actualizar tus tarjetas o ver tus recibos en el portal.'
              : 'Actualiza a Focusly Pro para desbloquear workspaces ilimitados, asistentes de IA avanzados y sincronización completa.'}
          </Typography>

          {isPro && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<CreditCardIcon />}
                endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                onClick={handleOpenPortal}
                disabled={isLoading}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  'Administrar tarjetas y facturas en Stripe'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      <Divider />

      {/* 2. Comparativa de Planes */}
      <Card>
        <CardTitle>Planes disponibles</CardTitle>
        <CardDescription>
          Elige el plan que mejor se adapte a tu flujo de trabajo.
        </CardDescription>

        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          {/* Plan Free */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: !isPro ? 'primary.main' : 'divider',
                bgcolor: !isPro ? 'action.selected' : 'background.paper',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Focusly Free
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Para uso personal básico
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800, my: 2 }}>
                $0{' '}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  / para siempre
                </Typography>
              </Typography>

              <List dense sx={{ flexGrow: 1, mb: 2 }}>
                {[
                  'Hasta 3 Workspaces',
                  'Gestión de tareas y bloques de tiempo',
                  'Asistente de IA estándar',
                  'Integración básica de calendario',
                ].map((feature) => (
                  <ListItem key={feature} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon
                      sx={{ minWidth: 28, color: 'text.secondary' }}
                    >
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="outlined"
                disabled
                fullWidth
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {!isPro ? 'Plan actual' : 'Plan Básico'}
              </Button>
            </Box>
          </Grid>

          {/* Plan Pro */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: (theme) =>
                  `0 8px 24px ${theme.palette.primary.main}1A`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                  Focusly Pro ✨
                </Typography>
                <Chip
                  label="Recomendado"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                Productividad y automatización sin límites
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800, my: 2 }}>
                $9.99{' '}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  USD / mes
                </Typography>
              </Typography>

              <List dense sx={{ flexGrow: 1, mb: 2 }}>
                {[
                  'Workspaces y notas ilimitadas',
                  'Asistente de IA avanzado (Lumina) en editor',
                  'Detección automática de TODOs en notas',
                  'Planificador inteligente de agenda',
                  'Sincronización bidireccional continua con Google Meet',
                  'Soporte prioritario 24/7',
                ].map((feature) => (
                  <ListItem key={feature} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'primary.main' }}>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              {isPro ? (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleOpenPortal}
                  disabled={isLoading}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  Gestionar suscripción
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleStartUpgrade}
                  disabled={isLoading}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    py: 1,
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    'Mejorar a Focusly Pro ✨'
                  )}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 3. Modal de Stripe Elements (Payment Element) */}
      <StripeCheckoutModal
        open={isCheckoutOpen}
        clientSecret={clientSecret}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
        planName="Focusly Pro"
        amountDisplay="$9.99 USD / mes"
      />
    </>
  );
};
