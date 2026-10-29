import { keyframes } from '@emotion/react';

// The guide frames' shared motion and accent colors.

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
`;
export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;
export const growX = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

/** Staggered entrance: each item `i` arrives a beat after the one before. */
export const enter = (i: number, base = 0.15) => ({
  opacity: 0,
  animation: `${fadeUp} 0.45s ease-out ${base + i * 0.09}s forwards`,
});

export const ACCENTS = {
  blue: '#3b82f6',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  green: '#10b981',
  rose: '#f43f5e',
  sky: '#0ea5e9',
} as const;
