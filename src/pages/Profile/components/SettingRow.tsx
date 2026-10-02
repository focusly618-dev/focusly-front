import { useId, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { CardDescription, CardTitle } from '../Profile.styles';

interface SettingRowProps {
  title: ReactNode;
  /** What the setting does. Every toggle on the page carries one. */
  description: ReactNode;
  /**
   * The control on the right. Receives the ids of the title and description
   * so the control can point aria-labelledby/aria-describedby at them.
   */
  control?: (ids: { labelId: string; descriptionId: string }) => ReactNode;
  /** Extra content under the description (status lines, inputs). */
  children?: ReactNode;
}

export const SettingRow = ({
  title,
  description,
  control,
  children,
}: SettingRowProps) => {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <CardTitle id={labelId}>{title}</CardTitle>
        <CardDescription id={descriptionId}>{description}</CardDescription>
        {children}
      </Box>
      {control && (
        <Box sx={{ flexShrink: 0, mt: -0.5 }}>
          {control({ labelId, descriptionId })}
        </Box>
      )}
    </Box>
  );
};
