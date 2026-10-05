import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import confetti from 'canvas-confetti';
import { stripePromise } from '@/config/stripe';

interface CheckoutFormProps {
  onClose: () => void;
  onSuccess: () => void;
  planName?: string;
  amountDisplay?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onClose,
  onSuccess,
  planName = 'Focusly Pro',
  amountDisplay = '$9.99 USD / mes',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile/billing?success=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(
          error.message ||
            'No se pudo procesar el pago. Por favor verifica tus datos.',
        );
        setIsProcessing(false);
      } else if (
        paymentIntent?.status === 'succeeded' ||
        paymentIntent?.status === 'processing'
      ) {
        setIsComplete(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti if not available
        }
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        // Fallback for 3DS or other redirection
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado al procesar el pago.';
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          ¡Pago completado con éxito!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tu cuenta ha sido actualizada a {planName}. Disfruta de todos los
          beneficios.
        </Typography>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2.5, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {planName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Facturación recurrente mensual
            </Typography>
          </Box>
          <Chip
            label={amountDisplay}
            color="primary"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Stripe Payment Element - Genera dinámicamente campos para Tarjetas, Apple Pay, Google Pay, etc. */}
      <Box sx={{ mb: 3, minHeight: 180 }}>
        <PaymentElement
          id="payment-element"
          options={{
            layout: 'tabs',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          mb: 2,
        }}
      >
        <LockIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption">
          Pagos 100% seguros y cifrados vía Stripe
        </Typography>
      </Box>

      <DialogActions sx={{ px: 0, pb: 0 }}>
        <Button onClick={onClose} disabled={isProcessing} color="inherit">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || !elements || isProcessing}
          sx={{
            minWidth: 140,
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: 'primary.main',
          }}
        >
          {isProcessing ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Suscribirme (${amountDisplay.split(' ')[0]})`
          )}
        </Button>
      </DialogActions>
    </form>
  );
};

export interface StripeCheckoutModalProps {
  open: boolean;
  clientSecret: string | null;
  onClose: () => void;
  onSuccess: () => void;
  planName?: string;
  amountDisplay?: string;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  open,
  clientSecret,
  onClose,
  onSuccess,
  planName = 'Focusly Pro',
  amountDisplay = '$9.99 USD / mes',
}) => {
  if (!open || !clientSecret) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: { xs: 1.5, sm: 2.5 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 0,
          pt: 0,
          pb: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Completar suscripción
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 0, py: 1 }}>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#6366f1',
                borderRadius: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            },
          }}
        >
          <CheckoutForm
            onClose={onClose}
            onSuccess={onSuccess}
            planName={planName}
            amountDisplay={amountDisplay}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
