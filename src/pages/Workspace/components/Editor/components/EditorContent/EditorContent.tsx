import { Box, Typography, useTheme, styled } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { BlockNoteView } from '@blocknote/mantine';
import { SuggestionMenuController } from '@blocknote/react';
import {
  EditorContent as StyledEditorContent,
  FolderBadge,
  TitleInput,
  BlockNoteWrapper,
} from './EditorContent.styles';
import { useCodePasteHandler } from '../../hooks/useCodePasteHandler';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import { BackgroundColorPicker } from '../BackgroundColorPicker/BackgroundColorPicker';

// Header area styled component for Notion-like background
const HeaderArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  padding: '40px 60px 24px',
  margin: '-40px -60px 0', // Negative margin to cover full width
  backgroundColor: bgColor || 'transparent',
  transition: 'background-color 0.3s ease',
  borderBottom:
    bgColor && bgColor !== 'transparent'
      ? `1px solid ${theme.palette.divider}`
      : 'none',
}));

interface EditorContentProps {
  currentFolder?: { name: string; color?: string };
  currentTitle: string;
  setTitle: (t: string) => void;
  currentEmoji?: string;
  setEmoji?: (e: string) => void;
  currentBackgroundColor?: string;
  setBackgroundColor?: (c: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  onContentChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomSlashMenuItems: (editor: any) => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWorkspaceMentionMenuItems: (editor: any) => any[];
}

export const EditorContent = ({
  currentFolder,
  currentTitle,
  setTitle,
  currentEmoji,
  setEmoji,
  currentBackgroundColor,
  setBackgroundColor,
  editor,
  onContentChange,
  getCustomSlashMenuItems,
  getWorkspaceMentionMenuItems,
}: EditorContentProps) => {
  const theme = useTheme();
  const isThemeDark = theme.palette.mode === 'dark';

  // Auto-detect and format pasted code
  useCodePasteHandler(editor);

  // Get background color based on mode
  const getBackgroundColor = () => {
    if (!currentBackgroundColor || currentBackgroundColor === 'default') {
      return 'transparent';
    }
    const colors: Record<string, { dark: string; light: string }> = {
      gray: {
        dark: 'rgba(30, 41, 59, 0.5)',
        light: 'rgba(243, 244, 246, 0.5)',
      },
      blue: {
        dark: 'rgba(30, 58, 138, 0.4)',
        light: 'rgba(219, 234, 254, 0.5)',
      },
      green: {
        dark: 'rgba(20, 83, 45, 0.4)',
        light: 'rgba(220, 252, 231, 0.5)',
      },
      yellow: {
        dark: 'rgba(113, 63, 18, 0.4)',
        light: 'rgba(254, 249, 195, 0.5)',
      },
      orange: {
        dark: 'rgba(124, 45, 18, 0.4)',
        light: 'rgba(255, 237, 213, 0.5)',
      },
      red: {
        dark: 'rgba(127, 29, 29, 0.4)',
        light: 'rgba(254, 226, 226, 0.5)',
      },
      purple: {
        dark: 'rgba(88, 28, 135, 0.4)',
        light: 'rgba(243, 232, 255, 0.5)',
      },
      pink: {
        dark: 'rgba(131, 24, 67, 0.4)',
        light: 'rgba(252, 231, 243, 0.5)',
      },
    };
    const color = colors[currentBackgroundColor];
    return color ? (isThemeDark ? color.dark : color.light) : 'transparent';
  };

  return (
    <StyledEditorContent>
      {/* Header area with background - Notion style */}
      <HeaderArea bgColor={getBackgroundColor()}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          {currentFolder && (
            <FolderBadge bgColor={currentFolder.color}>
              <FolderIcon sx={{ fontSize: 12 }} />
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ textTransform: 'uppercase' }}
              >
                {currentFolder.name}
              </Typography>
            </FolderBadge>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={0}>
          {setEmoji && (
            <EmojiPicker emoji={currentEmoji} onEmojiSelect={setEmoji} />
          )}
          <TitleInput
            placeholder="Untitled Document"
            value={currentTitle}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ flex: 1 }}
          />
          {setBackgroundColor && (
            <BackgroundColorPicker
              currentColor={currentBackgroundColor}
              onColorSelect={setBackgroundColor}
            />
          )}
        </Box>
      </HeaderArea>

      {/* Editor content without background */}
      <BlockNoteWrapper id="joyride-editor-area" sx={{ mt: 3 }}>
        <BlockNoteView
          editor={editor}
          theme={isThemeDark ? 'dark' : 'light'}
          slashMenu={false}
          onChange={onContentChange}
        >
          {/* Slash Menu (/) */}
          <SuggestionMenuController
            triggerCharacter={'/'}
            getItems={async (query) =>
              getCustomSlashMenuItems(editor).filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()),
              )
            }
          />
          <SuggestionMenuController
            triggerCharacter={'@'}
            getItems={async (query) =>
              getWorkspaceMentionMenuItems(editor).filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()),
              )
            }
          />
        </BlockNoteView>
      </BlockNoteWrapper>
    </StyledEditorContent>
  );
};
