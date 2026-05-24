import { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  CommandPaletteContainer,
  CommandInputWrapper,
  CommandInput,
  ResultList,
  ResultHeader,
  ResultTitle,
  ResultCount,
  TaskItemContainer,
  StyledBadge,
  StyledCategory,
  RadioCircle,
  PaletteFooter,
  AddTaskButton,
  CollapsedSearchContainer,
  ItemText,
} from './SearchPalette.styles';
import type { TaskSearchItems } from '../../../../types/workspace.types';

interface SearchPaletteProps {
  showPalette: boolean;
  setShowPalette: (b: boolean) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filteredTasks: TaskSearchItems[];
  selectTask: TaskSearchItems | null;
  handleSelectTask: (task: TaskSearchItems | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (field: any, value: any) => void;
}

export const SearchPalette = ({
  showPalette,
  setShowPalette,
  searchTerm,
  setSearchTerm,
  filteredTasks,
  selectTask,
  handleSelectTask,
  setValue,
}: SearchPaletteProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setShowPalette(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
      {showPalette ? (
        <CommandPaletteContainer
          ref={containerRef}
          onBlur={handleBlur}
          tabIndex={-1}
        >
          <CommandInputWrapper>
            <SearchIcon sx={{ color: 'info.main', fontSize: 20 }} />
            <CommandInput
              placeholder="Search tasks to link..."
              autoFocus
              value={
                showPalette && selectTask ? selectTask.title : searchTerm
              }
              onChange={(e) => setSearchTerm(e.target.value)}
              readOnly={!!selectTask}
            />
          </CommandInputWrapper>
          <ResultList>
            <ResultHeader>
              <ResultTitle>AVAILABLE PROJECTS & TASKS</ResultTitle>
              <ResultCount>{filteredTasks.length} MATCHES</ResultCount>
            </ResultHeader>

            {filteredTasks.map((task: TaskSearchItems) => {
              const isSelected = selectTask?.id === task.id;
              const statusColor =
                task.status === 'Todo'
                  ? 'info.main'
                  : task.status === 'Done'
                    ? 'success.main'
                    : task.status === 'Pending'
                      ? 'warning.main'
                      : task.status === 'Backlog'
                        ? 'secondary.main'
                        : 'error.main';

              const statusBg =
                task.status === 'Todo'
                  ? 'info.light'
                  : task.status === 'Done'
                    ? 'success.light'
                    : task.status === 'Pending'
                      ? 'warning.light'
                      : task.status === 'Backlog'
                        ? 'secondary.light'
                        : 'error.light';

              return (
                <TaskItemContainer
                  key={task.id}
                  active={isSelected}
                  onClick={() => {
                    if (isSelected) {
                      handleSelectTask(null);
                      setValue('taskId', null);
                    } else {
                      handleSelectTask(task);
                      setValue('taskId', task.id);
                      setSearchTerm('');
                      setShowPalette(false);
                    }
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <ItemText sx={{ fontWeight: 700, fontSize: '13px' }}>
                        {task.title}
                      </ItemText>
                      <Box display="flex" alignItems="center" gap={1}>
                        <StyledBadge color={statusColor} bgColor={statusBg}>
                          {task.status}
                        </StyledBadge>
                        {task.category && (
                          <StyledCategory>{task.category}</StyledCategory>
                        )}
                      </Box>
                    </Box>
                    <RadioCircle selected={isSelected} color={statusColor} />
                  </Box>
                </TaskItemContainer>
              );
            })}
          </ResultList>
          <PaletteFooter>
            <Box display="flex" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Press{' '}
                <Box
                  component="span"
                  sx={{
                    bgcolor: 'divider',
                    px: 0.5,
                    borderRadius: '4px',
                    color: 'text.primary',
                    mx: 0.5,
                  }}
                >
                  Enter
                </Box>{' '}
                to link selection
              </Typography>
            </Box>
            <AddTaskButton onMouseDown={(e) => e.preventDefault()}>
              + Create New Parent Task
            </AddTaskButton>
          </PaletteFooter>
        </CommandPaletteContainer>
      ) : selectTask ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CollapsedSearchContainer
            onClick={() => setShowPalette(true)}
            sx={{
              flex: 1,
              borderColor: 'action.selected',
              '&:hover': { borderColor: 'info.main' },
            }}
          >
            <AddIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
            <Typography
              variant="body2"
              sx={{
                color: 'info.main',
                fontWeight: 500,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {selectTask.title}
            </Typography>
            <CloseIcon
              sx={{
                color: 'text.secondary',
                fontSize: 20,
                cursor: 'pointer',
                '&:hover': { color: 'error.main' },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectTask(null);
                setValue('taskId', undefined);
              }}
            />
          </CollapsedSearchContainer>
        </Box>
      ) : (
        <CollapsedSearchContainer onClick={() => setShowPalette(true)}>
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Search tasks to link...
          </Typography>
        </CollapsedSearchContainer>
      )}
    </Box>
  );
};
