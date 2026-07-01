import { useState } from 'react';
import { Typography, Box, LinearProgress, Button } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTasks } from './Tasks.hook';
import { TasksAIOrganizeModal } from './components/TasksAIOrganizeModal/TasksAIOrganizeModal';
import { CreateTaskModal } from '@/pages/Home/components/CreateTaskModal/CreateTaskModal';
import { TasksContainer, MainContent } from './Tasks.styles';
import { TasksHeader } from './components/TasksHeader/TasksHeader';
import { TasksControlsBar } from './components/TasksControlsBar/TasksControlsBar';
import { TasksContentView } from './components/TasksContentView/TasksContentView';
import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';
import type { Step } from 'react-joyride';
import type { Task } from '@/redux/tasks/task.types';

interface TasksProps {
  isAIScheduleEnabled: boolean;
  setIsAIScheduleEnabled: (enabled: boolean) => void;
  onStartFocus?: (task: Task) => void;
}

export const Tasks = ({
  isAIScheduleEnabled: isAIScheduleEnabledProp,
  setIsAIScheduleEnabled: setIsAIScheduleEnabledProp,
  onStartFocus,
}: TasksProps) => {
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const {
    tasks,
    totalCount,
    filteredTasks,
    isLoading,
    tags,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,

    activeSort,
    activeFilters,
    activeFilterState,
    filterAnchorEl,
    sortAnchorEl,
    updateTask,
    viewMode,
    setViewMode,
    runOnboarding,
    handleTaskClick,
    handleFilterClick,
    handleFilterClose,
    handleApplyFilters,
    handleSortClose,
    handleApplySort,
    handleFinishOnboarding,
    deleteTasks,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useTasks();

  const isAIScheduleEnabled = isAIScheduleEnabledProp;
  const setIsAIScheduleEnabled = setIsAIScheduleEnabledProp;

  const onboardingSteps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Welcome to Your Tasks! 🚀
          </Typography>
          <Typography variant="body2">
            This is where you manage and prioritize your work. Let's take a
            quick tour!
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: '#joyride-tasks-view-toggle',
      content:
        'Switch between List, Grid, Board, and Workload views to find what works best for you.',
    },
    {
      target: '#joyride-tasks-search',
      content:
        'Quickly find any task by searching for its title, tags, or projects.',
    },
    {
      target: '#joyride-tasks-filters',
      content:
        'Use filters and sorting to stay focused on what matters most right now.',
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TasksContainer sx={{ position: 'relative' }}>
        {isLoading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              zIndex: 1000,
              bgcolor: 'transparent',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
              },
            }}
          />
        )}

        <MainContent
          sx={{
            borderRadius: '16px',
          }}
        >
          <TasksHeader
            filteredTasks={filteredTasks}
            dateRange={dateRange}
            setDateRange={setDateRange}
            viewMode={viewMode}
            setViewMode={setViewMode}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={() => setIsAIPlannerOpen(true)}
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',
                  height: 36,
                  bgcolor: '#7c3aed',
                  '&:hover': { bgcolor: '#6d28d9', boxShadow: 'none' },
                  fontSize: '0.8rem',
                }}
              >
                AI Organize
              </Button>
            </Box>
          </TasksHeader>

          <TasksControlsBar
            viewMode={viewMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterAnchorEl={filterAnchorEl}
            sortAnchorEl={sortAnchorEl}
            activeSort={activeSort ?? null}
            activeFilterState={
              activeFilterState ?? {
                priorities: [],
                categories: [],
                statuses: [],
              }
            }
            tags={tags}
            handleFilterClick={handleFilterClick}
            handleFilterClose={handleFilterClose}
            handleApplyFilters={handleApplyFilters}
            handleSortClose={handleSortClose}
            handleApplySort={handleApplySort}
            onAddTaskClick={() => setIsCreateTaskModalOpen(true)}
          />

          <TasksContentView
            viewMode={viewMode}
            isLoading={isLoading}
            tasks={tasks}
            filteredTasks={filteredTasks}
            handleTaskClick={handleTaskClick}
            updateTask={updateTask}
            deleteTasks={deleteTasks}
            setSearchTerm={setSearchTerm}
            isAIScheduleEnabled={isAIScheduleEnabled}
            setIsAIScheduleEnabled={setIsAIScheduleEnabled}
            onStartFocus={onStartFocus}
            activeFilters={activeFilters}
            activeSort={activeSort}
            searchTerm={searchTerm}
            dateRange={dateRange}
            totalCount={totalCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(0);
            }}
          />
        </MainContent>

        <OnboardingWrapper
          steps={onboardingSteps}
          run={runOnboarding}
          onFinish={handleFinishOnboarding}
        />
        <TasksAIOrganizeModal
          open={isAIPlannerOpen}
          onClose={() => setIsAIPlannerOpen(false)}
          tasks={tasks as Task[]}
        />
        <CreateTaskModal
          open={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onSave={() => setIsCreateTaskModalOpen(false)}
          initialStart={null}
          initialEnd={null}
        />
      </TasksContainer>
    </LocalizationProvider>
  );
};
