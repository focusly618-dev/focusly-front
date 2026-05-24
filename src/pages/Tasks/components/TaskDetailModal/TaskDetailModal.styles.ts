import type { Theme } from '@mui/material/styles';

// Common Input Sx
export const darkInputSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
  borderRadius: '12px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
    color: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#e0e2e9' : '#000',
    fontSize: '14px',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'divider',
    },
    '&:hover fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.18)'
          : 'action.hover',
    },
    '&.Mui-focused fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#6366f1' : 'primary.main',
    },
    '&.Mui-focused': {
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(26, 31, 43, 0.9)'
          : 'background.default',
      boxShadow: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? '0 0 0 3px rgba(99, 102, 241, 0.15)'
          : 'none',
    },
    '& input': {
      padding: '10px 14px',
      '&::placeholder': {
        color: 'text.secondary',
        opacity: 0.8,
      },
    },
    '& textarea': {
      '&::placeholder': {
        color: 'text.secondary',
        opacity: 0.8,
      },
    },
  },
  '& .MuiPickersInputBase-root': {
    borderRadius: '12px',
  },
  '& css-mxuir2-MuiButtonBase-root-MuiMenuItem-root-MuiMultiSectionDigitalClockSection-item.Mui-selected':
    {
      borderRadius: '12px',
    },
  '& .MuiInputBase-input': {
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  },
  '& .MuiSvgIcon-root': { color: 'text.secondary' },
};

export const darkInputSxTimers = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
    borderRadius: '8px',
    color: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#e0e2e9' : '#000',
    fontSize: '14px',
    '& fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'divider',
    },
    '&:hover fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.18)'
          : 'action.hover',
    },
    '&.Mui-focused fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#6366f1' : 'primary.main',
    },
    '&.Mui-focused': {
      boxShadow: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? '0 0 0 3px rgba(99, 102, 241, 0.15)'
          : 'none',
    },
    '& input': {
      padding: '5px 5px',
      '&::placeholder': {
        color: 'text.secondary',
        opacity: 0.8,
      },
    },
    '& textarea': {
      '&::placeholder': {
        color: 'text.secondary',
        opacity: 0.8,
      },
    },
  },
  '& .MuiInputBase-input': {
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  },
  '& .MuiSvgIcon-root': { color: 'text.secondary' },
};

export const labelSx = {
  color: 'text.secondary',
  mb: 0.5,
  display: 'block',
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

export const paperPropsSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(17, 24, 39, 0.85)'
      : 'background.paper',
  backgroundImage: 'none',
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#e0e2e9' : '#000'),
  borderRadius: '16px',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'divider',
  backdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  WebkitBackdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      : 'none',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const deleteButtonSx = {
  bgcolor: '#f24848',
  color: 'white',
  textTransform: 'none' as const,
  fontWeight: 600,
  borderRadius: '8px',
  px: 2,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: '#d83a3a',
    boxShadow: 'none',
  },
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

export const dialogTitleSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '16px',
  fontWeight: 600,
  borderBottom: '1px solid',
  borderColor: 'divider',
  padding: '16px 24px',
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(17, 24, 39, 0.4)'
      : 'background.paper',
};

export const iconBoxSx = {
  width: 24,
  height: 24,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const headerIconSx = {
  color: 'text.secondary',
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

export const dialogContentSx = { p: 3, paddingTop: '12px !important' };

export const propertyListSx = {
  mt: 2,
  px: 4,
  mb: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const propertyRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  minHeight: '36px',
};

export const propertyLabelSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  minWidth: '150px',
  color: 'text.secondary',
};

export const propertyValueSx = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  flex: 1,
};

export const titleInputPropsSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
    borderRadius: '12px',
    padding: '4px 8px',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'divider',
    },
    '&.Mui-focused fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#6366f1' : 'primary.main',
    },
    '&.Mui-focused': {
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(26, 31, 43, 0.9)'
          : 'background.default',
      boxShadow: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? '0 0 0 3px rgba(99, 102, 241, 0.15)'
          : 'none',
    },
    '& input': {
      color: (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#fff' : '#000',
      padding: '8px 12px',
      '&::placeholder': {
        color: 'text.secondary',
        opacity: 0.5,
      },
    },
  },
};

export const statusSelectSx = {
  ...darkInputSx,
  borderRadius: '15px',
  width: '100%',
  '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
};

export const menuPaperPropsSx = {
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(26, 31, 43, 0.95)'
      : 'background.paper',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'divider',
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#e0e2e9' : '#000'),
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? '0 10px 20px rgba(0,0,0,0.3)'
      : '0 4px 20px rgba(0,0,0,0.15)',
  backdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  WebkitBackdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  mt: 1,
  '& .MuiMenuItem-root': {
    borderRadius: '6px',
    mx: 1,
    my: 0.5,
    '&:hover': {
      bgcolor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'action.hover',
    },
    '&.Mui-selected': {
      bgcolor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(99, 102, 241, 0.15)'
          : 'action.selected',
      color: (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#818cf8' : undefined,
      '&:hover': {
        bgcolor: (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(99, 102, 241, 0.25)'
            : 'action.selected',
      },
    },
  },
};

// removed duplicate labelSx

export const dialogActionsSx = {
  padding: '16px 24px',
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(17, 24, 39, 0.4)'
      : 'background.paper',
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
};

export const cancelButtonSx = {
  color: 'text.secondary',
  textTransform: 'none' as const,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

export const saveButtonSx = {
  background: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)'
      : undefined,
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? undefined : 'primary.main',
  color: '#fff',
  textTransform: 'none' as const,
  borderRadius: '8px',
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? '0 4px 14px 0 rgba(99, 102, 241, 0.3)'
      : 'none',
  fontWeight: 600,
  px: 3,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)'
        : undefined,
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? undefined : 'primary.dark',
    boxShadow: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? '0 6px 20px rgba(99, 102, 241, 0.5)'
        : 'none',
    transform: 'translateY(-1px)',
  },
};

