import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CheckCircle as TasksIcon,
  BarChart as InsightsIcon,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
} from '@mui/icons-material';
import { NavItem } from '../Sidebar.styles';
import { TaskBar } from '../types/Sidebar.types';
import { CuteRobotIcon } from '@/components/ui';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import { ProjectGroupsSection } from './ProjectGroupsSection';
import { useTranslation } from 'react-i18next';

interface SidebarNavigationProps {
  sidebar: UseSidebarReturn;
}

export const SidebarNavigation = ({ sidebar }: SidebarNavigationProps) => {
  const { t } = useTranslation();
  const { activeTab, changeStatusTab, theme } = sidebar;
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const handleProjectsTabClick = () => {
    if (activeTab !== TaskBar.Workspace) {
      changeStatusTab(TaskBar.Workspace);
      setIsProjectsExpanded(true);
    } else {
      setIsProjectsExpanded((prev) => !prev);
    }
  };

  return (
    <List sx={{ padding: '16px', marginTop: '-30px' }}>
      <ListItem disablePadding>
        <NavItem
          id="joyride-daily-plan"
          active={activeTab === TaskBar.DailyPlan}
          onClick={() => changeStatusTab(TaskBar.DailyPlan)}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('Daily Plan')}
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </NavItem>
      </ListItem>
      <ListItem disablePadding>
        <NavItem
          id="joyride-tasks"
          active={activeTab === TaskBar.Tasks}
          onClick={() => changeStatusTab(TaskBar.Tasks)}
        >
          <ListItemIcon>
            <TasksIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('Tasks')}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </NavItem>
      </ListItem>
      <ListItem disablePadding>
        <NavItem
          id="joyride-ask-ai"
          active={activeTab === TaskBar.AskAI}
          onClick={() => changeStatusTab(TaskBar.AskAI)}
          sx={{
            '&': {
              position: 'relative',
              overflow: 'hidden',
            },
            ...(activeTab === TaskBar.AskAI && {
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(19,127,236,0.12) 0%, rgba(124,58,237,0.08) 100%)',
                borderRadius: 'inherit',
              },
            }),
          }}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <CuteRobotIcon
                size={22}
                variant="mini"
                primaryColor={
                  activeTab === TaskBar.AskAI
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary
                }
                eyeColor={
                  activeTab === TaskBar.AskAI
                    ? '#22d3ee'
                    : theme.palette.text.secondary
                }
              />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={t('Ask AI')}
            primaryTypographyProps={{
              fontWeight: activeTab === TaskBar.AskAI ? 700 : 500,
              sx: {
                background:
                  activeTab === TaskBar.AskAI
                    ? `linear-gradient(90deg, ${theme.palette.primary.main}, #7c3aed)`
                    : 'none',
                WebkitBackgroundClip:
                  activeTab === TaskBar.AskAI ? 'text' : 'unset',
                WebkitTextFillColor:
                  activeTab === TaskBar.AskAI ? 'transparent' : 'inherit',
              },
            }}
          />
        </NavItem>
      </ListItem>
      <ListItem disablePadding>
        <NavItem
          id="joyride-insights"
          active={activeTab === TaskBar.Insights}
          onClick={() => changeStatusTab(TaskBar.Insights)}
        >
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('Insights')}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </NavItem>
      </ListItem>
      <ListItem
        disablePadding
        sx={{ flexDirection: 'column', alignItems: 'stretch' }}
      >
        <NavItem
          id="joyride-workspace"
          active={activeTab === TaskBar.Workspace}
          onClick={handleProjectsTabClick}
          sx={{
            '&:hover .tab-hover-actions': { opacity: 1 },
          }}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  activeTab === TaskBar.Workspace
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                borderRadius: 1,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={t('Projects')}
            primaryTypographyProps={{ fontWeight: 500 }}
          />

          <Box
            className="tab-hover-actions"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              opacity: 0,
              transition: 'opacity 0.15s ease-in-out',
              ml: 'auto',
            }}
          >
            {activeTab === TaskBar.Workspace && (
              <Tooltip title={t('New Project')} arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    sidebar.setIsCreatingGroupInline((prev) => !prev);
                  }}
                  sx={{
                    p: 0.2,
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleProjectsTabClick();
            }}
            sx={{
              p: 0.2,
              color: 'text.secondary',
              ml: activeTab === TaskBar.Workspace ? 0.5 : 'auto',
            }}
          >
            {isProjectsExpanded ? (
              <ExpandLess sx={{ fontSize: 16 }} />
            ) : (
              <ExpandMore sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </NavItem>

        <Collapse in={isProjectsExpanded && activeTab === TaskBar.Workspace}>
          <Box sx={{ mt: 0.5, pl: 0.5, pr: 0.5 }}>
            <ProjectGroupsSection sidebar={sidebar} hideHeader />
          </Box>
        </Collapse>
      </ListItem>
    </List>
  );
};
