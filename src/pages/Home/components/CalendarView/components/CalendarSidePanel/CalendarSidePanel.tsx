import { Box, Paper, Typography, styled } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// Styled Components
const PanelContainer = styled(Box)(({ theme }) => ({
  width: '320px',
  borderLeft: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide on smaller screens
  },
}));

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Dynamic card bg
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: '16px',
}));

// Mock Components

const UpcomingTasks = () => (
  <Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <SectionTitle sx={{ mb: 0 }}>Upcoming</SectionTitle>
      <Typography
        variant="caption"
        sx={{
          color: '#3b82f6',
          cursor: 'pointer',
          fontWeight: 600,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        View All
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[
        {
          title: 'Review Q4 Marketing Plan',
          due: 'Due Oct 25 • Strategy',
          color: '#10b981',
        }, // Green
        {
          title: 'Send Invoice to Client X',
          due: 'Due Oct 26 • Finance',
          color: '#6366f1',
        }, // Indigo
        {
          title: 'Month End Review',
          due: 'Schedule a retrospective to analyze your focus patterns.',
          isSpecial: true,
        },
      ].map((task, index) =>
        task.isSpecial ? (
          <Card
            key={index}
            elevation={0}
            sx={{
              bgcolor: 'transparent',
              border: '1px dashed',
              borderColor: 'divider',
              alignItems: 'center',
              textAlign: 'center',
              py: 3,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: '#818cf8', fontWeight: 600, mb: 0.5 }}
            >
              {task.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mb: 2,
                display: 'block',
                maxWidth: '200px',
              }}
            >
              {task.due}
            </Typography>
            <Box
              component="button"
              sx={{
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                borderRadius: '6px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              Schedule Now
            </Box>
          </Card>
        ) : (
          <Box key={index} sx={{ display: 'flex', gap: '12px' }}>
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'divider',
                flexShrink: 0,
                mt: 0.5,
                cursor: 'pointer',
                '&:hover': { borderColor: 'text.secondary' },
              }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.4 }}
              >
                {task.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                {task.due}
              </Typography>
            </Box>
          </Box>
        ),
      )}
    </Box>
  </Box>
);

export const CalendarSidePanel = () => {
  return (
    <PanelContainer>
      <PerfectScrollbar
        options={{ wheelPropagation: true }}
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <UpcomingTasks />
      </PerfectScrollbar>
    </PanelContainer>
  );
};
