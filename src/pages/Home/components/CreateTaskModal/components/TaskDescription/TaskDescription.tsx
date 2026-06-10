import { Box, Typography, TextField } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { descriptionInputSx } from '../../CreateTaskModal.styles';

interface TaskDescriptionProps {
  description: string;
  setDescription: (v: string) => void;
}

export const TaskDescription = ({
  description,
  setDescription,
}: TaskDescriptionProps) => (
  <Box sx={{ px: 4, mb: 4 }}>
    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
      <DescriptionIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', fontSize: '13px', fontWeight: 500 }}
      >
        Description
      </Typography>
    </Box>
    <TextField
      multiline
      fullWidth
      minRows={3}
      placeholder="Add more details about this task..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      sx={descriptionInputSx}
    />
  </Box>
);
