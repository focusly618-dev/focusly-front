import { useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  CommandPaletteContainer,
  CommandInputWrapper,
  CommandInput,
  ResultList,
  ResultHeader,
  ResultTitle,
  TaskItemContainer,
  StyledBadge,
  RadioCircle,
  PaletteFooter,
  AddTaskButton,
  CollapsedSearchContainer,
} from './SearchPalette.styles';
import type { TaskSearchItems } from '../../../../types/workspace.types';

interface SearchPaletteProps {
  showPalette: boolean;
  setShowPalette: (b: boolean | ((prev: boolean) => boolean)) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filteredTasks: TaskSearchItems[];
  selectTask: TaskSearchItems | null;
  handleSelectTask: (task: TaskSearchItems | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (field: any, value: any) => void;
  loadMore: () => Promise<void>;
  hasMore?: boolean;
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
  loadMore,
  hasMore,
}: SearchPaletteProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedTasks = useMemo(() => {
    if (!selectTask) return filteredTasks;
    const selectedTaskIndex = filteredTasks.findIndex(
      (t) => t.id === selectTask.id,
    );
    if (selectedTaskIndex === -1) return filteredTasks;
    const selected = filteredTasks[selectedTaskIndex];
    const others = filteredTasks.filter((t) => t.id !== selectTask.id);
    return [selected, ...others];
  }, [filteredTasks, selectTask]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowPalette]);

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setShowPalette(false);
  };
  const loadingMore = useRef(false);
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMore.current || hasMore === false) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    const reachedBottom = scrollHeight - scrollTop <= clientHeight + 20;

    if (!reachedBottom) return;

    loadingMore.current = true;

    try {
      await loadMore();
    } finally {
      loadingMore.current = false;
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        flexGrow: 1,
        minWidth: '220px',
        flexShrink: 1,
        maxWidth: '480px',
        position: 'relative',
      }}
    >
      {showPalette ? (
        <CommandPaletteContainer
          ref={containerRef}
          onBlur={handleBlur}
          tabIndex={-1}
        >
          <CommandInputWrapper>
            <SearchIcon sx={{ color: 'info.main', fontSize: 20 }} />
            <CommandInput
              id="search-tasks-input"
              name="search-tasks-input"
              placeholder="Search tasks to link..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CommandInputWrapper>
          <ResultList onScroll={handleScroll}>
            <ResultHeader
              sx={{
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ResultTitle
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                AVAILABLE PROJECTS & TASKS
              </ResultTitle>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.04)',
                  color: 'text.secondary',
                  px: 1,
                  py: 0.2,
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {filteredTasks.length}{' '}
                {filteredTasks.length === 1 ? 'match' : 'matches'}
              </Typography>
            </ResultHeader>

            {displayedTasks.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '13px' }}
                >
                  No matching tasks found
                </Typography>
              </Box>
            ) : (
              displayedTasks.map((task: TaskSearchItems) => {
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
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.85,
                      px: 1.5,
                      mx: 0.75,
                      my: 0.25,
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1.25}
                      sx={{ minWidth: 0, flex: 1, mr: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: statusColor,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontWeight: isSelected ? 600 : 500,
                          fontSize: '13px',
                          color: 'text.primary',
                        }}
                      >
                        {task.title}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ flexShrink: 0 }}
                    >
                      {task.category && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '11px',
                            fontWeight: 500,
                            opacity: 0.85,
                            maxWidth: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: { xs: 'none', sm: 'inline' },
                          }}
                        >
                          {task.category}
                        </Typography>
                      )}
                      <StyledBadge color={statusColor} bgColor={statusBg}>
                        {task.status}
                      </StyledBadge>
                      {isSelected ? (
                        <CheckCircleIcon
                          sx={{
                            color: statusColor,
                            fontSize: 17,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <RadioCircle selected={false} color={statusColor} />
                      )}
                    </Box>
                  </TaskItemContainer>
                );
              })
            )}
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
            <AddTaskButton
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('action', 'create');
                setSearchParams(newParams);
                setShowPalette(false);
              }}
            >
              + Create New Task
            </AddTaskButton>
          </PaletteFooter>
        </CommandPaletteContainer>
      ) : (
        <CollapsedSearchContainer onClick={() => setShowPalette(true)}>
          <SearchIcon
            sx={{
              color: 'text.secondary',
              fontSize: 18,
              mr: 1,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ whiteSpace: 'nowrap', flex: 1, fontSize: '13px' }}
          >
            Search tasks to link...
          </Typography>
          <Box
            sx={{
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : '#e2e8f0',
              borderRadius: '4px',
              px: 0.75,
              py: 0.25,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : '#f8fafc',
              color: 'text.secondary',
              fontSize: '10px',
              fontWeight: 600,
              pointerEvents: 'none',
              ml: 1,
              flexShrink: 0,
            }}
          >
            ⌘K
          </Box>
        </CollapsedSearchContainer>
      )}
    </Box>
  );
};
