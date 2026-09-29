import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  CheckBox as CheckBoxIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  RadioButtonUnchecked as UncheckedIcon,
  CheckCircle as CheckedIcon,
  RemoveCircle as IndeterminateIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

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

import type { TasksContentViewProps } from './TasksContentView.types';
import { useTasksContentView } from './useTasksContentView.hook';
import { surfaceColor } from '@/context';
import {
  FloatingActionBar,
  StatusTabsContainer,
  StatusTabButton,
  TabCountBadge,
} from './TasksContentView.styles';

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
  const {
    selectedTaskIds,
    isConfirmOpen,
    isDeleting,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    totalPages,
    paginatedTasks,
    isListView,
    handleToggleSelect,
    tabs,
    tabCounts,
    activeTab,
    displayedTasks,
    isAllSelected,
    isSomeSelected,
    handleToggleSelectAll,
    handleDeleteSelectedClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleClearSelection,
  } = useTasksContentView({
    filteredTasks,
    viewMode,
    deleteTasks,
  });

  const showEmptyStateTasks = tasks.length === 0;
  const showEmptyStateFiltered = filteredTasks.length === 0;

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
      {!isListView && isLoading && filteredTasks.length === 0 ? (
        <TasksSkeletons viewMode={viewMode} />
      ) : !isListView && showEmptyStateTasks ? (
        <EmptyState
          icon={<CheckBoxIcon />}
          title="No tasks yet"
          description="Plan your day and boost your productivity. Create your first task to see it here."
        />
      ) : !isListView && showEmptyStateFiltered ? (
        <EmptyState
          title="No tasks match your search"
          description="Try a different keyword or filter to find what you're looking for, or create a new task above."
          actionText="Clear all filters"
          onAction={() => setSearchTerm('')}
        />
      ) : viewMode === 'workload' ? (
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
        <>
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
                    setPage(1);
                  }}
                >
                  {tab.label}
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

          <TableWrapper>
            {isLoading && filteredTasks.length === 0 ? (
              <TasksSkeletons viewMode={viewMode} />
            ) : showEmptyStateTasks ? (
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
                  icon={<CheckBoxIcon />}
                  title="No hay tareas aún"
                  description="Planifica tu día y mejora tu productividad. Crea tu primera tarea aquí."
                />
              </Box>
            ) : showEmptyStateFiltered ? (
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
                  title="No hay tareas que coincidan con la búsqueda"
                  description="Prueba con otra palabra clave o limpia los filtros para ver tus tareas."
                  actionText="Limpiar filtros"
                  onAction={() => setSearchTerm('')}
                />
              </Box>
            ) : (
              <>
                <TableHeader>
                  <TableHeaderCell sx={{ justifyContent: 'center' }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={handleToggleSelectAll}
                      size="small"
                      icon={
                        <UncheckedIcon
                          sx={{
                            fontSize: 18,
                            color: 'text.secondary',
                            opacity: 0.6,
                          }}
                        />
                      }
                      checkedIcon={
                        <CheckedIcon sx={{ fontSize: 18, color: '#008767' }} />
                      }
                      indeterminateIcon={
                        <IndeterminateIcon
                          sx={{ fontSize: 18, color: '#008767' }}
                        />
                      }
                      sx={{
                        padding: 0,
                      }}
                    />
                  </TableHeaderCell>
                  <TableHeaderCell>NOMBRE DE LA TAREA</TableHeaderCell>
                  <TableHeaderCell>SUBTAREAS</TableHeaderCell>
                  <TableHeaderCell>PRIORIDAD</TableHeaderCell>
                  <TableHeaderCell>FECHA LÍMITE</TableHeaderCell>
                  <TableHeaderCell>ESTIMADO</TableHeaderCell>
                  <TableHeaderCell>REAL</TableHeaderCell>
                  <TableHeaderCell sx={{ justifyContent: 'center' }}>
                    ACCIONES
                  </TableHeaderCell>
                </TableHeader>
                <TableBodyContainer>
                  {paginatedTasks.map((task) => (
                    <ListViewTask
                      key={task.id}
                      task={task}
                      onTaskClick={handleTaskClick}
                      updateTask={updateTask}
                      deleteTasks={deleteTasks}
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
                        title={`No hay tareas en ${activeTab.label}`}
                        description="Mueve una tarea aquí o cambia de pestaña para ver tareas."
                      />
                    </Box>
                  )}
                </TableBodyContainer>
              </>
            )}
          </TableWrapper>

          {/* Bottom Pagination matching screenshot */}
          {displayedTasks.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 1,
                pb: 2,
                px: 0.5,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Mostrando {paginatedTasks.length} de {displayedTasks.length}{' '}
                tareas próximas en total
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  size="small"
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : '#e5e7eb',
                    color: 'text.secondary',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : '#ffffff',
                    '&.Mui-disabled': {
                      opacity: 0.4,
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : '#f3f4f6',
                    },
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 16 }} />
                </IconButton>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === page;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      sx={{
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        p: 0,
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        bgcolor: isActive ? '#008767' : 'transparent',
                        color: isActive ? '#ffffff' : 'text.primary',
                        boxShadow: isActive
                          ? '0 1px 3px rgba(0, 135, 103, 0.3)'
                          : 'none',
                        '&:hover': {
                          bgcolor: isActive
                            ? '#007357'
                            : (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255,255,255,0.06)'
                                  : '#f3f4f6',
                        },
                      }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <IconButton
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  size="small"
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : '#e5e7eb',
                    color: 'text.secondary',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : '#ffffff',
                    '&.Mui-disabled': {
                      opacity: 0.4,
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : '#f3f4f6',
                    },
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          )}
        </>
      )}

      {isListView && selectedTaskIds.size > 0 && (
        <FloatingActionBar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {selectedTaskIds.size}{' '}
              {selectedTaskIds.size === 1 ? 'task' : 'tasks'} selected
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
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={(e) => handleDeleteSelectedClick(e)}
              startIcon={<DeleteIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
              }}
            >
              Delete Selected
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
              surfaceColor(theme, '#1e2025', '#242425', '#ffffff'),
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 2, py: 1 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to delete {selectedTaskIds.size} selected{' '}
            {selectedTaskIds.size === 1 ? 'task' : 'tasks'}? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            disabled={isDeleting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleConfirmDelete(e)}
            variant="contained"
            color="error"
            disabled={isDeleting}
            autoFocus
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              minWidth: '90px',
            }}
          >
            {isDeleting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
