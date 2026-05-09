import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import { useMemo } from 'react';
import {
  Dashboard as DashboardIcon,
  CheckCircle as TasksIcon,
  BarChart as InsightsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { NotificationCenter } from './components/NotificationCenter/NotificationCenter';
import {
  SidebarContainer,
  Logo,
  AddTaskButton,
  NavItem,
  EnergyCard,
} from './Sidebar.styles';
import { TaskBar, type SidebarProps } from './types/Sidebar.types';
import { useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'react-router-dom';
import { FocuslyLogo } from '@/components/ui';
import { useContext } from 'react';
import { ColorModeContext } from '@/context/ColorModeContext';

const Sidebar = ({ activeTab, changeStatusTab }: SidebarProps) => {
  const { tasks } = useAppSelector((state) => state.task);
  const colorMode = useContext(ColorModeContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const taskId = searchParams.get('taskId');
  const activeURLTask = useMemo(
    () => tasks.find((t) => t.id === taskId),
    [tasks, taskId],
  );

  return (
    <SidebarContainer>
      <Box paddingLeft={3} paddingRight={3}>
        <Logo
          id="joyride-logo"
          as="div"
          sx={{ justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FocuslyLogo size={30} />
            Focusly
          </Box>
          <NotificationCenter />
        </Logo>
      </Box>

      <AddTaskButton
        id="joyride-add-task"
        onClick={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('action', 'create');
          setSearchParams(newParams);
        }}
        startIcon={
          <AddIcon
            sx={{
              color: 'white',
              background: '#3b82f6',
              borderRadius: '10px',
            }}
          />
        }
        sx={{ py: 1, fontSize: '13px' }}
      >
        {activeURLTask ? activeURLTask.title : 'Add New Task'}
      </AddTaskButton>

      <List sx={{ padding: '16px' }}>
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
                {/* Custom Document Icon or similar */}
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
        <ListItem disablePadding>
          <NavItem
            id="joyride-settings"
            active={activeTab === TaskBar.Settings}
            onClick={() => changeStatusTab(TaskBar.Settings)}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </NavItem>
        </ListItem>
      </List>

      <Box flexGrow={1} />

      <EnergyCard id="joyride-energy">
        <Typography
          color="primary.main"
          fontWeight="700"
          fontSize="0.85rem"
          mb={1}
        >
          Afternoon Slump Predicted
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={2}
        >
          Your energy usually dips around 2 PM. Schedule light tasks.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            color: 'primary.main',
            borderColor: 'primary.main',
            textTransform: 'none',
            borderRadius: 2,
            fontSize: '0.75rem',
            py: 0.5,
          }}
        >
          Optimize Schedule
        </Button>
      </EnergyCard>

      <Box
        id="joyride-theme-toggle"
        onClick={colorMode.toggleColorMode}
        sx={{
          p: 1.5,
          borderRadius: 3,
          mx: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor:
              colorMode.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        {colorMode.mode === 'dark' ? (
          <LightModeIcon sx={{ color: '#fbbf24' }} />
        ) : (
          <DarkModeIcon sx={{ color: '#3b82f6' }} />
        )}
        <Typography variant="body2" fontWeight="600" color="text.secondary">
          {colorMode.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Typography>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
