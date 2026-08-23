import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import { useSuggestedActionCard } from './useSuggestedActionCard.hook';
import type { SuggestedActionCardProps } from './suggestedActionCard.types';
import {
  cardSx,
  cardContentSx,
  headerRowSx,
  detailsTextSx,
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
    getActionDetails,
    isLoading,
  } = useSuggestedActionCard(action);

  return (
    <Card sx={cardSx(theme)}>
      <CardContent sx={cardContentSx}>
        <Box sx={headerRowSx}>
          {getActionIcon()}
          <Typography variant="subtitle2" fontWeight={800} color="text.primary">
            {getActionTitle()} Suggestion
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={detailsTextSx}>
          {getActionDetails()}
        </Typography>

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

              {createdId && action.type === 'CREATE_TASK' && (
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
                ) : (
                  <AddIcon sx={addIconSx} />
                )
              }
              sx={primaryActionButtonSx(theme)}
            >
              {isLoading
                ? action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Inserting...'
                  : 'Creating...'
                : action.type === 'INSERT_TO_WORKSPACE'
                  ? 'Insert into Note'
                  : 'Create'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
