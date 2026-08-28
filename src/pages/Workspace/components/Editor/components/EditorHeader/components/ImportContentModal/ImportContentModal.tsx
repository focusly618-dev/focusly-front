import { useRef, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Article as WordIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Code as MarkdownIcon,
  InsertDriveFileOutlined as FileIcon,
  Close as RemoveFileIcon,
} from '@mui/icons-material';
import { BaseModal } from '@/components/modals';
import { Button } from '@/components/ui';
import { sileo } from '@/utils';
import type { MarkdownEditorRef } from '../../../../codemirror/MarkdownEditor.types';
import { getConverter } from './documentConverters';

interface ImportContentModalProps {
  open: boolean;
  onClose: () => void;
  markdownEditorRef?: React.RefObject<MarkdownEditorRef | null>;
}

interface ImportSource {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
  accept: string;
  supported: boolean;
}

const IMPORT_SOURCES: ImportSource[] = [
  {
    id: 'word',
    label: 'Word & Google Docs',
    description: 'Import and convert .docx — export Google Docs as Word first',
    icon: <WordIcon sx={{ fontSize: 20 }} />,
    color: '#2B579A',
    accept: '.docx',
    supported: true,
  },
  {
    id: 'excel',
    label: 'Microsoft Excel',
    icon: <ExcelIcon sx={{ fontSize: 20 }} />,
    color: '#217346',
    accept: '.xls,.xlsx',
    supported: true,
  },
  {
    id: 'pdf',
    label: 'PDF Document',
    icon: <PdfIcon sx={{ fontSize: 20 }} />,
    color: '#EF4444',
    accept: '.pdf',
    supported: true,
  },
  {
    id: 'markdown',
    label: 'Markdown / Text',
    icon: <MarkdownIcon sx={{ fontSize: 20 }} />,
    color: '#64748B',
    accept: '.md,.txt',
    supported: true,
  },
];

export const ImportContentModal: React.FC<ImportContentModalProps> = ({
  open,
  onClose,
  markdownEditorRef,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleReset = () => {
    setStagedFiles([]);
    setIsDragOver(false);
    setIsImporting(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    setStagedFiles((prev) => [...prev, ...incoming]);
  };

  const handleRemoveFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBrowseClick = (accept?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept || '.zip,.pdf,.docx,.xlsx,.md,.txt';
      fileInputRef.current.click();
    }
  };

  const handleSourceClick = (source: ImportSource) => {
    if (!source.supported) {
      sileo.info({
        title: `${source.label} import coming soon`,
        description:
          'This source is not connected yet — Markdown/Text and drag & drop already work.',
        fill: 'var(--sileo-info-bg)',
      });
      return;
    }
    handleBrowseClick(source.accept);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleImportSelected = async () => {
    if (stagedFiles.length === 0) return;
    setIsImporting(true);

    const dispatched = stagedFiles.map((file) => ({
      file,
      converter: getConverter(file),
    }));
    const convertible = dispatched.filter((d) => d.converter);
    const unsupportedCount = dispatched.length - convertible.length;

    const results = await Promise.allSettled(
      convertible.map(async ({ file, converter }) => ({
        name: file.name,
        text: await converter!(file),
      })),
    );

    const succeeded = results
      .filter(
        (r): r is PromiseFulfilledResult<{ name: string; text: string }> =>
          r.status === 'fulfilled',
      )
      .map((r) => r.value);
    const failed = results.filter((r) => r.status === 'rejected');

    if (failed.length > 0) {
      console.error(
        'Failed to convert file(s):',
        failed.map((r) => (r as PromiseRejectedResult).reason),
      );
    }

    const combined = succeeded
      .map((s) => s.text)
      .filter(Boolean)
      .join('\n\n---\n\n');

    if (combined) {
      markdownEditorRef?.current?.insertAtCursor(combined);
      sileo.success({
        title: 'Content imported',
        description: `${succeeded.length} file${succeeded.length > 1 ? 's' : ''} added to your note.`,
        fill: 'var(--sileo-success-bg)',
      });
    }

    if (failed.length > 0) {
      sileo.error({
        title: 'Some files failed to convert',
        description: `${failed.length} file${failed.length > 1 ? 's' : ''} could not be read — the file may be corrupted or password-protected.`,
        fill: 'var(--sileo-error-bg)',
      });
    }

    if (unsupportedCount > 0) {
      sileo.info({
        title: 'Some files were skipped',
        description: `${unsupportedCount} file${unsupportedCount > 1 ? 's' : ''} in a format we don't convert yet (legacy .doc or .zip).`,
        fill: 'var(--sileo-info-bg)',
      });
    }

    if (combined || failed.length > 0 || unsupportedCount > 0) {
      handleClose();
    }
    setIsImporting(false);
  };

  const modalActions = (
    <>
      <Button onClick={handleClose} variant="text" sx={{ color: 'text.secondary' }}>
        Cancel
      </Button>
      <Button
        onClick={handleImportSelected}
        variant="contained"
        disabled={stagedFiles.length === 0}
        loading={isImporting}
      >
        Import Selected
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Import Content"
      subtitle="Bring your existing documents and data into your Focusly workspace."
      maxWidth="sm"
      actions={modalActions}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <Box
        onClick={() => handleBrowseClick()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: isDragOver
            ? 'primary.main'
            : isDark
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(0,0,0,0.12)',
          borderRadius: '16px',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragOver
            ? isDark
              ? 'rgba(59,130,246,0.08)'
              : 'rgba(59,130,246,0.04)'
            : 'transparent',
          transition: 'all 0.15s ease',
          '&:hover': { borderColor: 'primary.main' },
        }}
      >
        <CloudUploadIcon
          sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }}
        />
        <Typography variant="body1" fontWeight={700}>
          Drag & drop files here, or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supports ZIP, PDF, DOCX, XLSX, MD, and TXT files. Maximum file size
          is 50MB per document.
        </Typography>
      </Box>

      {stagedFiles.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {stagedFiles.map((file, index) => (
            <Box
              key={`${file.name}-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.08)',
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
              }}
            >
              <FileIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
              <Typography variant="caption" fontWeight={600}>
                {file.name}
              </Typography>
              <RemoveFileIcon
                onClick={() => handleRemoveFile(index)}
                sx={{
                  fontSize: 14,
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'error.main' },
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: 'text.secondary',
          mt: 3,
          mb: 1.5,
          display: 'block',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Quick Import Services
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
        }}
      >
        {IMPORT_SOURCES.map((source) => (
          <Box
            key={source.id}
            onClick={() => handleSourceClick(source)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1.5,
              borderRadius: '10px',
              border: '1px solid',
              borderColor: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.06)',
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
              cursor: 'pointer',
              opacity: source.supported ? 1 : 0.75,
              transition: 'all 0.15s ease',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${source.color}1A`,
                color: source.color,
                flexShrink: 0,
              }}
            >
              {source.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {source.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {source.description ??
                  (source.supported
                    ? 'Import and convert to Focusly format'
                    : 'Coming soon')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </BaseModal>
  );
};
