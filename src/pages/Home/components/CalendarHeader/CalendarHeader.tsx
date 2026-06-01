import type { HeaderProps } from 'react-big-calendar';
import { format, isToday, isSameDay } from 'date-fns';
import { Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export const CalendarHeader = (props: HeaderProps) => {
  const { date } = props;
  const dayName = format(date, 'EEE').toUpperCase();
  const dayNumber = format(date, 'd');
  const active = isToday(date);
  const [searchParams, setSearchParams] = useSearchParams();

  const isSelected = useMemo(() => {
    const d = searchParams.get('d');
    if (!d) return false;
    const [year, month, day] = d.split('-').map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const selectedDate = new Date(year, month - 1, day);
      return isSameDay(date, selectedDate);
    }
    return false;
  }, [searchParams, date]);

  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('d', format(date, 'yyyy-MM-dd'));
    setSearchParams(newParams);
  };

  return (
    <Typography
      onClick={handleClick}
      sx={{
        fontSize: '12px',
        fontWeight: active || isSelected ? 700 : 500,
        color: active
          ? 'text.primary'
          : isSelected
            ? '#ef4444'
            : 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        py: 1.5,
        borderBottom: isSelected ? '2px solid #ef4444' : 'none',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          color: active ? 'text.primary' : '#ef4444',
          opacity: 0.85,
        },
      }}
    >
      {dayName} {dayNumber}
    </Typography>
  );
};
