import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { Invoice } from '@/api/Billing/billingApi';

const api = vi.hoisted(() => ({ getInvoices: vi.fn() }));
vi.mock('@/api/Billing/billingApi', () => ({ billingApi: api }));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'number' in opts
        ? `${key}:${opts.number}`
        : opts && 'amount' in opts
          ? `${key}:${opts.amount}`
          : key,
    i18n: { language: 'en' },
  }),
}));

const { PaymentHistory } = await import('@/components/Billing/PaymentHistory');

const invoice = (over: Partial<Invoice> = {}): Invoice => ({
  id: 'in_1',
  number: 'F-0001',
  created: 1_790_000_000,
  paid_at: 1_790_000_100,
  status: 'paid',
  trial: false,
  subtotal: 999,
  discount: 0,
  total: 999,
  amount_paid: 999,
  amount_refunded: 0,
  currency: 'usd',
  period_start: 1_790_000_000,
  period_end: 1_792_678_400,
  interval: 'month',
  hosted_invoice_url: 'https://invoice.stripe.com/i/1',
  invoice_pdf: 'https://pay.stripe.com/invoice/1/pdf',
  ...over,
});

const load = async () => {
  render(<PaymentHistory />);
  await act(async () => {});
};

describe('PaymentHistory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loading: a skeleton, announced', () => {
    api.getInvoices.mockReturnValue(new Promise(() => {}));
    render(<PaymentHistory />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('each payment: date, plan, amount, status, receipt and PDF', async () => {
    api.getInvoices.mockResolvedValue([
      invoice({ discount: 200, amount_paid: 799, total: 799 }),
      invoice({ id: 'in_2', number: 'F-0002', status: 'refunded' }),
      invoice({
        id: 'in_3',
        number: 'F-0003',
        trial: true,
        amount_paid: 0,
        total: 0,
        hosted_invoice_url: null,
        invoice_pdf: null,
      }),
      invoice({
        id: 'in_4',
        number: 'F-0004',
        interval: 'year',
        amount_paid: 9990,
      }),
    ]);
    await load();

    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent('billing.history.plan.month');
    expect(rows[0]).toHaveTextContent('billing.history.discount:$2');
    expect(rows[0]).toHaveTextContent('$7.99');
    expect(rows[0]).toHaveTextContent('billing.history.status.paid');
    expect(
      within(rows[0]).getByRole('link', {
        name: 'billing.history.receiptFor:F-0001',
      }),
    ).toHaveAttribute('href', 'https://invoice.stripe.com/i/1');
    expect(
      within(rows[0]).getByRole('link', {
        name: 'billing.history.pdfFor:F-0001',
      }),
    ).toHaveAttribute('target', '_blank');

    expect(rows[1]).toHaveTextContent('billing.history.status.refunded');
    expect(rows[2]).toHaveTextContent('billing.history.status.trial');
    expect(rows[2]).toHaveTextContent('$0');
    expect(within(rows[2]).queryAllByRole('link')).toHaveLength(0);
    expect(rows[3]).toHaveTextContent('billing.history.plan.year');
    expect(rows[3]).toHaveTextContent('$99.90');
  });

  it('no payments yet', async () => {
    api.getInvoices.mockResolvedValue([]);
    await load();
    expect(screen.getByText('billing.history.empty')).toBeInTheDocument();
  });

  it('Stripe unreachable: says so and can retry', async () => {
    api.getInvoices.mockRejectedValueOnce(new Error('502'));
    await load();
    expect(screen.getByText('billing.history.error')).toBeInTheDocument();

    api.getInvoices.mockResolvedValue([invoice()]);
    await act(async () => {
      fireEvent.click(screen.getByText('billing.history.retry'));
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(api.getInvoices).toHaveBeenCalledTimes(2);
  });
});
