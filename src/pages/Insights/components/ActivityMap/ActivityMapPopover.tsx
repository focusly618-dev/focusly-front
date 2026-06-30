import { Box, Typography, Divider, Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import type { HeatmapCellData } from './ActivityMap.types';

interface ActivityMapPopoverProps {
  cell: HeatmapCellData;
  filter: string;
}

const formatCompletedTime = (iso?: string | null) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getPeriodTitle = (cell: HeatmapCellData, filter: string) => {
  if (filter === 'Daily') return cell.label;

  return cell.label;
};

export const ActivityMapPopover = ({
  cell,
  filter,
}: ActivityMapPopoverProps) => {
  const periodLabel =
    filter === 'Daily' ? 'Hour' : filter === 'Weekly' ? 'Day' : 'Date';

  return (
    <Box sx={{ p: 2, minWidth: 240, maxWidth: 320 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {getPeriodTitle(cell, filter)}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={1.5}
      >
        {cell.count === 0
          ? `No tasks completed this ${periodLabel.toLowerCase()}`
          : `${cell.count} task${cell.count === 1 ? '' : 's'} completed`}
      </Typography>

      {cell.tasks.length > 0 && (
        <>
          <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
          <Box display="flex" flexDirection="column" gap={1.25}>
            {cell.tasks.map((task) => (
              <Box key={task.id} display="flex" alignItems="flex-start" gap={1}>
                <CheckCircleRoundedIcon
                  sx={{ fontSize: 16, color: 'success.main', mt: 0.25 }}
                />
                <Box flex={1} minWidth={0}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      wordBreak: 'break-word',
                      lineHeight: 1.3,
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                    {task.completedAt && (
                      <Typography variant="caption" color="text.secondary">
                        {formatCompletedTime(task.completedAt)}
                      </Typography>
                    )}
                    {task.category && (
                      <Chip
                        label={task.category}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.65rem',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
