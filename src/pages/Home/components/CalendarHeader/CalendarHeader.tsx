import type { HeaderProps } from 'react-big-calendar';
import { format, isToday } from 'date-fns';
import { Typography } from '@mui/material';

export const CalendarHeader = (props: HeaderProps) => {
  const { date } = props;
  const dayName = format(date, 'EEE').toUpperCase();
  const dayNumber = format(date, 'd');
  const active = isToday(date);

  return (
    <Typography
      sx={{
        fontSize: '12px',
        fontWeight: active ? 700 : 500,
        color: active ? 'text.primary' : 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        py: 1.5,
      }}
    >
      {dayName} {dayNumber}
    </Typography>
  );
};
