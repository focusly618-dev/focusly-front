import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  CheckCircleRounded as DoneIcon,
  ErrorOutlineRounded as ErrorIcon,
  EditOutlined as EditIcon,
  KeyboardArrowDown as ExpandIcon,
  Check as SaveIcon,
  Close as CancelIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import type { PlanItemStatus } from '../useActionPlan.hook';
import {
  BRAND,
  Details,
  ItemIcon,
  ItemRow,
  ItemTitle,
  LinkButton,
  MetaChip,
  MetaRow,
  RowMain,
} from '../ActionPlan.styles';

export interface EditField {
  key: string;
  label: string;
  type: 'text' | 'datetime-local';
  value: string;
}

interface PlanItemProps {
  /** Null for something the plan doesn't create (an existing project). */
  index: number | null;
  status?: PlanItemStatus;
  selected?: boolean;
  canEdit?: boolean;
  onToggle?: () => void;
  icon: ReactNode;
  iconColor?: string | null;
  title: string;
  meta?: ReactNode;
  /** Shown when expanded. */
  details?: ReactNode;
  defaultExpanded?: boolean;
  tone?: 'default' | 'project' | 'danger';
  /** Quick edits allowed before running (title, date…). */
  editFields?: EditField[];
  onSaveEdit?: (values: Record<string, string>) => void;
  openLabel?: string;
  onOpen?: () => void;
  /** Extra row under the meta chips (notices, more links). */
  footer?: ReactNode;
  /** Nested items (a project's documents, a document's tasks). */
  children?: ReactNode;
}

export const PlanItem = ({
  index,
  status = 'pending',
  selected = true,
  canEdit = false,
  onToggle,
  icon,
  iconColor,
  title,
  meta,
  details,
  defaultExpanded = false,
  tone = 'default',
  editFields,
  onSaveEdit,
  openLabel,
  onOpen,
  footer,
  children,
}: PlanItemProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [draft, setDraft] = useState<Record<string, string> | null>(null);

  const selectable =
    index !== null && (status === 'pending' || status === 'error');
  const muted = index !== null && !selected && status !== 'done';

  const startEdit = () =>
    setDraft(
      Object.fromEntries((editFields ?? []).map((f) => [f.key, f.value])),
    );
  const saveEdit = () => {
    if (draft) onSaveEdit?.(draft);
    setDraft(null);
  };

  return (
    <Box>
      <ItemRow muted={muted} tone={tone}>
        <RowMain>
          <Box
            sx={{
              width: 32,
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {status === 'creating' ? (
              <CircularProgress size={16} sx={{ mt: 0.75, color: BRAND }} />
            ) : status === 'done' ? (
              <DoneIcon
                sx={{ mt: 0.6, fontSize: 20, color: BRAND }}
                aria-label={t('actionPlan.status.done')}
              />
            ) : selectable ? (
              <Checkbox
                size="small"
                checked={selected}
                onChange={onToggle}
                disabled={!canEdit}
                sx={{ p: 0.5, '&.Mui-checked': { color: BRAND } }}
                slotProps={{ input: { 'aria-label': title } }}
              />
            ) : null}
          </Box>

          <ItemIcon tint={iconColor}>{icon}</ItemIcon>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {draft ? (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                {(editFields ?? []).map((field) => (
                  <TextField
                    key={field.key}
                    size="small"
                    type={field.type}
                    label={field.label}
                    value={draft[field.key] ?? ''}
                    onChange={(e) =>
                      setDraft({ ...draft, [field.key]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Escape' && setDraft(null)}
                    autoFocus={field === editFields?.[0]}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{
                      flex: field.type === 'text' ? '1 1 220px' : '0 1 220px',
                    }}
                  />
                ))}
                <IconButton
                  size="small"
                  type="submit"
                  aria-label={t('actionPlan.edit.save')}
                >
                  <SaveIcon sx={{ fontSize: 18, color: BRAND }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setDraft(null)}
                  aria-label={t('actionPlan.edit.cancel')}
                >
                  <CancelIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            ) : (
              <>
                <ItemTitle>{title}</ItemTitle>
                <MetaRow>
                  {meta}
                  {status === 'error' && (
                    <MetaChip accent="#EF4444">
                      <ErrorIcon />
                      {t('actionPlan.status.error')}
                    </MetaChip>
                  )}
                  {status === 'skipped' && (
                    <MetaChip>{t('actionPlan.status.skipped')}</MetaChip>
                  )}
                </MetaRow>
                {status === 'done' && onOpen && (
                  <LinkButton onClick={onOpen} sx={{ mt: 0.5, ml: -0.75 }}>
                    <OpenIcon />
                    {openLabel}
                  </LinkButton>
                )}
                {footer}
              </>
            )}
          </Box>

          {!draft && (
            <Box sx={{ display: 'flex', flexShrink: 0 }}>
              {editFields && canEdit && status !== 'done' && (
                <Tooltip title={t('actionPlan.edit.edit')}>
                  <IconButton
                    size="small"
                    onClick={startEdit}
                    aria-label={t('actionPlan.edit.edit')}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {details && (
                <Tooltip
                  title={
                    expanded
                      ? t('actionPlan.details.hide')
                      : t('actionPlan.details.show')
                  }
                >
                  <IconButton
                    size="small"
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                    aria-label={
                      expanded
                        ? t('actionPlan.details.hide')
                        : t('actionPlan.details.show')
                    }
                  >
                    <ExpandIcon
                      sx={{
                        fontSize: 20,
                        transition: 'transform 0.15s ease',
                        transform: expanded ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </RowMain>
        {expanded && details && <Details>{details}</Details>}
      </ItemRow>
      {children}
    </Box>
  );
};
