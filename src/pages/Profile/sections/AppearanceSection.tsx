import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import {
  LightModeOutlined as LightIcon,
  DarkModeOutlined as DarkIcon,
  TonalityOutlined as GrayDarkIcon,
} from '@mui/icons-material';
import { ColorModeContext } from '@/context';
import {
  LANGUAGE_OPTIONS,
  changeLanguage,
  type SupportedLanguage,
} from '@/i18n';
import {
  Card,
  CardDescription,
  CardTitle,
  OptionCard,
  OptionGrid,
  OptionIcon,
} from '../Profile.styles';

export const AppearanceSection = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useContext(ColorModeContext);

  const themeOptions = [
    { id: 'light', label: t('settings.theme.light'), icon: <LightIcon /> },
    { id: 'dark', label: t('settings.theme.dark'), icon: <DarkIcon /> },
    {
      id: 'graydark',
      label: t('settings.theme.graydark'),
      icon: <GrayDarkIcon />,
    },
  ] as const;

  return (
    <>
      <Card>
        <CardTitle>{t('settings.theme.title')}</CardTitle>
        <CardDescription>{t('settings.theme.subtitle')}</CardDescription>
        <OptionGrid role="radiogroup">
          {themeOptions.map((option) => {
            const isActive = mode === option.id;
            return (
              <OptionCard
                key={option.id}
                role="radio"
                aria-checked={isActive}
                active={isActive}
                onClick={() => setMode(option.id)}
              >
                <OptionIcon active={isActive}>{option.icon}</OptionIcon>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {option.label}
                </Typography>
              </OptionCard>
            );
          })}
        </OptionGrid>
      </Card>

      <Card>
        <CardTitle>{t('settings.language.title')}</CardTitle>
        <CardDescription>
          {t('profilePage.appearance.languageDesc')}
        </CardDescription>
        <OptionGrid role="radiogroup">
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = i18n.language === option.code;
            return (
              <OptionCard
                key={option.code}
                role="radio"
                aria-checked={isActive}
                active={isActive}
                onClick={() => changeLanguage(option.code as SupportedLanguage)}
              >
                <OptionIcon active={isActive}>
                  <Typography component="span" sx={{ fontSize: '1rem' }}>
                    {option.flag}
                  </Typography>
                </OptionIcon>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {option.nativeLabel}
                </Typography>
              </OptionCard>
            );
          })}
        </OptionGrid>
      </Card>
    </>
  );
};