export const descriptionInputSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
  borderRadius: '12px',
  mt: 1,
  '& .MuiOutlinedInput-root': {
    padding: '12px 16px',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'divider',
    },
    '&.Mui-focused fieldset': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'dark' ? '#6366f1' : 'primary.main',
    },
    '&.Mui-focused': {
      boxShadow: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? '0 0 0 3px rgba(99, 102, 241, 0.15)'
          : 'none',
    },
  },
  '& textarea': {
    fontSize: '14px',
    lineHeight: 1.6,
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
    '&::placeholder': {
      color: 'text.secondary',
      opacity: 0.6,
    },
  },
};

export const tagChipSx = {
  height: 24,
  fontSize: 12,
  bgcolor: 'action.hover',
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
};

export const addTagInputSx = {
  height: 24,
  width: 80,
  fontSize: 12,
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  bgcolor: 'background.default',
};

export const smallLabelSx = {
  ...labelSx,
  mb: 1,
  display: 'block',
  fontSize: '10px',
};

export const autocompletePaperSx = {
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(26, 31, 43, 0.95)'
      : 'background.paper',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'divider',
  borderRadius: '10px',
  mt: 1,
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#e0e2e9' : '#000'),
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? '0 10px 20px rgba(0,0,0,0.3)'
      : '0 4px 20px rgba(0,0,0,0.15)',
  backdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
  WebkitBackdropFilter: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'blur(16px)' : 'none',
};

// removed duplicate autocompletePaperSx

export const timeSlotBoxSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'divider',
  borderRadius: '12px',
  p: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 2,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'action.hover',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#6366f1' : 'primary.main',
  },
};

export const datePickerPopperSx = {
  '& .MuiPickersLayout-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiPickersDay-root': {
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
  '& .MuiPickersDay-root.Mui-selected': {
    backgroundColor: 'primary.main',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  },
  '& .MuiPickersDay-today': {
    border: '1px solid',
    borderColor: 'primary.main',
  },
  '& .MuiDayCalendar-weekDayLabel': {
    color: 'text.secondary',
  },
  '& .MuiPickersCalendarHeader-label': {
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  },
  '& .MuiPickersCalendarHeader-switchViewButton': {
    color: 'text.secondary',
  },
  '& .MuiPickersArrowSwitcher-button': {
    color: 'text.secondary',
  },
  '& .MuiPickersYear-yearButton': {
    color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  },
  '& .MuiPickersYear-yearButton.Mui-selected': {
    backgroundColor: 'primary.main',
    color: '#fff',
  },
};

export const datePickerPaperSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#111827' : 'background.default',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '16px',
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#e0e2e9' : '#000'),
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
};

export const timePickerPopperSx = {
  '& .MuiPickersLayout-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiClockPointer-root': {
    backgroundColor: 'primary.main',
  },
  '& .MuiClockPointer-thumb': {
    backgroundColor: 'primary.main',
    borderColor: 'background.default',
  },
  '& .MuiClock-pin': {
    backgroundColor: 'primary.main',
  },
  '& .MuiClockNumber-root': {
    color: 'text.secondary',
  },
  '& .MuiClockNumber-root.Mui-selected': {
    backgroundColor: 'primary.main',
    color: '#fff',
  },
  '& .MuiMultiSectionDigitalClockSection-item, & .MuiMultiSectionDigitalClockSectionItem-root':
    {
      borderRadius: '12px',
      '&:hover': {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
      },
    },
  '& .MuiMultiSectionDigitalClockSection-item.Mui-selected, & .MuiMultiSectionDigitalClockSectionItem-root.Mui-selected':
    {
      border: '1px solid',
      borderColor: 'primary.main',
      borderRadius: '12px',
      backgroundColor: 'rgba(56, 189, 248, 0.15)',
      color: 'primary.main',
      fontWeight: 700,
      '&:hover': {
        backgroundColor: 'rgba(56, 189, 248, 0.25)',
      },
    },
  '& .MuiDialogActions-root': {
    '& .MuiButton-root': {
      color: 'primary.main',
      fontWeight: 600,
    },
  },
};

export const timePickerPaperSx = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#111827' : 'background.default',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '16px',
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#e0e2e9' : '#000'),
  boxShadow: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
};

export const timePickerLayoutSx = {
  '& .MuiPickersLayout-contentWrapper': {
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#111827' : 'background.default',
  },
  '& .MuiMultiSectionDigitalClockSection-item.Mui-selected, & .MuiMultiSectionDigitalClockSectionItem-root.Mui-selected':
    {
      border: '1px solid',
      borderColor: 'primary.main',
      borderRadius: '8px',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      color: 'primary.main',
      fontWeight: 700,
    },
};

export const modalBackdropSx = {
  backdropFilter: 'blur(8px)',
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
};

export const categorySelectSx = {
  color: (theme: Theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
  borderRadius: '12px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.18)'
        : 'action.hover',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? '#6366f1' : 'primary.main',
  },
};

export const durationInputPropsSx = {
  borderRadius: '12px',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#1A1F2B' : 'background.default',
};
