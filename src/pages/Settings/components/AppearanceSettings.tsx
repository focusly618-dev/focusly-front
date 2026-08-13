import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '@/context';
import {
  LANGUAGE_OPTIONS,
  changeLanguage,
  type SupportedLanguage,
} from '@/i18n';
import {
  LightModeOutlined as LightIcon,
  DarkModeOutlined as DarkIcon,
  TonalityOutlined as GrayDarkIcon,
  PaletteOutlined as PaletteIcon,
  TranslateOutlined as LanguageIcon,
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

export const AppearanceSettings = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useContext(ColorModeContext);

  const THEME_OPTIONS = [
    { id: 'light', label: t('settings.theme.light'), icon: <LightIcon /> },
    { id: 'dark', label: t('settings.theme.dark'), icon: <DarkIcon /> },
    {
      id: 'graydark',
      label: t('settings.theme.graydark'),
      icon: <GrayDarkIcon />,
    },
  ] as const;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Theme Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <PaletteIcon />
            </Box>
            <Typography>{t('settings.theme.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('settings.theme.subtitle')}
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

      {/* Language Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <LanguageIcon />
            </Box>
            <Typography>{t('settings.language.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('settings.language.subtitle')}
        </Typography>

        <SoundGrid>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = i18n.language === option.code;
            return (
              <SoundCard
                key={option.code}
                active={isSelected}
                onClick={() => changeLanguage(option.code as SupportedLanguage)}
              >
                <SoundCardHeader>
                  <SoundCardIcon active={isSelected}>
                    <Typography variant="h6" component="span">
                      {option.flag}
                    </Typography>
                  </SoundCardIcon>
                </SoundCardHeader>
                <SoundCardTitle>{option.nativeLabel}</SoundCardTitle>
              </SoundCard>
            );
          })}
        </SoundGrid>
      </SectionCard>
    </Box>
  );
};
