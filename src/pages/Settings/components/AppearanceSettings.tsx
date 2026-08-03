import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { ColorModeContext } from '@/context';
import {
  LightModeOutlined as LightIcon,
  DarkModeOutlined as DarkIcon,
  TonalityOutlined as GrayDarkIcon,
  PaletteOutlined as PaletteIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  SoundGrid,
  SoundCard,
  SoundCardHeader,
  SoundCardIcon,
  SoundCardTitle,
} from '../Settings.styles';

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: <LightIcon /> },
  { id: 'dark', label: 'Dark', icon: <DarkIcon /> },
  { id: 'graydark', label: 'Gray Dark', icon: <GrayDarkIcon /> },
] as const;

export const AppearanceSettings = () => {
  const { mode, setMode } = useContext(ColorModeContext);

  return (
    <Box>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <PaletteIcon />
            </Box>
            <Typography>Theme</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Choose how Focusly looks on this device.
        </Typography>

        <SoundGrid>
          {THEME_OPTIONS.map((option) => (
            <SoundCard
              key={option.id}
              active={mode === option.id}
              onClick={() => setMode(option.id)}
            >
              <SoundCardHeader>
                <SoundCardIcon active={mode === option.id}>
                  {option.icon}
                </SoundCardIcon>
              </SoundCardHeader>
              <SoundCardTitle>{option.label}</SoundCardTitle>
            </SoundCard>
          ))}
        </SoundGrid>
      </SectionCard>
    </Box>
  );
};
