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

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'icon',
}) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (code: SupportedLanguage) => {
    changeLanguage(code);
    handleClose();
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
          sx={{ mx: 0.5 }}
        >
          <TranslateIcon sx={{ fontSize: 20 }} />
        </IconButton>
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <TranslateIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {currentLang.flag} {currentLang.nativeLabel}
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 150,
              mt: 1,
              borderRadius: 2,
            },
          },
        }}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <MenuItem
            key={option.code}
            selected={i18n.language === option.code}
            onClick={() => handleSelectLanguage(option.code)}
          >
            <ListItemIcon sx={{ fontSize: '1.2rem', minWidth: '32px' }}>
              {option.flag}
            </ListItemIcon>
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
