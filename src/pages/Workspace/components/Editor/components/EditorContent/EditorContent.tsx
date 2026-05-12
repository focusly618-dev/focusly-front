import { Box, Typography, useTheme } from '@mui/material';
import { Folder as FolderIcon, Summarize as SummarizeIcon } from '@mui/icons-material';
import { BlockNoteView } from '@blocknote/mantine';
import { SuggestionMenuController } from '@blocknote/react';
import {
  EditorContent as StyledEditorContent,
  FolderBadge,
  TitleInput,
  BlockNoteWrapper,
} from './EditorContent.styles';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { GeminiIcon } from '@/components/ui/GeminiIcon';
import { useState } from 'react';

interface EditorContentProps {
  currentFolder?: { name: string; color?: string };
  currentTitle: string;
  setTitle: (t: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  onContentChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomSlashMenuItems: (editor: any) => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWorkspaceMentionMenuItems: (editor: any) => any[];
  onOpenTaskDetails?: (task: any) => void;
}

export const EditorContent = ({
  currentFolder,
  currentTitle,
  setTitle,
  editor,
  onContentChange,
  getCustomSlashMenuItems,
  getWorkspaceMentionMenuItems,
  onOpenTaskDetails,
}: EditorContentProps) => {
  const theme = useTheme();
  const isThemeDark = theme.palette.mode === 'dark';

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    selectedText: string;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      event.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 4,
              selectedText: text,
            }
          : null,
      );
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCreateTaskAI = () => {
    if (onOpenTaskDetails && contextMenu) {
      // Create a "virtual" task object to seed the modal
      onOpenTaskDetails({
        id: `ai-${Date.now()}`,
        title: contextMenu.selectedText,
        use_ai: true,
        status: 'Todo',
        priority_level: 2,
        category: 'General',
      });
    }
    handleClose();
  };

  const handleCreateResumeAI = () => {
    // Placeholder for AI summarization logic
    console.log('Summarizing text:', contextMenu?.selectedText);
    handleClose();
  };

  return (
    <StyledEditorContent>
      <Box display="flex" alignItems="center" gap={1.5}>
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

      <TitleInput
        placeholder="Untitled Document"
        value={currentTitle}
        onChange={(e) => setTitle(e.target.value)}
      />

      <BlockNoteWrapper id="joyride-editor-area" onContextMenu={handleContextMenu}>
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

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '220px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            border: '1px solid',
            borderColor: 'divider',
          }
        }}
      >
        <MenuItem onClick={handleCreateTaskAI} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <GeminiIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText 
            primary="Create task with AI" 
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem onClick={handleCreateResumeAI} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SummarizeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Create resume with AI" 
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>
    </StyledEditorContent>
  );
};
