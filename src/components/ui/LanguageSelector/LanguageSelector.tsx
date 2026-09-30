import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { Translate as TranslateIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  LANGUAGE_OPTIONS,
  changeLanguage,
  type SupportedLanguage,
} from '@/i18n';
import type { LanguageSelectorProps } from './LanguageSelector.types';
import {
  iconTriggerSx,
  iconSx,
  fullTriggerSx,
  secondaryIconSx,
  labelSx,
  menuPaperSx,
  menuItemIconSx,
} from './LanguageSelector.styles';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'icon',
}) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: React.SyntheticEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleSelectLanguage = (
    event: React.MouseEvent,
    code: SupportedLanguage,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    changeLanguage(code);
    setAnchorEl(null);
  };

  const currentLang =
    LANGUAGE_OPTIONS.find((l) => l.code === i18n.language) ||
    LANGUAGE_OPTIONS[0];

  return (
    <>
      {variant === 'icon' ? (
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-label={t('settings.language.title')}
          sx={iconTriggerSx}
        >
          <TranslateIcon sx={iconSx} />
        </IconButton>
      ) : (
        <Box onClick={handleClick} sx={fullTriggerSx}>
          <TranslateIcon sx={secondaryIconSx} />
          <Typography variant="body2" sx={labelSx}>
            {currentLang.flag} {currentLang.nativeLabel}
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={(e: unknown) => {
          if (
            e &&
            typeof e === 'object' &&
            'stopPropagation' in e &&
            typeof (e as { stopPropagation: unknown }).stopPropagation ===
              'function'
          ) {
            (e as { stopPropagation: () => void }).stopPropagation();
          }
          handleClose();
        }}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: menuPaperSx,
          },
        }}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <MenuItem
            key={option.code}
            selected={i18n.language === option.code}
            onClick={(e) => handleSelectLanguage(e, option.code)}
          >
            <ListItemIcon sx={menuItemIconSx}>{option.flag}</ListItemIcon>
            <ListItemText
              primary={option.nativeLabel}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: i18n.language === option.code ? 600 : 400,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
