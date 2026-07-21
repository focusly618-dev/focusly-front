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

  const currentView = searchParams.get('v') || 'day';
  const isMonthView = currentView === 'month';

  const isSelected = useMemo(() => {
    if (isMonthView) return false;
    const d = searchParams.get('d');
    if (!d) return false;
    const [year, month, day] = d.split('-').map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const selectedDate = new Date(year, month - 1, day);
      return isSameDay(date, selectedDate);
    }
    return false;
  }, [searchParams, date, isMonthView]);

  const handleClick = () => {
    if (isMonthView) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('d', format(date, 'yyyy-MM-dd'));
    setSearchParams(newParams);
  };

  if (isMonthView) {
    return (
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          py: 1.5,
          display: 'inline-block',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {dayName}
      </Typography>
    );
  }

  return (
    <Typography
      onClick={handleClick}
      sx={{
        fontSize: '12px',
        fontWeight: active || isSelected ? 700 : 500,
        color: active
          ? 'text.primary'
          : isSelected
            ? 'primary.main'
            : 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        py: 1.5,
        borderBottom: isSelected ? '2px solid' : 'none',
        borderColor: 'primary.main',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          color: active ? 'text.primary' : 'primary.main',
          opacity: 0.85,
        },
      }}
    >
      {dayName} {dayNumber}
    </Typography>
  );
};
