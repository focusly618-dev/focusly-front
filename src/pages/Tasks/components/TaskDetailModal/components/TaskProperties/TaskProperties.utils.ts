export const triggerDurationError = (
  dTimeout: ReturnType<typeof setTimeout> | null,
  setDurationInputError: (err: string | null) => void,
  setDTimeout: (timeout: ReturnType<typeof setTimeout> | null) => void,
) => {
  setDurationInputError('Solo se permiten números y las letras h, m, s');
  if (dTimeout) clearTimeout(dTimeout);
  const t = setTimeout(() => setDurationInputError(null), 3000);
  setDTimeout(t);
};

export const triggerRealTimeError = (
  rTimeout: ReturnType<typeof setTimeout> | null,
  setRealTimeInputError: (err: string | null) => void,
  setRTimeout: (timeout: ReturnType<typeof setTimeout> | null) => void,
) => {
  setRealTimeInputError('Solo se permiten números y las letras h, m, s');
  if (rTimeout) clearTimeout(rTimeout);
  const t = setTimeout(() => setRealTimeInputError(null), 3000);
  setRTimeout(t);
};

export const sanitizeDurationValue = (value: string) =>
  value.replace(/[^0-9hHmMsS\s]/g, '');

export const getPriorityColor = (p: string) => {
  if (p === 'Critical') return '#ef4444';
  if (p === 'High') return '#f59e0b';
  if (p === 'Med') return '#3b82f6';
  if (p === 'Low') return '#10b981';
  return '#6b7280';
};
