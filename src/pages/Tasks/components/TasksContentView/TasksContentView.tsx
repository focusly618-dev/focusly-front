import { useState, useMemo, useCallback } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  alpha,
  Checkbox,
} from '@mui/material';
import {
  CheckBox as CheckBoxIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled as muiStyled } from '@mui/material/styles';
import { AnimatedContainer, GridTaskContainer } from '../../Tasks.styles';
import { EmptyState } from '@/components/ui';
import { BoardView } from '../BoardView/BoardView';
import { WorkloadDashboard } from '../WorkloadDashboard/WorkloadDashboard';
import { ListViewTask } from '../ListViewTask/ListViewTask';
import { GridViewTask } from '../GridViewTask/GridViewTask';
import { TasksSkeletons } from '../TasksSkeletons/TasksSkeletons';
import {
  TableWrapper,
  TableHeader,
  TableHeaderCell,
  TableBodyContainer,
} from '../ListViewTask/ListViewTask.styles';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { TasksContentViewProps } from './TasksContentView.types';

const FloatingActionBar = muiStyled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
  padding: '12px 24px',
  borderRadius: '16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(35, 37, 42, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 40px 0 rgba(0, 0, 0, 0.25)',
  zIndex: 1000,
  minWidth: '380px',
  animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',

  '@keyframes slideUp': {
    '0%': {
      transform: 'translate(-50%, 100px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translate(-50%, 0)',
      opacity: 1,
    },
  },
}));

const STATUS_SECTIONS = [
  {
    id: 'Todo',
    label: 'To Do',
    color: '#64748b',
    filter: (t: TaskResponse) => t.status === 'Todo' || !t.status,
  },
  {
    id: 'Planning',
    label: 'Planning',
    color: '#3b82f6',
    filter: (t: TaskResponse) => t.status === 'Planning',
  },
  {
    id: 'Scheduled',
    label: 'Scheduled',
    color: '#8b5cf6',
    filter: (t: TaskResponse) => t.status === 'Scheduled',
  },
  {
    id: 'Review',
    label: 'Review',
    color: '#06b6d4',
    filter: (t: TaskResponse) => t.status === 'Review',
  },
  {
    id: 'Pending',
    label: 'Pending',
    color: '#f59e0b',
    filter: (t: TaskResponse) => t.status === 'Pending',
  },
  {
    id: 'On Hold',
    label: 'On Hold',
    color: '#ef4444',
    filter: (t: TaskResponse) => t.status === 'On Hold',
  },
  {
    id: 'Done',
    label: 'Done',
    color: '#10b981',
    filter: (t: TaskResponse) => t.status === 'Done',
  },
  {
    id: 'Backlog',
    label: 'Backlog',
    color: '#94a3b8',
    filter: (t: TaskResponse) => t.status === 'Backlog',
  },
  {
    id: 'Archived',
    label: 'Archived',
    color: '#4b5563',
    filter: (t: TaskResponse) => t.status === 'Archived',
  },
];

const StatusTabsContainer = muiStyled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 24px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(26, 31, 43, 0.4)' : '#ffffff',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

interface StatusTabProps {
  active: boolean;
  tabColor: string;
}

