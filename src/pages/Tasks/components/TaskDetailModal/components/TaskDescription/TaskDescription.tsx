import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  Highlight as HighlightIcon,
  FormatListBulleted as ListIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { formatDescriptionToHtml } from '@/utils/formatDescription';
import {
  descriptionContainerSx,
  descriptionHeaderSx,
  descriptionInputSx,
} from './TaskDescription.styles';

interface TaskDescriptionProps {
  description: string;
  setDescription: (d: string) => void;
  isReadOnly?: boolean;
}

export const TaskDescription = ({
  description,
  setDescription,
  isReadOnly,
}: TaskDescriptionProps) => {
  const [isPreview, setIsPreview] = useState(
    () => description.trim().length > 0,
  );
  const textareaRef = useRef<HTMLInputElement>(null);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDescription(`${description}\n${prefix}${suffix}`.trim());
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = description.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newText =
      description.substring(0, start) +
      replacement +
      description.substring(end);
    setDescription(newText);
  };

  const formattedHtml = formatDescriptionToHtml(description);

  return (
    <Box sx={descriptionContainerSx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Box sx={descriptionHeaderSx}>
          <DescriptionIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Description
          </Typography>
        </Box>

        {/* Rich Formatting Toolbar & Preview Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {!isReadOnly && !isPreview && (
            <>
              <Tooltip title="Heading 1 (#)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('# ')}
                  sx={{ p: 0.5, fontSize: '11px', fontWeight: 800 }}
                >
                  H1
                </IconButton>
              </Tooltip>
              <Tooltip title="Heading 2 (##)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('## ')}
                  sx={{ p: 0.5, fontSize: '10px', fontWeight: 800 }}
                >
                  H2
                </IconButton>
              </Tooltip>
              <Tooltip title="Bold (**text**)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('**', '**')}
                  sx={{ p: 0.5 }}
                >
                  <BoldIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Italic (*text*)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('*', '*')}
                  sx={{ p: 0.5 }}
                >
                  <ItalicIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Highlight (==text==)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('==', '==')}
                  sx={{ p: 0.5, color: '#eab308' }}
                >
                  <HighlightIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bullet List (- item)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('- ')}
                  sx={{ p: 0.5 }}
                >
                  <ListIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Quote (> text)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('> ')}
                  sx={{ p: 0.5 }}
                >
                  <QuoteIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Code (`code`)">
                <IconButton
                  size="small"
                  onClick={() => insertFormatting('`', '`')}
                  sx={{ p: 0.5 }}
                >
                  <CodeIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </>
          )}

          {description.trim().length > 0 && (
            <Button
              size="small"
              onClick={() => setIsPreview(!isPreview)}
              startIcon={
                isPreview ? (
                  <EditIcon sx={{ fontSize: 12 }} />
                ) : (
                  <PreviewIcon sx={{ fontSize: 12 }} />
                )
              }
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'none',
                px: 1,
                py: 0.2,
                borderRadius: '6px',
                color: 'text.secondary',
              }}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          )}
        </Box>
      </Box>

      {isPreview || (isReadOnly && formattedHtml) ? (
        <Box
          component="div"
          onClick={() => !isReadOnly && setIsPreview(false)}
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
          sx={(theme) => ({
            minHeight: '80px',
            p: 2,
            borderRadius: '10px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(0, 0, 0, 0.015)',
            cursor: isReadOnly ? 'default' : 'pointer',
            fontSize: '13px',
            lineHeight: 1.6,
            wordBreak: 'break-word',
            color: theme.palette.text.primary,
            '& h1': {
              fontSize: '1.2rem',
              fontWeight: 800,
              margin: '8px 0 4px 0',
              color: theme.palette.text.primary,
            },
            '& h2': {
              fontSize: '1.05rem',
              fontWeight: 700,
              margin: '6px 0 4px 0',
              color: theme.palette.text.primary,
            },
            '& h3': {
              fontSize: '0.95rem',
              fontWeight: 700,
              margin: '6px 0 4px 0',
              color: theme.palette.text.primary,
            },
            '& mark, & .formatted-highlight': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(250, 204, 21, 0.3)'
                  : 'rgba(253, 224, 71, 0.5)',
              color: theme.palette.text.primary,
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(250, 204, 21, 0.45)'
                  : 'rgba(234, 179, 8, 0.5)'
              }`,
            },
            '& strong': {
              fontWeight: 700,
              color: theme.palette.text.primary,
            },
            '& em': {
              fontStyle: 'italic',
            },
            '& p': {
              margin: '0 0 6px 0',
            },
            '& ul, & ol': { margin: '6px 0', paddingLeft: '20px' },
            '& li': { margin: '3px 0' },
            '& blockquote': {
              borderLeft: `3px solid ${theme.palette.primary.main}`,
              margin: '6px 0',
              padding: '4px 10px',
              fontStyle: 'italic',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(59, 130, 246, 0.05)',
              borderRadius: '0 6px 6px 0',
            },
            '& code': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.07)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
            },
          })}
        ></Box>
      ) : (
        <TextField
          inputRef={textareaRef}
          multiline
          fullWidth
          minRows={3}
          placeholder="Add formatted details (H1 #, H2 ##, Bold **, Highlight ==text==, List -)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={descriptionInputSx}
          disabled={isReadOnly}
        />
      )}
    </Box>
  );
};
