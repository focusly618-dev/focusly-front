import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Box, Collapse, type SxProps, type Theme } from '@mui/material';
import {
  ChevronDownIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  AlertCircleIcon,
  ClockIcon,
} from 'lucide-react';
import {
  brand,
  byMode,
  emerald,
  mergeSx,
  rose,
  spin,
  truncateSx,
  zinc,
} from '@/styles/mui';

export type TaskStatusType = 'pending' | 'in_progress' | 'completed' | 'error';

const statusSx: Record<TaskStatusType, SxProps<Theme>> = {
  completed: { color: emerald[500], bgcolor: `${emerald[500]}1a` },
  in_progress: {
    color: brand.main,
    bgcolor: `${brand.main}1a`,
    animation: `${spin} 1s linear infinite`,
  },
  pending: { color: zinc[400], bgcolor: `${zinc[500]}1a` },
  error: { color: rose[500], bgcolor: `${rose[500]}1a` },
};

const statusIcon: Record<TaskStatusType, React.ElementType> = {
  completed: CheckCircle2Icon,
  in_progress: CircleDashedIcon,
  pending: ClockIcon,
  error: AlertCircleIcon,
};

export interface TaskStatusProps {
  status: TaskStatusType;
  sx?: SxProps<Theme>;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({ status, sx }) => (
  <Box
    data-slot="task-status"
    sx={mergeSx(
      {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        flexShrink: 0,
        borderRadius: '50%',
        transition: 'color 0.15s ease, background-color 0.15s ease',
      },
      statusSx[status],
      sx,
    )}
  >
    <Box component={statusIcon[status]} sx={{ width: 14, height: 14 }} />
  </Box>
);

interface TaskContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('Task components must be used within Task');
  return context;
};

export interface TaskProps {
  defaultOpen?: boolean;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export const Task: React.FC<TaskProps> = ({
  defaultOpen = false,
  sx,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contextValue = useMemo(
    () => ({ isOpen, toggle: () => setIsOpen((open) => !open) }),
    [isOpen],
  );

  return (
    <TaskContext.Provider value={contextValue}>
      <Box
        sx={mergeSx(
          {
            borderRadius: '12px',
            border: '1px solid',
            borderColor: byMode(
              'rgba(0, 0, 0, 0.05)',
              'rgba(255, 255, 255, 0.05)',
            ),
            bgcolor: byMode(
              'rgba(0, 0, 0, 0.015)',
              'rgba(255, 255, 255, 0.02)',
            ),
            p: 1.25,
            transition: 'background-color 0.15s ease',
            '&:hover': {
              bgcolor: byMode(
                'rgba(0, 0, 0, 0.03)',
                'rgba(255, 255, 255, 0.04)',
              ),
            },
          },
          sx,
        )}
      >
        {children}
      </Box>
    </TaskContext.Provider>
  );
};

export interface TaskTriggerProps {
  title?: string;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export const TaskTrigger: React.FC<TaskTriggerProps> = ({
  children,
  title,
  icon,
  sx,
}) => {
  const { isOpen, toggle } = useTask();

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      sx={mergeSx({ cursor: 'pointer', width: '100%', textAlign: 'left' }, sx)}
    >
      {children ?? (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            fontSize: '14px',
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}
          >
            {icon}
            <Box
              component="span"
              sx={{
                ...truncateSx,
                fontWeight: 500,
                color: byMode(zinc[800], zinc[200]),
              }}
            >
              {title}
            </Box>
          </Box>
          <Box
            component={ChevronDownIcon}
            sx={{
              width: 16,
              height: 16,
              flexShrink: 0,
              color: zinc[400],
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export interface TaskContentProps {
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export const TaskContent: React.FC<TaskContentProps> = ({ children, sx }) => {
  const { isOpen } = useTask();

  return (
    <Collapse in={isOpen} timeout={200} unmountOnExit>
      <Box
        sx={mergeSx(
          {
            mt: 1.25,
            pt: 1,
            borderTop: '1px solid',
            borderColor: byMode(
              'rgba(0, 0, 0, 0.05)',
              'rgba(255, 255, 255, 0.05)',
            ),
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            fontSize: '12px',
            color: byMode(zinc[500], zinc[400]),
          },
          sx,
        )}
      >
        {children}
      </Box>
    </Collapse>
  );
};
