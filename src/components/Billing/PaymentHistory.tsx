import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  PictureAsPdfOutlined as PdfIcon,
  ReceiptLongOutlined as ReceiptIcon,
} from '@mui/icons-material';
import {
  billingApi,
  type Invoice,
  type InvoiceStatus,
} from '@/api/Billing/billingApi';
import { formatPrice } from '@/config/plans';
import { ListRowSkeleton } from '@/components/ui';

const STATUS_COLOR: Record<
  InvoiceStatus | 'trial',
  'success' | 'warning' | 'default' | 'info'
> = {
  paid: 'success',
  trial: 'info',
  open: 'warning',
  uncollectible: 'warning',
  refunded: 'default',
  partially_refunded: 'default',
};

const shortDate = (unixSeconds: number, locale: string) =>
  new Date(unixSeconds * 1000).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** Every Focusly payment: date, plan and period, amount, status, receipt. */
export const PaymentHistory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    billingApi
      .getInvoices()
      .then((rows) => {
        if (!cancelled) setInvoices(rows);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setFailed(false);
    setInvoices(null);
    setAttempt((n) => n + 1);
  };

  if (failed) {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={retry}>
            {t('billing.history.retry')}
          </Button>
        }
      >
        {t('billing.history.error')}
      </Alert>
    );
  }
  if (!invoices) {
    return (
      <ListRowSkeleton
        rows={3}
        leading={false}
        label={t('billing.history.loading')}
      />
    );
  }
  if (invoices.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('billing.history.empty')}
      </Typography>
    );
  }

  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {invoices.map((invoice) => {
        const kind = invoice.trial ? 'trial' : invoice.status;
        const amount = formatPrice(
          {
            amount: invoice.trial ? 0 : invoice.amount_paid || invoice.total,
            currency: invoice.currency,
          },
          locale,
        );
        const period =
          invoice.period_start && invoice.period_end
            ? `${shortDate(invoice.period_start, locale)} – ${shortDate(
                invoice.period_end,
                locale,
              )}`
            : null;
        return (
          <Box
            component="li"
            key={invoice.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr auto',
                sm: 'minmax(96px, auto) 1fr auto auto',
              },
              alignItems: 'center',
              columnGap: 2,
              rowGap: 0.5,
              py: 1.25,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-of-type': { borderBottom: 0 },
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}
            >
              {shortDate(invoice.paid_at ?? invoice.created, locale)}
            </Typography>
            <Box sx={{ minWidth: 0, gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
              <Typography variant="body2" noWrap>
                {t(`billing.history.plan.${invoice.interval}`)}
                {invoice.discount > 0 &&
                  ` · ${t('billing.history.discount', {
                    amount: formatPrice(
                      { amount: invoice.discount, currency: invoice.currency },
                      locale,
                    ),
                  })}`}
              </Typography>
              {period && (
                <Typography variant="caption" color="text.secondary">
                  {period}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifySelf: 'end',
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 750, fontVariantNumeric: 'tabular-nums' }}
              >
                {amount}
              </Typography>
              <Chip
                size="small"
                color={STATUS_COLOR[kind]}
                variant={kind === 'paid' ? 'filled' : 'outlined'}
                label={t(`billing.history.status.${kind}`)}
                sx={{ fontWeight: 650, height: 22 }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 0.25,
                justifySelf: 'end',
                gridColumn: { xs: '2', sm: 'auto' },
                gridRow: { xs: '1', sm: 'auto' },
              }}
            >
              {invoice.hosted_invoice_url && (
                <Tooltip title={t('billing.history.receipt')}>
                  <IconButton
                    size="small"
                    component="a"
                    href={invoice.hosted_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('billing.history.receiptFor', {
                      number: invoice.number ?? invoice.id,
                    })}
                  >
                    <ReceiptIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {invoice.invoice_pdf && (
                <Tooltip title={t('billing.history.pdf')}>
                  <IconButton
                    size="small"
                    component="a"
                    href={invoice.invoice_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('billing.history.pdfFor', {
                      number: invoice.number ?? invoice.id,
                    })}
                  >
                    <PdfIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
