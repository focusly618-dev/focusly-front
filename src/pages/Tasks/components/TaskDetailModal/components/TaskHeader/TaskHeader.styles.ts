import { headerIconSx } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.styles';

export const headerContainerSx = (isCustomColor: boolean, color: string) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 3,
  ...(isCustomColor
    ? {
        pt: 1,
        pb: 20,
        margin: '15px',
      }
    : {
        pt: 2,
        pb: 1,
      }),
  color: isCustomColor ? '#1e293b' : 'text.secondary',
  backgroundColor: isCustomColor ? color : 'transparent',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
});

export const headerIconButtonSx = (isCustomColor: boolean) => ({
  ...headerIconSx,
  color: isCustomColor ? '#1e293b' : 'text.secondary',
  '&:hover': {
    backgroundColor: isCustomColor ? 'rgba(0, 0, 0, 0.08)' : 'action.hover',
  },
});
