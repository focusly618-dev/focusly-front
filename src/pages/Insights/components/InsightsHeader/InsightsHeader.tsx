import React from 'react';
import { Box, Typography } from '@mui/material';
import { FileDownloadOutlined, Add } from '@mui/icons-material';
import {
  HeaderContainer,
  FilterButton,
  ActionButton,
} from '../../Insights.styles';
import type { InsightsHeaderProps } from './InsightsHeader.types';
import { useTranslation } from 'react-i18next';

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  filter,
  filters,
  onFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {filter === 'Daily'
              ? t("Today's Insights")
              : filter === 'Weekly'
                ? t('Weekly Insights')
                : t('Monthly Insights')}
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            {t('Productivity Summary')}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <ActionButton>
            <FileDownloadOutlined fontSize="small" />
            {t('Export')}
          </ActionButton>
          <ActionButton primary>
            <Add fontSize="small" />
            {t('Create Report')}
          </ActionButton>
        </Box>
      </Box>

      <Box display="flex" gap={1} mt={2}>
        {filters.map((f) => (
          <FilterButton
            key={f}
            active={filter === f}
            onClick={() => onFilterChange(f)}
          >
            {t(f)}
          </FilterButton>
        ))}
      </Box>
    </HeaderContainer>
  );
};
