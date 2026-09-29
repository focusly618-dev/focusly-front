import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addDays, addMinutes } from 'date-fns';
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
    tagSearchTerm,
    setTagSearchTerm,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    referenceDate,
    goToPreviousPeriod,
    goToNextPeriod,
    periodLabel,

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
    refetchTasks,
    setPriorityFilter,
  } = useTasks();

  const isAIScheduleEnabled = isAIScheduleEnabledProp;
  const setIsAIScheduleEnabled = setIsAIScheduleEnabledProp;

  const [searchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter');

  const pendingCount = filteredTasks
    ? filteredTasks.filter((t) => t.status !== 'Done').length
    : 0;
  const completedCount = filteredTasks
    ? filteredTasks.filter((t) => t.status === 'Done').length
    : 0;

  const {
    headerTitle,
    headerEyebrow,
    addButtonLabel,
    contextualInitialStart,
    showAIOrganize,
  } = useMemo(() => {
    if (urlFilter === 'inbox') {
      return {
        headerTitle: 'Bandeja de Entrada',
        headerEyebrow: 'Bandeja de Entrada',
        addButtonLabel: 'Añadir a Bandeja',
        contextualInitialStart: null,
        showAIOrganize: false,
      };
    }
    if (urlFilter === 'today' || dateRange === 'today') {
      return {
        headerTitle: 'Plan de Hoy',
        headerEyebrow: 'Plan de Hoy',
        addButtonLabel: 'Nueva Tarea para Hoy',
        contextualInitialStart: new Date(),
        showAIOrganize: false,
      };
    }
    if (
      urlFilter === 'upcoming' ||
      dateRange === 'this_week' ||
      dateRange === 'this_month'
    ) {
      return {
        headerTitle: 'Próximas Tareas',
        headerEyebrow: 'Próximas Tareas',
        addButtonLabel: 'Nueva Tarea Próxima',
        contextualInitialStart: addDays(new Date(), 1),
        showAIOrganize: false,
      };
    }
    return {
      headerTitle: 'Próximas Tareas',
      headerEyebrow: 'Próximas Tareas',
      addButtonLabel: 'Nueva Tarea Próxima',
      contextualInitialStart: null,
      showAIOrganize: true,
    };
  }, [urlFilter, dateRange]);

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
        'Switch between List and Kanban views to find what works best for you.',
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
            bgcolor: 'transparent',
            height: '100%',
          }}
        >
          <Box
            sx={{
              padding: { xs: '16px 20px', md: '20px 32px' },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              minHeight: 0,
            }}
          >
            <TasksHeader
              title={headerTitle}
              eyebrow={headerEyebrow}
              pendingCount={pendingCount}
              completedCount={completedCount}
              dateRange={dateRange}
              setDateRange={setDateRange}
              periodLabel={periodLabel}
              addButtonLabel={addButtonLabel}
              onAddTaskClick={() => setIsCreateTaskModalOpen(true)}
            >
              {showAIOrganize && (
                <Button
                  variant="contained"
                  onClick={() => setIsAIPlannerOpen(true)}
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: 'none',
                    height: 38,
                    bgcolor: '#008767',
                    color: '#ffffff',
                    '&:hover': { bgcolor: '#007357', boxShadow: 'none' },
                    fontSize: '13px',
                    px: 2,
                  }}
                >
                  AI Organize
                </Button>
              )}
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
              tagSearchTerm={tagSearchTerm}
              setTagSearchTerm={setTagSearchTerm}
              handleFilterClick={handleFilterClick}
              handleFilterClose={handleFilterClose}
              handleApplyFilters={handleApplyFilters}
              handleSortClose={handleSortClose}
              handleApplySort={handleApplySort}
              onAddTaskClick={() => setIsCreateTaskModalOpen(true)}
              filteredTasks={filteredTasks}
              dateRange={dateRange}
              setDateRange={setDateRange}
              referenceDate={referenceDate}
              periodLabel={periodLabel}
              onGoToPreviousPeriod={goToPreviousPeriod}
              onGoToNextPeriod={goToNextPeriod}
              setViewMode={setViewMode}
              setPriorityFilter={setPriorityFilter}
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
            />
          </Box>
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
          onSave={() => {
            setIsCreateTaskModalOpen(false);
            refetchTasks();
          }}
          initialStart={contextualInitialStart}
          initialEnd={
            contextualInitialStart
              ? addMinutes(contextualInitialStart, 30)
              : null
          }
        />
      </TasksContainer>
    </LocalizationProvider>
  );
};
