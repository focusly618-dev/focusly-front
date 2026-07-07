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

import { type ParsedLuminaAction } from '@/utils';
import { useSuggestedActionCard } from './useSuggestedActionCard.hook';

interface SuggestedActionCardProps {
  action: ParsedLuminaAction;
}

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
    <Card
      sx={{
        mt: 1.5,
        mb: 0.5,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1.2} mb={1}>
          {getActionIcon()}
          <Typography variant="subtitle2" fontWeight={800} color="text.primary">
            {getActionTitle()} Suggestion
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, fontSize: '13px' }}
        >
          {getActionDetails()}
        </Typography>

        {errorMessage && (
          <Typography
            variant="caption"
            color="error.main"
            display="block"
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {isCompleted ? (
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                display="flex"
                alignItems="center"
                gap={0.8}
                sx={{ color: 'success.main' }}
              >
                <CheckCircleIcon sx={{ fontSize: 16 }} />
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
                        tab: 'Workspace',
                        workspaceId: createdId,
                      })
                    }
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '10px',
                      borderRadius: '6px',
                      py: 0.2,
                      px: 1.2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'rgba(59, 130, 246, 0.08)',
                      },
                    }}
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
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '10px',
                    borderRadius: '6px',
                    py: 0.2,
                    px: 1.2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'rgba(59, 130, 246, 0.08)',
                    },
                  }}
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
                  <AddIcon sx={{ fontSize: 14 }} />
                )
              }
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '11px',
                borderRadius: '6px',
                px: 2.5,
                boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
              }}
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
