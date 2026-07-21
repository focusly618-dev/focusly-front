import { Typography, Box } from '@mui/material';
import { Header, Title } from '../../Tasks.styles';

interface TasksHeaderProps {
  children?: React.ReactNode;
}

export const TasksHeader = ({ children }: TasksHeaderProps) => {
  return (
    <Header sx={{ padding: '24px 0 16px 0', borderBottom: 'none' }}>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: '#4f46e5', // Primary indigo color matching screenshot
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            mb: 0.5,
            display: 'block',
          }}
        >
          MANAGE AND PRIORITIZE YOUR WORK
        </Typography>
        <Title sx={{ fontWeight: 800, fontSize: '28px', color: '#0f172a' }}>
          My Tasks
        </Title>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Header>
  );
};
