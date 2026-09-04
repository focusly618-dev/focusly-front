import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Header, Title } from '../../Tasks.styles';

interface TasksHeaderProps {
  title?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export const TasksHeader = ({ title, eyebrow, children }: TasksHeaderProps) => {
  const { t } = useTranslation();
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
          {eyebrow || t('tasksHeader.eyebrow')}
        </Typography>
        <Title
          sx={{ fontWeight: 800, fontSize: '28px', color: 'text.primary' }}
        >
          {title || t('tasksHeader.title')}
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
