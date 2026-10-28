import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  InputBase,
  Menu,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import EmojiPicker, { Theme as EmojiPickerTheme } from 'emoji-picker-react';
import { DEFAULT_CANVAS_ICON } from '../EditorContent/canvasLinks.utils';

export const CANVAS_ACCENT = '#0ea5e9';

const SIZES = {
  small: { height: 30, icon: 16, font: '14px', iconBox: 24 },
  medium: { height: 40, icon: 20, font: '15px', iconBox: 30 },
} as const;

interface CanvasIdentityFieldProps {
  icon: string | null;
  name: string;
  onIconChange: (icon: string) => void;
  onNameChange: (name: string) => void;
  /** `small` in the editor's header, `medium` in the create dialog. */
  size?: keyof typeof SIZES;
  autoFocus?: boolean;
  /** Enter in the name. */
  onSubmit?: () => void;
  disabled?: boolean;
}

/** A canvas's icon and name as one quiet field: the icon opens an emoji
 * picker, the name is typed in place. The same field names a canvas when
 * it's created and while it's open, so both look alike. */
export const CanvasIdentityField = ({
  icon,
  name,
  onIconChange,
  onNameChange,
  size = 'small',
  autoFocus,
  onSubmit,
  disabled,
}: CanvasIdentityFieldProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);
  const dims = SIZES[size];
  const iconLabel = t('workspaceEditor.changeCanvasIcon', 'Cambiar icono');
  const nameLabel = t('workspaceEditor.canvasName', 'Nombre del canvas');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        height: dims.height,
        minWidth: 0,
        pl: 0.5,
        pr: 1,
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'transparent',
        transition: 'border-color 0.15s, background-color 0.15s',
        '&:hover': {
          bgcolor: alpha(theme.palette.text.primary, 0.03),
        },
        '&:focus-within': {
          borderColor: alpha(CANVAS_ACCENT, 0.5),
          bgcolor: 'transparent',
        },
      }}
    >
      <Tooltip title={iconLabel}>
        <ButtonBase
          onClick={(e) => setPickerAnchor(e.currentTarget)}
          disabled={disabled}
          aria-label={iconLabel}
          sx={{
            width: dims.iconBox,
            height: dims.iconBox,
            flexShrink: 0,
            borderRadius: '6px',
            fontSize: dims.icon,
            lineHeight: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          {icon || DEFAULT_CANVAS_ICON}
        </ButtonBase>
      </Tooltip>

      <InputBase
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={nameLabel}
        autoFocus={autoFocus}
        disabled={disabled}
        inputProps={{ maxLength: 200, 'aria-label': nameLabel }}
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: dims.font,
          fontWeight: 600,
          color: 'text.primary',
        }}
      />

      <Menu
        anchorEl={pickerAnchor}
        open={Boolean(pickerAnchor)}
        onClose={() => setPickerAnchor(null)}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: '12px',
            p: 0,
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            onIconChange(emojiData.emoji);
            setPickerAnchor(null);
          }}
          theme={
            theme.palette.mode === 'dark'
              ? EmojiPickerTheme.DARK
              : EmojiPickerTheme.LIGHT
          }
          previewConfig={{ showPreview: false }}
          width={320}
          height={360}
          lazyLoadEmojis
        />
      </Menu>
    </Box>
  );
};
