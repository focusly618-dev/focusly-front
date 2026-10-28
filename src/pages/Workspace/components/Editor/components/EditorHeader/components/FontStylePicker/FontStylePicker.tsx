import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, Typography, alpha, useTheme } from '@mui/material';
import {
  EDITOR_FONTS,
  EDITOR_FONT_STYLES,
  type EditorFontStyle,
} from '../../../../editorFonts';

interface FontStylePickerProps {
  value: EditorFontStyle;
  onChange: (style: EditorFontStyle) => void;
}

/** Notion's "Style" row: one "Ag" per typeface, drawn in it. */
export const FontStylePicker = ({ value, onChange }: FontStylePickerProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ px: 1.25, pt: 0.75, pb: 1 }}>
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'text.secondary',
          px: 0.5,
          mb: 0.75,
        }}
      >
        {t('workspaceEditor.fontStyle', 'Estilo')}
      </Typography>
      <Box
        role="radiogroup"
        aria-label={t('workspaceEditor.fontStyle', 'Estilo')}
        sx={{ display: 'flex', gap: 0.5 }}
      >
        {EDITOR_FONT_STYLES.map((style) => {
          const font = EDITOR_FONTS[style];
          const selected = style === value;
          return (
            <ButtonBase
              key={style}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(style)}
              sx={{
                flex: 1,
                minWidth: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.25,
                py: 0.75,
                borderRadius: '8px',
                color: selected ? 'primary.main' : 'text.primary',
                transition: 'background-color 0.15s, color 0.15s',
                '&:hover': {
                  bgcolor: selected
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'action.hover',
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: font.family ?? theme.typography.fontFamily,
                  fontSize: '22px',
                  lineHeight: 1.1,
                }}
              >
                Ag
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: '11px',
                  color: selected ? 'primary.main' : 'text.secondary',
                }}
              >
                {t(`workspaceEditor.fontStyles.${style}`, font.label)}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};