const StatusTabButton = muiStyled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'tabColor',
})<StatusTabProps>(({ theme, active, tabColor }) => ({
  textTransform: 'none',
  fontSize: '12px',
  fontWeight: active ? 700 : 500,
  padding: '4px 14px',
  borderRadius: '20px',
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#ffffff'
      : tabColor
    : theme.palette.text.secondary,
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? tabColor
      : `${tabColor}15`
    : 'transparent',
  border: `1px solid ${active ? tabColor : 'transparent'}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? tabColor
        : `${tabColor}25`
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
    borderColor: active
      ? tabColor
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.08)',
  },
}));

const TabCountBadge = muiStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'tabColor',
})<{ active: boolean; tabColor: string }>(({ theme, active, tabColor }) => ({
  marginLeft: '6px',
  fontSize: '10px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(0, 0, 0, 0.25)'
      : 'rgba(255, 255, 255, 0.45)'
    : theme.palette.mode === 'dark'
      ? alpha(tabColor, 0.15)
      : alpha(tabColor, 0.1),
  color: active
    ? theme.palette.mode === 'dark'
      ? '#ffffff'
      : tabColor
    : tabColor,
  transition: 'all 0.2s ease',
}));

export const TasksContentView = ({
  viewMode,
  isLoading,
  tasks,
  filteredTasks,
  handleTaskClick,
  updateTask,
  deleteTasks,
  setSearchTerm,
  isAIScheduleEnabled,
  onStartFocus,
}: TasksContentViewProps) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const isTaskReadOnly = useCallback(
    (t: TaskResponse) => {
      if (!user) return true;
      if (t.task_type === 'GoogleTask' || t.google_event_id) {
        const organizerEmail = (t as unknown as { organizer_email?: string })
          .organizer_email;
        if (organizerEmail) {
          return organizerEmail.toLowerCase() !== user.email?.toLowerCase();
        }
      }
      if (t.user_id && t.user_id !== user.id) {
        return true;
      }
      return false;
    },
    [user],
  );

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set(),
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [prevViewMode, setPrevViewMode] = useState(viewMode);

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [limit, setLimit] = useState(24);

  if (viewMode !== prevViewMode) {
    setPrevViewMode(viewMode);
    setSelectedTaskIds(new Set());
    setIsConfirmOpen(false);
    setSelectedStatus('All');
  }

  const isListView =
    viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload';

  const handleToggleSelect = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const tabs = useMemo(() => {
    return [
      {
        id: 'All',
        label: 'All',
        color: '#6366f1',
        filter: () => true,
      },
      ...STATUS_SECTIONS,
    ];
  }, []);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: filteredTasks.length,
    };
    STATUS_SECTIONS.forEach((section) => {
      counts[section.id] = filteredTasks.filter(section.filter).length;
    });
    return counts;
  }, [filteredTasks]);

  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === selectedStatus) || tabs[0];
  }, [selectedStatus, tabs]);

  const displayedTasks = useMemo(() => {
    return filteredTasks.filter(activeTab.filter);
  }, [filteredTasks, activeTab]);

  const selectableDisplayedTasks = useMemo(() => {
    return displayedTasks.filter((t) => !isTaskReadOnly(t));
  }, [displayedTasks, isTaskReadOnly]);

  const isAllSelected = useMemo(() => {
    if (selectableDisplayedTasks.length === 0) return false;
    return selectableDisplayedTasks.every((task) =>
      selectedTaskIds.has(task.id),
    );
  }, [selectableDisplayedTasks, selectedTaskIds]);

  const isSomeSelected = useMemo(() => {
    if (selectableDisplayedTasks.length === 0) return false;
    const selectedCount = selectableDisplayedTasks.filter((task) =>
      selectedTaskIds.has(task.id),
    ).length;
    return selectedCount > 0 && selectedCount < selectableDisplayedTasks.length;
  }, [selectableDisplayedTasks, selectedTaskIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        selectableDisplayedTasks.forEach((task) => next.delete(task.id));
        return next;
      });
    } else {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        selectableDisplayedTasks.forEach((task) => next.add(task.id));
        return next;
      });
    }
  };

  const handleDeleteSelectedClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    if (deleteTasks) {
      await deleteTasks(Array.from(selectedTaskIds));
      setSelectedTaskIds(new Set());
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  // Loading skeletons
  if (isLoading && filteredTasks.length === 0) {
    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          isListView
            ? {
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : {
                padding: '16px 24px',
              }
        }
      >
        <TasksSkeletons viewMode={viewMode} />
      </AnimatedContainer>
    );
  }

  // No tasks at all
  if (tasks.length === 0) {
    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          isListView
            ? {
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : {
                padding: '16px 24px',
              }
        }
      >
        <EmptyState
          icon={<CheckBoxIcon />}
          title={t('No tasks yet')}
          description={t(
            'Plan your day and boost your productivity. Create your first task to see it here.',
          )}
        />
      </AnimatedContainer>
    );
  }

  // No tasks match filters
  if (filteredTasks.length === 0) {
    if (isListView) {
      return (
        <AnimatedContainer
          id="joyride-tasks-list"
          key={viewMode}
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            paddingTop: 0,
            minHeight: 0,
          }}
        >
          <TableWrapper>
            <TableHeader>
              <TableHeaderCell sx={{ justifyContent: 'center' }}>
                <Checkbox disabled size="small" sx={{ padding: 0 }} />
              </TableHeaderCell>
              <TableHeaderCell>{t('Task Name')}</TableHeaderCell>
              <TableHeaderCell>{t('Priority')}</TableHeaderCell>
              <TableHeaderCell>{t('Due Date')}</TableHeaderCell>
              <TableHeaderCell className="col-estimated">
                {t('Estimated')}
              </TableHeaderCell>
              <TableHeaderCell className="col-actual">
                {t('Actual')}
              </TableHeaderCell>
              <TableHeaderCell className="col-ai">
                {t('AI Schedule')}
              </TableHeaderCell>
              <TableHeaderCell sx={{ justifyContent: 'center' }}>
                {t('Actions')}
              </TableHeaderCell>
            </TableHeader>
            <TableBodyContainer
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
              }}
            >
              <EmptyState
                title={t('No tasks match your search')}
                description={t(
                  "Try a different keyword or filter to find what you're looking for, or create a new task above.",
                )}
                actionText={t('Clear all filters')}
                onAction={() => setSearchTerm('')}
              />
            </TableBodyContainer>
          </TableWrapper>
        </AnimatedContainer>
      );
    }

    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          isListView
            ? {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : {
                padding: '16px 24px',
              }
        }
      >
        <EmptyState
          title={t('No tasks match your search')}
          description={t(
            "Try a different keyword or filter to find what you're looking for, or create a new task above.",
          )}
          actionText={t('Clear all filters')}
          onAction={() => setSearchTerm('')}
        />
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer
      id="joyride-tasks-list"
      key={viewMode}
      sx={
        isListView
          ? {
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              paddingTop: 0,
              minHeight: 0,
            }
          : {
              padding: '16px 24px',
            }
      }
    >
      {viewMode === 'workload' ? (
        <WorkloadDashboard filteredTasks={filteredTasks} />
      ) : viewMode === 'board' ? (
        <BoardView
          tasks={filteredTasks}
          updateTask={updateTask}
          onTaskClick={handleTaskClick}
        />
      ) : viewMode === 'grid' ? (
        <GridTaskContainer>
          {filteredTasks.map((task) => (
            <GridViewTask
              key={task.id}
              task={task}
              onTaskClick={handleTaskClick}
              isAIScheduleEnabled={isAIScheduleEnabled}
            />
          ))}
        </GridTaskContainer>
      ) : (
        <TableWrapper>
          <StatusTabsContainer>
            {tabs.map((tab) => {
              const count = tabCounts[tab.id] || 0;
              return (
                <StatusTabButton
                  key={tab.id}
                  active={selectedStatus === tab.id}
                  tabColor={tab.color}
                  onClick={() => {
                    setSelectedStatus(tab.id);
                    setLimit(24);
                  }}
                >
                  {t(tab.label)}
                  <TabCountBadge
                    active={selectedStatus === tab.id}
                    tabColor={tab.color}
                  >
                    {count}
                  </TabCountBadge>
                </StatusTabButton>
              );
            })}
          </StatusTabsContainer>
          <TableHeader>
            <TableHeaderCell sx={{ justifyContent: 'center' }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={handleToggleSelectAll}
                size="small"
                sx={{
                  padding: 0,
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.25)',
                  '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                    color: 'primary.main',
                  },
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>{t('Task Name')}</TableHeaderCell>
            <TableHeaderCell>{t('Priority')}</TableHeaderCell>
            <TableHeaderCell>{t('Due Date')}</TableHeaderCell>
            <TableHeaderCell className="col-estimated">
              {t('Estimated')}
            </TableHeaderCell>
            <TableHeaderCell className="col-actual">
              {t('Actual')}
            </TableHeaderCell>
            <TableHeaderCell className="col-ai">
              {t('AI Schedule')}
            </TableHeaderCell>
            <TableHeaderCell>{t('Actions')}</TableHeaderCell>
          </TableHeader>
          <TableBodyContainer>
            {displayedTasks.slice(0, limit).map((task) => (
              <ListViewTask
                key={task.id}
                task={task}
                onTaskClick={handleTaskClick}
                updateTask={updateTask}
                isAIScheduleEnabled={isAIScheduleEnabled}
                onStartFocus={onStartFocus}
                isSelected={selectedTaskIds.has(task.id)}
                onToggleSelect={() => handleToggleSelect(task.id)}
              />
            ))}
            {displayedTasks.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  width: '100%',
                }}
              >
                <EmptyState
                  title={t('No tasks in {{category}}', {
                    category: t(activeTab.label),
                  })}
                  description={t(
                    'Move a task here or change tabs to see tasks.',
                  )}
                />
              </Box>
            )}
            {displayedTasks.length > limit && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'transparent',
                }}
              >
                <Button
                  size="small"
                  onClick={() => setLimit((prev) => prev + 24)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: activeTab.color,
                    backgroundColor: `${activeTab.color}0a`,
                    borderRadius: '8px',
                    px: 3,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: `${activeTab.color}15`,
                    },
                  }}
                >
                  {t('Show More ({{count}} remaining)', {
                    count: displayedTasks.length - limit,
                  })}
                </Button>
              </Box>
            )}
          </TableBodyContainer>
        </TableWrapper>
      )}

      {isListView && selectedTaskIds.size > 0 && (
        <FloatingActionBar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {selectedTaskIds.size === 1
                ? t('{{count}} task selected', { count: selectedTaskIds.size })
                : t('{{count}} tasks selected', {
                    count: selectedTaskIds.size,
                  })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="text"
              size="small"
              onClick={handleClearSelection}
              startIcon={<CloseIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={handleDeleteSelectedClick}
              startIcon={<DeleteIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
              }}
            >
              {t('Delete Selected')}
            </Button>
          </Box>
        </FloatingActionBar>
      )}

      {/* Modern Confirmation Dialog */}
      <Dialog
        open={isConfirmOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
            maxWidth: '400px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1e2025' : '#ffffff',
            boxShadow: '0 24px 48 rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 2, py: 1 }}>
          {t('Confirm Delete')}
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            {selectedTaskIds.size === 1
              ? t(
                  'Are you sure you want to delete {{count}} selected task? This action cannot be undone.',
                  { count: selectedTaskIds.size },
                )
              : t(
                  'Are you sure you want to delete {{count}} selected tasks? This action cannot be undone.',
                  { count: selectedTaskIds.size },
                )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
            }}
          >
            {t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
