import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CheckCircle as TasksIcon,
  BarChart as InsightsIcon,
} from '@mui/icons-material';
import { NavItem } from '../Sidebar.styles';
import { TaskBar } from '../types/Sidebar.types';
import { CuteRobotIcon } from '@/components/ui';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface SidebarNavigationProps {
  sidebar: UseSidebarReturn;
}

export const SidebarNavigation = ({ sidebar }: SidebarNavigationProps) => {
  const { activeTab, changeStatusTab, theme } = sidebar;

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
          id="joyride-workspace"
          active={activeTab === TaskBar.Workspace}
          onClick={() => changeStatusTab(TaskBar.Workspace)}
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
            primary="Workspace"
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
    </List>
  );
};
