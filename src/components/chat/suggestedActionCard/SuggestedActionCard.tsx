import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  EventRepeat as RescheduleIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';

import { useSuggestedActionCard } from './useSuggestedActionCard.hook';
import type { SuggestedActionCardProps } from './suggestedActionCard.types';
import {
  cardSx,
  cardContentSx,
  headerRowSx,
  previewBoxSx,
  previewTitleSx,
  previewDescriptionSx,
  previewMetaRowSx,
  metaChipSx,
  errorTextSx,
  actionsRowSx,
  completedRowSx,
  successRowSx,
  successIconSx,
  outlinedActionButtonSx,
  addIconSx,
  primaryActionButtonSx,
} from './suggestedActionCard.styles';

export const SuggestedActionCard: React.FC<SuggestedActionCardProps> = ({
  action,
}) => {
  const theme = useTheme();
  const [, setSearchParams] = useSearchParams();
  const {
    isCompleted,
    createdId,
    errorMessage,
    handleExecute,
    getActionIcon,
    getActionTitle,
    getActionPreview,
    isLoading,
  } = useSuggestedActionCard(action);

  const preview = getActionPreview();

  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={cardContentSx}>
        <Box sx={headerRowSx}>
          {getActionIcon()}
          <Typography variant="subtitle2" fontWeight={800} color="text.primary">
            {getActionTitle()} Suggestion
          </Typography>
        </Box>

        <Box sx={previewBoxSx(theme)}>
          {preview.title && (
            <Typography
              variant="body2"
              fontWeight={700}
              color="text.primary"
              sx={previewTitleSx}
            >
              {preview.title}
            </Typography>
          )}

          {preview.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={previewDescriptionSx}
            >
              {preview.description}
            </Typography>
          )}

          {preview.contentPreview && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={previewDescriptionSx}
            >
              {preview.contentPreview}
            </Typography>
          )}

          {(preview.dateLabel ||
            preview.durationLabel ||
            preview.priorityLabel) && (
            <Box sx={previewMetaRowSx}>
              {preview.dateLabel && (
                <Chip
                  size="small"
                  icon={<CalendarTodayIcon sx={{ fontSize: 13 }} />}
                  label={preview.dateLabel}
                  sx={metaChipSx(theme.palette.primary.main)}
                />
              )}
              {preview.durationLabel && (
                <Chip
                  size="small"
                  icon={<ScheduleIcon sx={{ fontSize: 13 }} />}
                  label={preview.durationLabel}
                  sx={metaChipSx()}
                />
              )}
              {preview.priorityLabel && (
                <Chip
                  size="small"
                  icon={<FlagIcon sx={{ fontSize: 13 }} />}
                  label={preview.priorityLabel}
                  sx={metaChipSx(preview.priorityColor)}
                />
              )}
            </Box>
          )}
        </Box>

        {errorMessage && (
          <Typography
            variant="caption"
            color="error.main"
            display="block"
            sx={errorTextSx}
          >
            {errorMessage}
          </Typography>
        )}

        <Box sx={actionsRowSx}>
          {isCompleted ? (
            <Box sx={completedRowSx}>
              <Box sx={successRowSx}>
                <CheckCircleIcon sx={successIconSx} />
                <Typography variant="caption" fontWeight={700}>
                  {action.type === 'INSERT_TO_WORKSPACE'
                    ? 'Inserted Successfully!'
                    : action.type === 'CREATE_NOTE'
                      ? 'Note Created Successfully!'
                      : action.type === 'UPDATE_TASK'
                        ? 'Moved Successfully!'
                        : 'Created Successfully!'}
                </Typography>
              </Box>

              {createdId &&
                (action.type === 'CREATE_WORKSPACE' ||
                  action.type === 'CREATE_NOTE') && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setSearchParams({
                        tab: 'Projects',
                        workspaceId: createdId,
                      })
                    }
                    sx={outlinedActionButtonSx}
                  >
                    Open Workspace
                  </Button>
                )}

              {createdId &&
                (action.type === 'CREATE_TASK' ||
                  action.type === 'UPDATE_TASK') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set('taskId', createdId);
                      return newParams;
                    });
                  }}
                  sx={outlinedActionButtonSx}
                >
                  View Task
                </Button>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              size="small"
              disabled={isLoading}
              onClick={handleExecute}
              startIcon={
                isLoading ? (
                  <CircularProgress size={12} color="inherit" />
                ) : action.type === 'UPDATE_TASK' ? (
                  <RescheduleIcon sx={addIconSx} />
                ) : (
                  <AddIcon sx={addIconSx} />
                )
              }
              sx={primaryActionButtonSx(theme)}
            >
              {isLoading
                ? action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Inserting...'
                  : action.type === 'UPDATE_TASK'
                    ? 'Moving...'
                    : 'Creating...'
                : action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Insert into Note'
                  : action.type === 'UPDATE_TASK'
                    ? 'Move'
                    : 'Create'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
