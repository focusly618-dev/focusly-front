import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
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

interface SidebarNavigationProps {
  sidebar: UseSidebarReturn;
}

export const SidebarNavigation = ({ sidebar }: SidebarNavigationProps) => {
  const { activeTab, changeStatusTab, theme, isCollapsed } = sidebar;
  const handleProjectsTabClick = () => {
    // Reset search params to show all workspaces in the main component
    const newParams = new URLSearchParams();
    newParams.set('tab', TaskBar.Workspace);
    sidebar.setSearchParams(newParams);
    changeStatusTab(TaskBar.Workspace, newParams);
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
        </NavItem>
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
