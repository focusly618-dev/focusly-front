import React from 'react';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Menu,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { RestartAlt as ResetIcon } from '@mui/icons-material';
import type { GraphSettings } from '../NoteGraphView.types';

interface GraphSettingsMenuProps {
  anchorEl: HTMLElement | null;
  settings: GraphSettings;
  onClose: () => void;
  onUpdateSetting: <K extends keyof GraphSettings>(
    key: K,
    value: GraphSettings[K],
  ) => void;
  onResetAll: () => void;
}

export const GraphSettingsMenu: React.FC<GraphSettingsMenuProps> = ({
  anchorEl,
  settings,
  onClose,
  onUpdateSetting,
  onResetAll,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '14px',
            mt: 0.5,
            width: 260,
            height: 300,
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            border: '1px solid',
            borderColor: 'divider',
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          letterSpacing={0.6}
        >
          DISPLAY
        </Typography>

        <FormControlLabel
          sx={{
            display: 'flex',
            justify: 'space-between',
            ml: 0,
            mt: 1,
            mr: 0,
          }}
          labelPlacement="start"
          control={
            <Switch
              size="small"
              checked={settings.showLabels}
              onChange={(e) => onUpdateSetting('showLabels', e.target.checked)}
            />
          }
          label={<Typography variant="body2">Always show labels</Typography>}
        />

        <FormControlLabel
          sx={{
            display: 'flex',
            justify: 'space-between',
            ml: 0,
            mr: 0,
          }}
          labelPlacement="start"
          control={
            <Switch
              size="small"
              checked={settings.showArrows}
              onChange={(e) => onUpdateSetting('showArrows', e.target.checked)}
            />
          }
          label={<Typography variant="body2">Arrows</Typography>}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5, display: 'block' }}
        >
          Node size
        </Typography>
        <Slider
          size="small"
          value={settings.nodeSize}
          min={0.3}
          max={1.6}
          step={0.1}
          onChange={(_, value) => onUpdateSetting('nodeSize', value as number)}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          Label size
        </Typography>
        <Slider
          size="small"
          value={settings.labelSize}
          min={0.7}
          max={1.6}
          step={0.1}
          onChange={(_, value) => onUpdateSetting('labelSize', value as number)}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          Spacing
        </Typography>
        <Slider
          size="small"
          value={settings.spacing}
          min={0.6}
          max={3}
          step={0.1}
          onChange={(_, value) => onUpdateSetting('spacing', value as number)}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          Link thickness
        </Typography>
        <Slider
          size="small"
          value={settings.linkThickness}
          min={0.5}
          max={2.5}
          step={0.25}
          onChange={(_, value) =>
            onUpdateSetting('linkThickness', value as number)
          }
        />

        <Divider sx={{ my: 1.5 }} />

        <Button
          size="small"
          fullWidth
          startIcon={<ResetIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            onResetAll();
          }}
          sx={{
            textTransform: 'none',
            justify: 'flex-start',
            color: 'text.secondary',
          }}
        >
          Reset layout & settings
        </Button>
      </Box>
    </Menu>
  );
};
