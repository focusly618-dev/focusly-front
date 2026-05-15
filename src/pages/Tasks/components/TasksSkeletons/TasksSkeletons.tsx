import { Box, Skeleton } from '@mui/material';
import { TaskCard } from '../ListViewTask/ListViewTask.styles';
import { GridTaskCard } from '../GridViewTask/GridViewTask.styles';
import { GridTaskContainer } from '../../Tasks.styles';

interface TasksSkeletonsProps {
  viewMode: 'list' | 'grid' | 'board' | 'workload';
}

export const TasksSkeletons = ({ viewMode }: TasksSkeletonsProps) => {
  if (viewMode === 'grid') {
    return (
      <GridTaskContainer>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GridTaskCard
            key={i}
            sx={{ borderStyle: 'solid', cursor: 'default' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="40%"
                height={24}
                sx={{ borderRadius: '12px' }}
                animation="wave"
              />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation="wave"
              />
            </Box>
            <Skeleton
              variant="text"
              width="80%"
              height={28}
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="100%"
              height={20}
              animation="wave"
            />
            <Skeleton variant="text" width="90%" height={20} animation="wave" />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Skeleton
                variant="text"
                width="20%"
                height={20}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="30%"
                height={20}
                animation="wave"
              />
            </Box>
            <Box sx={{ mt: 'auto', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Skeleton
                  variant="text"
                  width="30%"
                  height={14}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="10%"
                  height={14}
                  animation="wave"
                />
              </Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={4}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
            </Box>
          </GridTaskCard>
        ))}
      </GridTaskContainer>
    );
  }

  // Default: list view skeleton
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <TaskCard
          key={i}
          sx={{
            cursor: 'default',
            borderLeft: '3px solid',
            borderColor: (theme) => theme.palette.divider,
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
            }}
          >
            <Skeleton
              variant="circular"
              width={8}
              height={8}
              animation="wave"
              sx={{ ml: 0.5 }}
            />
            <Box
              sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}
            >
              <Skeleton
                variant="text"
                width="30%"
                height={20}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                width="50px"
                height={18}
                sx={{ borderRadius: '6px' }}
                animation="wave"
              />
              <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                <Skeleton
                  variant="text"
                  width="60px"
                  height={16}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="80px"
                  height={16}
                  animation="wave"
                />
              </Box>
            </Box>
          </Box>
        </TaskCard>
      ))}
    </Box>
  );
};
