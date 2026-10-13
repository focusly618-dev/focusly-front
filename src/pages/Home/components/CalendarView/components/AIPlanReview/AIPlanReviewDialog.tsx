import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AutoAwesome as SparkIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { UnplacedTask } from '@/services/calendarPlanService';
import type { ICalendarEvent } from '../../../CalendarEvent';
import { focusTime, includedDrafts } from './planReviewModel';
import { PlanList } from './PlanList';
import { PlanTimeline } from './PlanTimeline';

export interface AIPlanReviewDialogProps {
  open: boolean;
  drafts: ICalendarEvent[];
  excluded: string[];
  unplaced: UnplacedTask[];
  /** What's already on the calendar, shown around the proposal. */
  busyEvents: ICalendarEvent[];
  confirming: boolean;
  /** Closes without deciding: the blocks stay proposed on the calendar. */
  onClose: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
  onToggle: (draftId: string) => void;
}

/**
 * Lumina's proposal, reviewed in the center of the screen: its blocks laid
 * out as on the calendar next to the list to keep or leave out each one.
 */
export const AIPlanReviewDialog: React.FC<AIPlanReviewDialogProps> = ({
  open,
  drafts,
  excluded,
  unplaced,
  busyEvents,
  confirming,
  onClose,
  onConfirm,
  onDiscard,
  onToggle,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const included = includedDrafts(drafts, excluded);
  const time = focusTime(included);

  return (
    <Dialog
      open={open}
      onClose={confirming ? undefined : onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={small}
      aria-labelledby="ai-plan-review-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: small ? 0 : '18px',
            height: small ? '100%' : 'min(780px, 90vh)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.25,
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <SparkIcon sx={{ fontSize: 20, color: 'primary.main', mt: '3px' }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            id="ai-plan-review-title"
            component="h2"
            sx={{ fontWeight: 750, fontSize: '16px', lineHeight: 1.3 }}
          >
            {t('calendar.plan.reviewTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('calendar.plan.reviewSummary', { count: included.length })}
            {time.total > 0 &&
              ` · ${t('calendar.plan.focusTime', {
                hours: time.hours,
                minutes: time.minutes,
              })}`}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          disabled={confirming}
          aria-label={t('calendar.plan.closeReview')}
          title={t('calendar.plan.closeReview')}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Preview and list */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 1.5fr) minmax(320px, 1fr)',
          },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            overflow: 'auto',
            minHeight: 0,
            maxHeight: { sm: '42vh', md: 'none' },
            borderBottom: { sm: '1px solid', md: 'none' },
            borderColor: 'divider',
          }}
        >
          <PlanTimeline
            drafts={drafts}
            excluded={excluded}
            busyEvents={busyEvents}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onToggle={(id) => !confirming && onToggle(id)}
          />
        </Box>
        <Box
          sx={{
            overflow: 'auto',
            minHeight: 0,
            p: { xs: 2, sm: 2.5 },
            borderLeft: { md: '1px solid' },
            borderColor: 'divider',
          }}
        >
          <PlanList
            drafts={drafts}
            excluded={excluded}
            unplaced={unplaced}
            confirming={confirming}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onToggle={onToggle}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          px: { xs: 2, sm: 3 },
          py: 1.75,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', flex: 1, minWidth: 200 }}
        >
          {t('calendar.plan.dragHint')}
        </Typography>
        <Button
          onClick={onDiscard}
          disabled={confirming}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          {t('calendar.discard')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={confirming || included.length === 0}
          startIcon={
            confirming ? (
              <CircularProgress size={14} color="inherit" />
            ) : undefined
          }
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '10px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          {confirming
            ? t('calendar.scheduling')
            : t('calendar.plan.confirm', { count: included.length })}
        </Button>
      </Box>
    </Dialog>
  );
};
