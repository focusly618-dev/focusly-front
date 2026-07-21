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
  Avatar,
  Typography,
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
  const { activeTab, changeStatusTab, theme, isCollapsed } = sidebar;
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const expandAll = () => {
    // Expand all groups (projects)
    const newExpandedGroups: Record<string, boolean> = {};
    const groups = sidebar.projectGroups || [];
    groups.forEach((g) => {
      newExpandedGroups[g.id] = true;
    });
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
    <List
      sx={{
        padding: '16px',
        marginTop: '-30px',
        [theme.breakpoints.down('md')]: {
          padding: 0,
          marginTop: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          width: '100%',
          justifyContent: 'space-around',
        },
      }}
    >
      <ListItem
        disablePadding
        sx={{
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
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
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>
      <ListItem
        disablePadding
        sx={{
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
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
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>
      <ListItem
        disablePadding
        sx={{
          [theme.breakpoints.down('lg')]: {
            width: 'auto',
          },
        }}
      >
        <NavItem
          id="joyride-ask-ai"
          active={activeTab === TaskBar.AskAI}
          onClick={() => changeStatusTab(TaskBar.AskAI)}
        >
          <ListItemIcon>
            <AskAIIcon />
          </ListItemIcon>
          <ListItemText
            primary="Ask AI"
            primaryTypographyProps={{ fontWeight: 500 }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>
      <ListItem
        disablePadding
        sx={{
          [theme.breakpoints.down('lg')]: {
            width: 'auto',
          },
        }}
      >
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
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>

      {/* Collections Category Header */}
      {!isCollapsed && (
        <Box
          sx={{
            px: 2,
            mt: 2.5,
            mb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '10px',
              opacity: 0.6,
            }}
          >
            collections
          </Typography>
        </Box>
      )}

      <ListItem
        disablePadding
        sx={{
          flexDirection: 'column',
          alignItems: 'stretch',
          [theme.breakpoints.down('lg')]: {
            width: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
          },
        }}
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
            <ProjectIcon />
          </ListItemIcon>
          <ListItemText
            primary="Projects"
            primaryTypographyProps={{ fontWeight: 500 }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />

          <Box
            className="tab-hover-actions"
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'flex' },
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

          <Box
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'inline-flex' },
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (activeTab !== TaskBar.Workspace) {
                  handleProjectsTabClick();
                } else {
                  setIsProjectsExpanded((prev) => !prev);
                }
              }}
              sx={{
                p: 0.2,
                color: 'text.secondary',
                ml: activeTab === TaskBar.Workspace ? 0.5 : 'auto',
              }}
            >
              {isProjectsExpanded && activeTab === TaskBar.Workspace ? (
                <ExpandLess sx={{ fontSize: 16 }} />
              ) : (
                <ExpandMore sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Box>
        </NavItem>

        <Box
          sx={{
            display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            width: '100%',
          }}
        >
          <Collapse in={isProjectsExpanded && activeTab === TaskBar.Workspace}>
            <Box
              sx={{
                mt: 1,
                mb: 1,
                mx: 0.5,
                p: 1.5,
                borderRadius: '12px',
                maxHeight: '260px',
                overflowY: 'auto',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.03)',
                border: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.03)'
                    : '1px solid rgba(0, 0, 0, 0.04)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                    : 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <ProjectGroupsSection sidebar={sidebar} hideHeader />
            </Box>
          </Collapse>
        </Box>
      </ListItem>

      {/* Profile Tab - Mobile Only */}
      <ListItem
        disablePadding
        sx={{
          display: { xs: 'block', md: 'none' },
          width: 'auto',
        }}
      >
        <NavItem
          id="joyride-mobile-profile"
          active={activeTab === TaskBar.Settings}
          onClick={() => changeStatusTab(TaskBar.Settings)}
          sx={{
            justifyContent: 'center',
            p: '8px 12px',
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 'auto', display: 'flex', justifyContent: 'center' }}
          >
            <Avatar
              src={sidebar.user?.picture}
              alt={sidebar.user?.name}
              sx={{
                width: 24,
                height: 24,
                border: '1.5px solid',
                borderColor:
                  activeTab === TaskBar.Settings
                    ? theme.palette.primary.main
                    : 'transparent',
              }}
            >
              {sidebar.user?.name?.charAt(0)}
            </Avatar>
          </ListItemIcon>
        </NavItem>
      </ListItem>
    </List>
  );
};
