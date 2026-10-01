/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import {
  Box,
  ButtonBase,
  Collapse,
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  BrainIcon,
  ChevronDownIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleIcon,
} from 'lucide-react';
import {
  brand,
  byMode,
  emerald,
  mergeSx,
  spin,
  truncateSx,
  zinc,
} from '@/styles/mui';

interface ChainOfThoughtContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isStreaming: boolean;
}

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null,
);

export const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      'ChainOfThought components must be used within ChainOfThought',
    );
  }
  return context;
};

export interface ChainOfThoughtProps {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export const ChainOfThought: React.FC<ChainOfThoughtProps> = ({
  sx,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  isStreaming = false,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, isStreaming }),
    [isOpen, setIsOpen, isStreaming],
  );

  return (
    <ChainOfThoughtContext.Provider value={contextValue}>
      <Box
        sx={mergeSx(
          {
            width: '100%',
            borderRadius: '12px',
            border: `1px solid ${emerald[500]}33`,
            bgcolor: byMode(`${emerald[50]}66`, `${zinc[900]}99`),
            p: 1.25,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.15s ease',
          },
          sx,
        )}
      >
        {children}
      </Box>
    </ChainOfThoughtContext.Provider>
  );
};

export interface ChainOfThoughtHeaderProps {
  icon?: ReactNode;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

const iconSx = { width: 14, height: 14, flexShrink: 0 } as const;

export const ChainOfThoughtHeader: React.FC<ChainOfThoughtHeaderProps> = ({
  icon,
  sx,
  children,
}) => {
  const { isOpen, setIsOpen, isStreaming } = useChainOfThought();

  return (
    <ButtonBase
      disableRipple
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      sx={mergeSx(
        {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 1,
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 500,
          fontFamily: 'inherit',
          color: byMode(zinc[700], zinc[300]),
          textAlign: 'left',
          userSelect: 'none',
          transition: 'color 0.15s ease',
          '&:hover': { color: byMode(brand.main, brand.dark) },
        },
        sx,
      )}
    >
      {icon ??
        (isStreaming ? (
          <Box
            component={CircleDashedIcon}
            sx={{
              ...iconSx,
              color: brand.main,
              animation: `${spin} 1s linear infinite`,
            }}
          />
        ) : (
          <Box component={BrainIcon} sx={{ ...iconSx, color: brand.main }} />
        ))}
      <Box component="span" sx={{ flex: 1, ...truncateSx }}>
        {children ?? 'Proceso de análisis'}
      </Box>
      <Box
        component={ChevronDownIcon}
        sx={{
          ...iconSx,
          ml: 'auto',
          color: zinc[400],
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </ButtonBase>
  );
};

export type ChainOfThoughtStepStatus = 'complete' | 'active' | 'pending';

export interface ChainOfThoughtStepProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: ReactNode;
  description?: ReactNode;
  status?: ChainOfThoughtStepStatus;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

const stepStatusSx: Record<ChainOfThoughtStepStatus, SxProps<Theme>> = {
  active: { color: byMode(brand.main, brand.dark), fontWeight: 500 },
  complete: { color: byMode(zinc[500], zinc[400]) },
  pending: { color: byMode(`${zinc[400]}99`, zinc[600]) },
};

export const ChainOfThoughtStep: React.FC<ChainOfThoughtStepProps> = ({
  icon: Icon,
  label,
  description,
  status = 'complete',
  sx,
  children,
}) => (
  <Box
    sx={mergeSx(
      {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: '12px',
        lineHeight: '16px',
        py: 0.5,
        transition: 'all 0.15s ease',
      },
      stepStatusSx[status],
      sx,
    )}
  >
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 16,
        height: 16,
      }}
    >
      {status === 'complete' && (
        <Box
          component={CheckCircle2Icon}
          sx={{ ...iconSx, color: emerald[500] }}
        />
      )}
      {status === 'active' && (
        <Box
          component={CircleDashedIcon}
          sx={{
            ...iconSx,
            color: brand.main,
            animation: `${spin} 1s linear infinite`,
          }}
        />
      )}
      {status === 'pending' && (
        <Box
          component={CircleIcon}
          sx={{ width: 8, height: 8, color: byMode(zinc[300], zinc[700]) }}
        />
      )}
    </Box>

    {Icon && <Box component={Icon} sx={{ ...iconSx, opacity: 0.75 }} />}

    <Box sx={{ flex: 1, minWidth: 0, ...truncateSx }}>
      <Box sx={truncateSx}>{label}</Box>
      {description && (
        <Box
          sx={{
            fontSize: '10px',
            color: byMode(zinc[400], zinc[500]),
            ...truncateSx,
          }}
        >
          {description}
        </Box>
      )}
      {children}
    </Box>
  </Box>
);

export interface ChainOfThoughtContentProps {
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export const ChainOfThoughtContent: React.FC<ChainOfThoughtContentProps> = ({
  sx,
  children,
}) => {
  const { isOpen } = useChainOfThought();

  return (
    <Collapse in={isOpen} timeout={200} unmountOnExit>
      <Box
        sx={mergeSx(
          {
            mt: 1.25,
            pt: 1,
            borderTop: `1px solid ${emerald[500]}1a`,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
          },
          sx,
        )}
      >
        {children}
      </Box>
    </Collapse>
  );
};
