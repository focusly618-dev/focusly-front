import { useState } from 'react';
import { Box, IconButton, Popover, alpha, useTheme } from '@mui/material';
import { EmojiEmotions as EmojiIcon } from '@mui/icons-material';

const COMMON_EMOJIS = [
  '📝',
  '📋',
  '📌',
  '🎯',
  '💡',
  '🚀',
  '⚡',
  '🔥',
  '💪',
  '🧠',
  '📊',
  '📈',
  '🗂️',
  '📁',
  '🏠',
  '🎨',
  '✨',
  '🌟',
  '⭐',
  '🌙',
  '☀️',
  '🌈',
  '🎵',
  '🎬',
  '💻',
  '🖥️',
  '⌨️',
  '📱',
  '🔌',
  '🔋',
  '💾',
  '📀',
  '🔒',
  '🔑',
  '🛡️',
  '🔐',
  '📝',
  '✏️',
  '🖊️',
  '🖋️',
  '📚',
  '📖',
  '📕',
  '📗',
  '📘',
  '📙',
  '🗞️',
  '📰',
  '🎓',
  '🏆',
  '🥇',
  '🥈',
  '🥉',
  '🏅',
  '🎖️',
  '🏵️',
  '💼',
  '📊',
  '📈',
  '📉',
  '📉',
  '📊',
  '📋',
  '📌',
];

interface EmojiPickerProps {
  emoji?: string;
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ emoji, onEmojiSelect }: EmojiPickerProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (selectedEmoji: string) => {
    onEmojiSelect(selectedEmoji);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          fontSize: '40px',
          p: 0.5,
          minWidth: 'auto',
          width: '48px',
          height: '48px',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        {emoji || <EmojiIcon sx={{ fontSize: 28, color: 'text.secondary' }} />}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              borderRadius: '8px',
              maxWidth: 320,
              maxHeight: 300,
              overflow: 'auto',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 1,
          }}
        >
          {COMMON_EMOJIS.map((emojiChar) => (
            <Box
              key={emojiChar}
              onClick={() => handleEmojiClick(emojiChar)}
              sx={{
                fontSize: '24px',
                cursor: 'pointer',
                p: 1,
                borderRadius: '4px',
                transition: 'all 0.2s',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.2)',
                },
              }}
            >
              {emojiChar}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};
