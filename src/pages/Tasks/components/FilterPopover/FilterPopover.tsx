import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Box,
} from '@mui/material';
import { Flag as FlagIcon, Search as SearchIcon } from '@mui/icons-material';

import {
  StyledPopover,
  Section,
  SectionTitle,
  ItemRow,
  ItemLabel,
  RadioCircle,
  Footer,
  ClearButton,
  ApplyButton,
} from '../Popover.styles';

export interface FilterState {
  priorities: string[];
  categories: string[];
  statuses: string[];
}

interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onApply?: (filters: FilterState) => void;
  onClear?: () => void;
  tags: string[];
  tagSearchTerm: string;
  onTagSearchChange: (term: string) => void;
  activeFilterState?: FilterState;
}

import { getTagColors } from '../../../Tasks/components/TaskDetailModal/TaskDetailModal.utils';

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  onApply,
  onClear,
  tags,
  onTagSearchChange,
  activeFilterState,
}) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    activeFilterState?.priorities || [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    activeFilterState?.categories || [],
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    activeFilterState?.statuses || [],
  );

  const [prevOpen, setPrevOpen] = useState(open);

  const [localSearch, setLocalSearch] = useState('');

  // Debounce the call to onTagSearchChange
  useEffect(() => {
    const handler = setTimeout(() => {
      onTagSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, onTagSearchChange]);

  if (open && !prevOpen) {
    setPrevOpen(true);
    setLocalSearch('');
    onTagSearchChange('');
    setSelectedPriorities(activeFilterState?.priorities || []);
    setSelectedCategories(activeFilterState?.categories || []);
    setSelectedStatuses(activeFilterState?.statuses || []);
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  const toggleSelection = (
    item: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const handleClear = () => {
    setSelectedPriorities([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setLocalSearch('');
    onTagSearchChange('');
    if (onClear) onClear();
  };

  return (
    <StyledPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {/* BY PRIORITY */}
      <Section>
        <SectionTitle>By Priority</SectionTitle>
        <ItemRow
          onClick={() =>
            toggleSelection('High', selectedPriorities, setSelectedPriorities)
          }
        >
          <ItemLabel>
            <FlagIcon sx={{ color: 'error.main', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              High Priority
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedPriorities.includes('High')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Medium', selectedPriorities, setSelectedPriorities)
          }
        >
          <ItemLabel>
            <FlagIcon sx={{ color: 'warning.main', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              Medium Priority
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedPriorities.includes('Medium')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Low', selectedPriorities, setSelectedPriorities)
          }
        >
          <ItemLabel>
            <FlagIcon sx={{ color: 'primary.main', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              Low Priority
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedPriorities.includes('Low')} />
        </ItemRow>
      </Section>
      <Section>
        <SectionTitle>By Tags</SectionTitle>
        <TextField
          size="small"
          placeholder="Search tags..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '12px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              '& fieldset': {
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        {tags.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              fontSize: '12px',
              color: 'text.secondary',
              fontStyle: 'italic',
              px: 1,
              py: 0.5,
            }}
          >
            No tags found
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              maxHeight: '140px',
              overflowY: 'auto',
              pr: 0.5,
              py: 0.5,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
              },
            }}
          >
            {tags.map((tag: string) => {
              const isSelected = selectedCategories.includes(tag);
              const colors = getTagColors(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() =>
                    toggleSelection(
                      tag,
                      selectedCategories,
                      setSelectedCategories,
                    )
                  }
                  variant={isSelected ? 'filled' : 'outlined'}
                  size="small"
                  sx={{
                    fontSize: '11px',
                    fontWeight: 500,
                    height: '24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: isSelected ? '#ffffff' : colors.color,
                    borderColor: isSelected
                      ? 'transparent'
                      : `${colors.color}40`,
                    bgcolor: isSelected ? colors.color : `${colors.color}10`,
                    '&:hover': {
                      bgcolor: isSelected ? colors.color : `${colors.color}20`,
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
      </Section>

      {/* FOOTER */}
      <Footer>
        <ClearButton onClick={handleClear}>Clear All</ClearButton>
        <ApplyButton
          onClick={() => {
            if (onApply)
              onApply({
                priorities: selectedPriorities,
                categories: selectedCategories,
                statuses: selectedStatuses,
              });
            onClose();
          }}
        >
          Apply Filters
        </ApplyButton>
      </Footer>
    </StyledPopover>
  );
};
