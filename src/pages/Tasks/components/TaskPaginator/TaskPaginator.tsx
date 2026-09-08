import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import {
  ChevronLeftRounded as ChevronLeftIcon,
  ChevronRightRounded as ChevronRightIcon,
} from '@mui/icons-material';
import type { TaskPaginatorProps } from './TaskPaginator.types';
import {
  PaginatorCapsule,
  PaginatorInfo,
  PaginatorDivider,
  PaginatorControls,
  PagePill,
  PaginatorNavBtn,
} from './TaskPaginator.styles';

export const TaskPaginator: React.FC<TaskPaginatorProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 24,
  onPageChange,
  isLoading = false,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  return (
    <PaginatorCapsule>
      <PaginatorInfo>
        <Box
          component="span"
          sx={{ fontWeight: 600, color: 'text.primary', mr: 0.5 }}
        >
          {startItem}–{endItem}
        </Box>
        <Box component="span" sx={{ opacity: 0.4, mx: 0.25 }}>
          /
        </Box>
        <Box
          component="span"
          sx={{ fontWeight: 500, color: 'text.secondary', ml: 0.5 }}
        >
          {totalItems}
        </Box>
      </PaginatorInfo>

      <PaginatorDivider />

      <PaginatorControls>
        <Tooltip title="Página anterior">
          <span>
            <PaginatorNavBtn
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              size="small"
              aria-label="Página anterior"
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </PaginatorNavBtn>
          </span>
        </Tooltip>

        <PagePill>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              color: 'primary.main',
              lineHeight: 1,
            }}
          >
            {currentPage}
          </Typography>
          <Box
            component="span"
            sx={{
              opacity: 0.35,
              mx: 0.4,
              fontSize: '10px',
              color: 'text.secondary',
              lineHeight: 1,
            }}
          >
            /
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              fontSize: '11px',
              color: 'text.secondary',
              lineHeight: 1,
            }}
          >
            {totalPages}
          </Typography>
        </PagePill>

        <Tooltip title="Página siguiente">
          <span>
            <PaginatorNavBtn
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              size="small"
              aria-label="Página siguiente"
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </PaginatorNavBtn>
          </span>
        </Tooltip>
      </PaginatorControls>
    </PaginatorCapsule>
  );
};
