import { Typography, Box, LinearProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTasks } from './Tasks.hook';
import {
  TasksContainer,
  MainContent,
  AISwitchContainer,
  StyledAISwitch,
} from './Tasks.styles';
import { TasksHeader } from './components/TasksHeader/TasksHeader';
import { TasksControlsBar } from './components/TasksControlsBar/TasksControlsBar';
import { TasksContentView } from './components/TasksContentView/TasksContentView';
import { TaskPriorityCards } from './components/TaskPriorityCards/TaskPriorityCards';
import { SubtaskModal } from './components/SubtaskModal/SubtaskModal';
import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';
import type { Step } from 'react-joyride';
import type { Task } from '@/redux/tasks/task.types';

interface TasksProps {
  isAIScheduleEnabled: boolean;
  setIsAIScheduleEnabled: (enabled: boolean) => void;
  onStartFocus?: (task: Task) => void;
  activeFocusTaskId?: string | null;
}

export const Tasks = ({
  isAIScheduleEnabled: isAIScheduleEnabledProp,
  setIsAIScheduleEnabled: setIsAIScheduleEnabledProp,
  onStartFocus,
  activeFocusTaskId,
}: TasksProps) => {
  const {
    tasks,
    filteredTasks,
    isLoading,
    tags,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    isCompletedFilterActive,
    activeSort,
    activeFilterState,
    filterAnchorEl,
    sortAnchorEl,
    expandedTaskIds,
    toggleTaskExpansion,
    updateTask,
    viewMode,
    setViewMode,
    activeParentTask,
    isSubtaskModalOpen,
    activeSubtaskIndex,
    setIsSubtaskModalOpen,
    runOnboarding,
    handleTaskClick,
    handleFilterClick,
    handleFilterClose,
    handleApplyFilters,
    handleSortClose,
    handleApplySort,
    handleFinishOnboarding,
    handleOpenSubtaskModal,
    handleSaveSubtask,
    handleSubtaskToggle,
    setPriorityFilter,
  } = useTasks();

  const isAIScheduleEnabled = isAIScheduleEnabledProp;
  const setIsAIScheduleEnabled = setIsAIScheduleEnabledProp;

  const activePriority =
    activeFilterState?.priorities?.length === 1
      ? activeFilterState.priorities[0] === 'High'
        ? 3
        : activeFilterState.priorities[0] === 'Medium'
          ? 2
          : 1
      : undefined;

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
    {
      target: '#joyride-tasks-completed',
      content:
        'Toggle completed tasks to review your progress or clear your workspace.',
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
            <AISwitchContainer sx={{ height: 'fit-content' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: isAIScheduleEnabled ? '#7c3aed' : 'text.secondary',
                  transition: 'color 0.3s ease',
                }}
              >
                Schedule with AI
              </Typography>
              <StyledAISwitch
                checked={isAIScheduleEnabled}
                onChange={(e) => setIsAIScheduleEnabled(e.target.checked)}
              />
            </AISwitchContainer>
          </TasksHeader>

          <TasksControlsBar
            viewMode={viewMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterAnchorEl={filterAnchorEl}
            sortAnchorEl={sortAnchorEl}
            isCompletedFilterActive={isCompletedFilterActive}
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
          />
          <TaskPriorityCards
            activePriority={activePriority}
            onPriorityChange={setPriorityFilter}
          />
          <TasksContentView
            viewMode={viewMode}
            isLoading={isLoading}
            tasks={tasks}
            filteredTasks={filteredTasks}
            expandedTaskIds={expandedTaskIds}
            toggleTaskExpansion={toggleTaskExpansion}
            handleSubtaskToggle={handleSubtaskToggle}
            handleOpenSubtaskModal={handleOpenSubtaskModal}
            handleTaskClick={handleTaskClick}
            updateTask={updateTask}
            setSearchTerm={setSearchTerm}
            isAIScheduleEnabled={isAIScheduleEnabled}
            setIsAIScheduleEnabled={setIsAIScheduleEnabled}
            onStartFocus={onStartFocus}
            activeFocusTaskId={activeFocusTaskId}
          />
        </MainContent>

        <SubtaskModal
          isOpen={isSubtaskModalOpen}
          onClose={() => setIsSubtaskModalOpen(false)}
          onSave={handleSaveSubtask}
          activeParentTask={activeParentTask}
          activeSubtaskIndex={activeSubtaskIndex}
          isAIScheduleEnabled={isAIScheduleEnabled}
          setIsAIScheduleEnabled={setIsAIScheduleEnabled}
        />

        <OnboardingWrapper
          steps={onboardingSteps}
          run={runOnboarding}
          onFinish={handleFinishOnboarding}
        />
      </TasksContainer>
    </LocalizationProvider>
  );
};
