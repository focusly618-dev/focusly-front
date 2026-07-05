import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import {
  FileDownloadOutlined,
  Add,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  HeaderContainer,
  FilterButton,
  ActionButton,
} from '../../Insights.styles';
import type { InsightsHeaderProps } from './InsightsHeader.types';

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  filter,
  filters,
  onFilterChange,
  baseDate,
  onNavigate,
  onReset,
  periodLabel,
}) => {
  return (
    <HeaderContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {filter === 'Daily'
              ? "Today's"
              : filter === 'Weekly'
                ? 'Weekly'
                : filter === 'Monthly'
                  ? 'Monthly'
                  : 'Yearly'}{' '}
            Insights
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Productivity Summary
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <ActionButton>
            <FileDownloadOutlined fontSize="small" />
            Export
          </ActionButton>
          <ActionButton primary>
            <Add fontSize="small" />
            Create Report
          </ActionButton>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mt={2}>
        <Box display="flex" gap={1}>
          {filters.map((f) => (
            <FilterButton
              key={f}
              active={filter === f}
              onClick={() => onFilterChange(f)}
            >
              {f}
            </FilterButton>
          ))}
        </Box>

        {filter === 'Monthly' && onNavigate && (
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: '20px',
              px: 1,
              py: 0.25,
              ml: 2,
            }}
          >
            <IconButton
              size="small"
              onClick={() => onNavigate('prev')}
              aria-label="Previous month"
              sx={{ p: 0.25 }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="caption"
              fontWeight="600"
              sx={{
                minWidth: '100px',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {periodLabel}
            </Typography>

            <IconButton
              size="small"
              onClick={() => onNavigate('next')}
              aria-label="Next month"
              disabled={!baseDate}
              sx={{ p: 0.25 }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>

            {baseDate && onReset && (
              <Button
                size="small"
                onClick={onReset}
                variant="text"
                sx={{
                  ml: 0.5,
                  fontSize: '9px',
                  textTransform: 'none',
                  minWidth: 'auto',
                  p: 0,
                  fontWeight: 'bold',
                }}
              >
                Today
              </Button>
            )}
          </Box>
        )}
      </Box>
    </HeaderContainer>
  );
};
