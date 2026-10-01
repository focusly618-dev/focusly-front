/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  Box,
  ButtonBase,
  Collapse,
  type SxProps,
  type Theme,
} from '@mui/material';
import { ChevronsUpDownIcon } from 'lucide-react';
import { Shimmer } from './shimmer';
import { byMode, mergeSx, visuallyHiddenSx, zinc } from '@/styles/mui';

interface PlanContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  toggle: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('Plan components must be used within Plan');
  }
  return context;
};

interface SxChildrenProps {
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export interface PlanProps extends SxChildrenProps {
  isStreaming?: boolean;
  defaultOpen?: boolean;
}

export const Plan: React.FC<PlanProps> = ({
  sx,
  isStreaming = false,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contextValue = useMemo(
    () => ({ isStreaming, isOpen, toggle: () => setIsOpen((open) => !open) }),
    [isStreaming, isOpen],
  );

  return (
    <PlanContext.Provider value={contextValue}>
      <Box
        sx={mergeSx(
          {
            width: '100%',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            bgcolor: byMode('rgba(255, 255, 255, 0.7)', `${zinc[900]}cc`),
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease',
            overflow: 'hidden',
          },
          sx,
        )}
      >
        {children}
      </Box>
    </PlanContext.Provider>
  );
};

export const PlanHeader: React.FC<SxChildrenProps> = ({ sx, children }) => (
  <Box
    data-slot="plan-header"
    sx={mergeSx(
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: byMode('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
        bgcolor: byMode('rgba(0, 0, 0, 0.02)', 'rgba(255, 255, 255, 0.02)'),
      },
      sx,
    )}
  >
    {children}
  </Box>
);

export const PlanTitle: React.FC<SxChildrenProps> = ({ sx, children }) => {
  const { isStreaming } = usePlan();

  return (
    <Box
      component="h4"
      data-slot="plan-title"
      sx={mergeSx(
        {
          m: 0,
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 600,
          color: byMode(zinc[900], zinc[100]),
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        },
        sx,
      )}
    >
      {isStreaming && typeof children === 'string' ? (
        <Shimmer>{children}</Shimmer>
      ) : (
        children
      )}
    </Box>
  );
};

export const PlanDescription: React.FC<SxChildrenProps> = ({
  sx,
  children,
}) => {
  const { isStreaming } = usePlan();

  return (
    <Box
      component="p"
      data-slot="plan-description"
      sx={mergeSx(
        {
          m: 0,
          fontSize: '12px',
          lineHeight: '16px',
          color: byMode(zinc[500], zinc[400]),
        },
        sx,
      )}
    >
      {isStreaming && typeof children === 'string' ? (
        <Shimmer>{children}</Shimmer>
      ) : (
        children
      )}
    </Box>
  );
};

export const PlanContent: React.FC<SxChildrenProps> = ({ sx, children }) => {
  const { isOpen } = usePlan();

  return (
    <Collapse in={isOpen} timeout={200}>
      <Box
        data-slot="plan-content"
        sx={mergeSx(
          {
            px: 2,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
          },
          sx,
        )}
      >
        {children}
      </Box>
    </Collapse>
  );
};

export const PlanFooter: React.FC<SxChildrenProps> = ({ sx, children }) => (
  <Box
    data-slot="plan-footer"
    sx={mergeSx(
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.25,
        borderTop: '1px solid',
        borderColor: byMode('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
        bgcolor: byMode('rgba(0, 0, 0, 0.01)', 'rgba(255, 255, 255, 0.01)'),
      },
      sx,
    )}
  >
    {children}
  </Box>
);

export const PlanTrigger: React.FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
  const { isOpen, toggle } = usePlan();

  return (
    <ButtonBase
      data-slot="plan-trigger"
      onClick={toggle}
      aria-expanded={isOpen}
      sx={mergeSx(
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '8px',
          color: zinc[500],
          transition: 'all 0.15s ease',
          '&:hover': {
            color: byMode(zinc[900], zinc[100]),
            bgcolor: byMode('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
          },
        },
        sx,
      )}
    >
      <Box component={ChevronsUpDownIcon} sx={{ width: 16, height: 16 }} />
      <Box component="span" sx={visuallyHiddenSx}>
        Toggle plan
      </Box>
    </ButtonBase>
  );
};
