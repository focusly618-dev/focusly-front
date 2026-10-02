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
import { useTranslation } from 'react-i18next';
import {
  CheckBox as CheckBoxIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Check as CheckIcon,
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
  const { t } = useTranslation();
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
          title={t('tasks.empty.noTasksTitle', 'No tasks yet')}
          description={t(
            'tasks.empty.noTasksDesc',
            'Plan your day and boost your productivity. Create your first task to see it here.',
          )}
        />
      ) : !isListView && showEmptyStateFiltered ? (
        <EmptyState
          title={t('tasks.empty.noMatchTitle', 'No tasks match your search')}
          description={t(
            'tasks.empty.noMatchDesc',
            "Try a different keyword or filter to find what you're looking for, or create a new task above.",
          )}
          actionText={t('tasks.empty.clearFilters', 'Clear all filters')}
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
                  title={t('tasks.empty.noTasksTitle', 'No hay tareas aún')}
                  description={t(
                    'tasks.empty.noTasksDesc',
                    'Planifica tu día y mejora tu productividad. Crea tu primera tarea aquí.',
                  )}
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
                  title={t(
                    'tasks.empty.noMatchTitle',
                    'No hay tareas que coincidan con la búsqueda',
                  )}
                  description={t(
                    'tasks.empty.noMatchDesc',
                    'Prueba con otra palabra clave o limpia los filtros para ver tus tareas.',
                  )}
                  actionText={t('tasks.empty.clearFilters', 'Limpiar filtros')}
                  onAction={() => setSearchTerm('')}
                />
              </Box>
            ) : (
              <>
                <TableHeader>
                  <TableHeaderCell
                    sx={{
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelectAll();
                    }}
                  >
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelectAll();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      size="small"
                      icon={
                        <Box
                          sx={{
                            width: 17,
                            height: 17,
                            borderRadius: '4px',
                            border: (theme) =>
                              theme.palette.mode === 'dark'
                                ? '1.5px solid #3a3d48'
                                : '1.5px solid #d1d5db',
                            bgcolor: 'transparent',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              borderColor: '#008767',
                            },
                          }}
                        />
                      }
                      checkedIcon={
                        <Box
                          sx={{
                            width: 17,
                            height: 17,
                            borderRadius: '4px',
                            bgcolor: '#008767',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 13, color: '#ffffff' }} />
                        </Box>
                      }
                      indeterminateIcon={
                        <Box
                          sx={{
                            width: 17,
                            height: 17,
                            borderRadius: '4px',
                            bgcolor: '#008767',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              width: 9,
                              height: 2,
                              bgcolor: '#ffffff',
                              borderRadius: '1px',
                            }}
                          />
                        </Box>
                      }
                      sx={{
                        padding: 0,
                      }}
                    />
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('tasks.columns.taskName', 'NOMBRE DE LA TAREA')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('tasks.columns.subtasks', 'SUBTAREAS')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('tasks.columns.priority', 'PRIORIDAD')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('tasks.columns.deadline', 'FECHA LÍMITE')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('tasks.columns.estimated', 'ESTIMADO')}
                  </TableHeaderCell>
                  <TableHeaderCell>
                    {t('tasks.columns.real', 'REAL')}
                  </TableHeaderCell>
                  <TableHeaderCell sx={{ justifyContent: 'center' }}>
                    {t('tasks.columns.actions', 'ACCIONES')}
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
                        title={t('tasks.empty.noTasksInTab', {
                          tab: activeTab.label,
                          defaultValue: `No hay tareas en ${activeTab.label}`,
                        })}
                        description={t(
                          'tasks.empty.noTasksInTabDesc',
                          'Mueve una tarea aquí o cambia de pestaña para ver tareas.',
                        )}
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
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '#717684'
                      : 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Mostrando {paginatedTasks.length} de {displayedTasks.length}{' '}
                {t('tasks.header.upcomingTitle', 'tareas próximas en total')}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: (theme) =>
                      surfaceColor(theme, '#2e3037', '#3E3E3E', '#e5e7eb'),
                    color: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#717684'
                        : 'text.secondary',
                    bgcolor: (theme) =>
                      surfaceColor(theme, '#1e2025', '#1F1F20', '#ffffff'),
                    '&.Mui-disabled': {
                      opacity: 0.35,
                      borderColor: (theme) =>
                        surfaceColor(theme, '#25272e', '#333333', '#f3f4f6'),
                    },
                    '&:hover': {
                      bgcolor: (theme) =>
                        surfaceColor(theme, '#25272e', '#333333', '#f9fafb'),
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
                        minWidth: 32,
                        width: 32,
                        height: 32,
                        p: 0,
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        bgcolor: isActive ? '#008767' : 'transparent',
                        color: isActive
                          ? '#ffffff'
                          : (theme) =>
                              theme.palette.mode === 'dark'
                                ? '#8a8f98'
                                : 'text.primary',
                        boxShadow: isActive
                          ? '0 1px 3px rgba(0, 135, 103, 0.3)'
                          : 'none',
                        '&:hover': {
                          bgcolor: isActive
                            ? '#007357'
                            : (theme) =>
                                surfaceColor(
                                  theme,
                                  '#25272e',
                                  '#333333',
                                  '#f3f4f6',
                                ),
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
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: (theme) =>
                      surfaceColor(theme, '#2e3037', '#3E3E3E', '#e5e7eb'),
                    color: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#717684'
                        : 'text.secondary',
                    bgcolor: (theme) =>
                      surfaceColor(theme, '#1e2025', '#1F1F20', '#ffffff'),
                    '&.Mui-disabled': {
                      opacity: 0.35,
                      borderColor: (theme) =>
                        surfaceColor(theme, '#25272e', '#333333', '#f3f4f6'),
                    },
                    '&:hover': {
                      bgcolor: (theme) =>
                        surfaceColor(theme, '#25272e', '#333333', '#f9fafb'),
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
              {selectedTaskIds.size === 1
                ? t('tasks.bulk.selected_one', {
                    count: selectedTaskIds.size,
                    defaultValue: '1 tarea seleccionada',
                  })
                : t('tasks.bulk.selected_other', {
                    count: selectedTaskIds.size,
                    defaultValue: `${selectedTaskIds.size} tareas seleccionadas`,
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
              {t('tasks.bulk.cancel', 'Cancelar')}
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
              {t('tasks.bulk.deleteSelected', 'Eliminar seleccionadas')}
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
          {t('tasks.bulk.confirmTitle', 'Confirmar eliminación')}
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            {selectedTaskIds.size === 1
              ? t('tasks.bulk.confirmDesc_one', {
                  count: selectedTaskIds.size,
                  defaultValue:
                    '¿Estás seguro de que deseas eliminar 1 tarea seleccionada? Esta acción no se puede deshacer.',
                })
              : t('tasks.bulk.confirmDesc_other', {
                  count: selectedTaskIds.size,
                  defaultValue: `¿Estás seguro de que deseas eliminar ${selectedTaskIds.size} tareas seleccionadas? Esta acción no se puede deshacer.`,
                })}
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
            {t('tasks.bulk.cancel', 'Cancelar')}
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
              t('tasks.bulk.deleteButton', 'Eliminar')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
