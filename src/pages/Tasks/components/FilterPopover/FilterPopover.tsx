import React, { useState } from 'react';
import { Typography } from '@mui/material';
import {
  Flag as FlagIcon,
  CircleOutlined as CircleOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  StyledPopover,
  Section,
  SectionTitle,
  ItemRow,
  ItemLabel,
  RadioCircle,
  CategoryRow,
  CategoryItem,
  Dot,
  Footer,
  ClearButton,
  ApplyButton,
  AccessTimeIcon,
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
  activeFilterState,
}) => {
  const { t } = useTranslation();
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

  if (open && !prevOpen) {
    setPrevOpen(true);
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
        <SectionTitle>{t('By Priority')}</SectionTitle>
        <ItemRow
          onClick={() =>
            toggleSelection('High', selectedPriorities, setSelectedPriorities)
          }
        >
          <ItemLabel>
            <FlagIcon sx={{ color: 'error.main', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('High Priority')}
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
              {t('Medium Priority')}
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
              {t('Low Priority')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedPriorities.includes('Low')} />
        </ItemRow>
      </Section>
      <Section>
        <SectionTitle>{t('By Tags')}</SectionTitle>
        <CategoryRow>
          {tags.map((tag: string) => (
            <CategoryItem
              key={tag}
              selected={selectedCategories.includes(tag)}
              onClick={() =>
                toggleSelection(tag, selectedCategories, setSelectedCategories)
              }
            >
              <Dot color={getTagColors(tag).color} />
              <Typography variant="body2" sx={{ fontSize: '13px' }}>
                {t(tag)}
              </Typography>
            </CategoryItem>
          ))}
        </CategoryRow>
      </Section>

      {/* BY STATUS */}
      <Section>
        <SectionTitle>{t('By Status')}</SectionTitle>
        <ItemRow
          onClick={() =>
            toggleSelection('Todo', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <CircleOutlinedIcon sx={{ color: '#94a3b8', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('To Do')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Todo')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Planning', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <AccessTimeIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Planning')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Planning')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Scheduled', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <AccessTimeIcon sx={{ color: '#8b5cf6', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Scheduled')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Scheduled')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Review', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <HistoryIcon sx={{ color: '#06b6d4', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Review')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Review')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Pending', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <HistoryIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Pending')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Pending')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('On Hold', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <HistoryIcon sx={{ color: '#ef4444', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('On Hold')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('On Hold')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Done', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Done')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Done')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Backlog', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <HistoryIcon sx={{ color: '#64748b', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Backlog')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Backlog')} />
        </ItemRow>
        <ItemRow
          onClick={() =>
            toggleSelection('Archived', selectedStatuses, setSelectedStatuses)
          }
        >
          <ItemLabel>
            <HistoryIcon sx={{ color: '#4b5563', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t('Archived')}
            </Typography>
          </ItemLabel>
          <RadioCircle selected={selectedStatuses.includes('Archived')} />
        </ItemRow>
      </Section>

      {/* FOOTER */}
      <Footer>
        <ClearButton onClick={handleClear}>{t('Clear All')}</ClearButton>
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
          {t('Apply Filters')}
        </ApplyButton>
      </Footer>
    </StyledPopover>
  );
};
