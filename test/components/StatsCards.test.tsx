import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import i18n from '@/i18n';
import { getDesignTokens } from '@/context/theme/theme';
import { StatsCards } from '@/pages/Insights/components/StatsCards/StatsCards';
import type { StatsCardsProps } from '@/pages/Insights/components/StatsCards/StatsCards.types';

const stat = (value: string, change = '') =>
  ({ value, change, trend: 'neutral' }) as StatsCardsProps['energyScore'];

const distribution = (deep: number, meetings: number, rest = 0) => [
  { name: 'Deep Work', value: deep, color: '#000' },
  { name: 'Meetings', value: meetings, color: '#000' },
  { name: 'Admin/Misc', value: 0, color: '#000' },
  { name: 'Rest/Breaks', value: rest, color: '#000' },
];

const show = (over: Partial<StatsCardsProps> = {}) =>
  render(
    <ThemeProvider theme={createTheme(getDesignTokens('light'))}>
      <StatsCards
        totalFocusHours={stat('0h 0m', 'No data')}
        taskCompletion={stat('0%', '0%')}
        energyScore={stat('N/A', '0 pts')}
        breakHours={stat('0h 0m')}
        goldenWindow={stat('N/A')}
        timeDistribution={distribution(0, 0)}
        {...over}
      />
    </ThemeProvider>,
  );

beforeAll(async () => {
  await i18n.changeLanguage('es');
});

describe('StatsCards', () => {
  it('without data shows no invented numbers', () => {
    const { container } = show();
    const text = container.textContent ?? '';
    for (const invented of ['24h 15m', '85%', '78/100', '65%', '+12%', '+5%']) {
      expect(text).not.toContain(invented);
    }
    expect(screen.getByText('0h 0m')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.getAllByText('Sin datos todavía')).toHaveLength(3);
  });

  it('shows the real values', () => {
    show({
      totalFocusHours: stat('2h 30m'),
      taskCompletion: stat('40%'),
      energyScore: stat('55/100'),
    });
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('55/100')).toBeInTheDocument();
  });

  it('deep work is its share of the time worked, breaks aside', () => {
    show({ timeDistribution: distribution(90, 30, 500) });
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Del tiempo registrado')).toBeInTheDocument();
  });
});
