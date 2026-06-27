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
import { ExpandMore, ExpandLess, Add as AddIcon } from '@mui/icons-material';
import { NavItem } from '../Sidebar.styles';
import { TaskBar } from '../types/Sidebar.types';
import {
  DailyPlanIcon,
  TasksIcon,
  AskAIIcon,
  InsightsIcon,
  ProjectIcon,
} from '@/components/ui';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import { ProjectGroupsSection } from './ProjectGroupsSection';

interface SidebarNavigationProps {
  sidebar: UseSidebarReturn;
}

export const SidebarNavigation = ({ sidebar }: SidebarNavigationProps) => {
  const { activeTab, changeStatusTab, theme } = sidebar;
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const expandAll = () => {
    // Expand all groups (projects)
    const newExpandedGroups: Record<string, boolean> = {};
    const groups = sidebar.projectGroups || [];
    groups.forEach((g) => {
      newExpandedGroups[g.id] = true;
    });
    newExpandedGroups['ungrouped'] = true;
    sidebar.setExpandedGroups(newExpandedGroups);
  };

  const handleProjectsTabClick = () => {
    // Reset search params to show all workspaces in the main component
    const newParams = new URLSearchParams();
    newParams.set('tab', TaskBar.Workspace);
    sidebar.setSearchParams(newParams);

    changeStatusTab(TaskBar.Workspace, newParams);
    setIsProjectsExpanded(true);
    expandAll();
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
            <DailyPlanIcon />
          </ListItemIcon>
          <ListItemText
            primary="Daily Plan"
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
            primary="Tasks"
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
            <AskAIIcon
              sx={{
                color:
                  activeTab === TaskBar.AskAI
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Ask AI"
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
            primary="Insights"
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
              <ProjectIcon
                sx={{
                  color:
                    activeTab === TaskBar.Workspace
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                }}
              />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary="Project"
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
              <Tooltip title="New Project" arrow>
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
              setIsProjectsExpanded((prev) => !prev);
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
