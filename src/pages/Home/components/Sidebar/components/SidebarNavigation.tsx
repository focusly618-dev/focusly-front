import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Collapse,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  NavItem,
  SubNavItem,
  NavCountBadge,
  CategoryHeader,
} from '../Sidebar.styles';
import { TaskBar } from '../types/Sidebar.types';
import {
  DailyPlanIcon,
  TasksIcon,
  AskAIIcon,
  InsightsIcon,
  ProjectIcon,
} from '@/components/ui';
import {
  DescriptionOutlined as TemplateIcon,
  InboxOutlined as InboxIcon,
  TodayOutlined as TodayIcon,
  CalendarMonthOutlined as UpcomingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface SidebarNavigationProps {
  sidebar: UseSidebarReturn;
}

export const SidebarNavigation = ({ sidebar }: SidebarNavigationProps) => {
  const { t } = useTranslation();
  const {
    activeTab,
    changeStatusTab,
    theme,
    isCollapsed,
    taskCounts,
    isTasksExpanded,
    toggleTasksExpanded,
  } = sidebar;

  const currentTab = activeTab;
  const currentFilter = sidebar.searchParams.get('filter');
  const currentDateRange = sidebar.searchParams.get('dateRange');

  const isDailyPlanActive = currentTab === TaskBar.DailyPlan;
  const isTasksActive =
    currentTab === TaskBar.Tasks && !currentFilter && !currentDateRange;
  const isInboxActive =
    currentTab === TaskBar.Tasks && currentFilter === 'inbox';
  const isTodayActive =
    currentTab === TaskBar.Tasks && currentDateRange === 'today';
  const isUpcomingActive =
    currentTab === TaskBar.Tasks &&
    (currentDateRange === 'this_week' || currentDateRange === 'upcoming');
  const isAskAIActive = currentTab === TaskBar.AskAI;
  const isInsightsActive = currentTab === TaskBar.Insights;
  const isProjectsActive =
    currentTab === TaskBar.Workspace && !sidebar.searchParams.get('modal');
  const isTemplatesActive =
    currentTab === TaskBar.Workspace &&
    sidebar.searchParams.get('modal') === 'templates';

  const handleProjectsTabClick = () => {
    const newParams = new URLSearchParams();
    newParams.set('tab', TaskBar.Workspace);
    sidebar.setSearchParams(newParams);
    changeStatusTab(TaskBar.Workspace, newParams);
  };

  const handleTemplatesTabClick = () => {
    const newParams = new URLSearchParams();
    newParams.set('tab', TaskBar.Workspace);
    newParams.set('modal', 'templates');
    sidebar.setSearchParams(newParams);
    changeStatusTab(TaskBar.Workspace, newParams);
  };

  return (
    <List
      sx={{
        padding: '4px 6px',
        marginTop: 0,
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
      {/* ── AGENDA CATEGORY ── */}
      {!isCollapsed && (
        <CategoryHeader sx={{ mt: 0.5 }}>{t('nav.agenda')}</CategoryHeader>
      )}

      {/* Daily Plan */}
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
          active={isDailyPlanActive}
          onClick={() => changeStatusTab(TaskBar.DailyPlan)}
        >
          <ListItemIcon>
            <DailyPlanIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('nav.dailyPlan')}
            primaryTypographyProps={{
              fontSize: '12.5px',
              fontWeight: isDailyPlanActive ? 600 : 500,
            }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>

      {/* Tasks & GTD Sub-Items */}
      <ListItem
        disablePadding
        sx={{
          flexDirection: 'column',
          alignItems: 'stretch',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
        <NavItem
          id="joyride-tasks"
          active={isTasksActive}
          onClick={() => {
            const newParams = new URLSearchParams();
            newParams.set('tab', TaskBar.Tasks);
            sidebar.setSearchParams(newParams);
            changeStatusTab(TaskBar.Tasks, newParams);
          }}
        >
          <ListItemIcon>
            <TasksIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('nav.tasks')}
            primaryTypographyProps={{
              fontSize: '12.5px',
              fontWeight: isTasksActive ? 600 : 500,
            }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
          {!isCollapsed && (
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                ml: 'auto',
              }}
            >
              {taskCounts.total > 0 && (
                <NavCountBadge active={isTasksActive}>
                  {taskCounts.total}
                </NavCountBadge>
              )}
              <Box
                onClick={toggleTasksExpanded}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: '2px',
                  borderRadius: '4px',
                  color: isTasksActive ? '#ffffff' : 'text.secondary',
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    bgcolor: isTasksActive
                      ? 'rgba(255,255,255,0.2)'
                      : 'action.hover',
                  },
                }}
              >
                <ExpandMoreIcon
                  sx={{
                    fontSize: 14,
                    transform: isTasksExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </Box>
            </Box>
          )}
        </NavItem>

        {/* Sub-items: Inbox, Today, Upcoming */}
        {!isCollapsed && (
          <Collapse
            in={isTasksExpanded}
            timeout={220}
            unmountOnExit
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '1px',
                mb: '2px',
              }}
            >
              {/* Inbox */}
              <SubNavItem
                active={isInboxActive}
                onClick={() => {
                  const newParams = new URLSearchParams();
                  newParams.set('tab', TaskBar.Tasks);
                  newParams.set('filter', 'inbox');
                  sidebar.setSearchParams(newParams);
                  changeStatusTab(TaskBar.Tasks, newParams);
                }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.inbox')}
                  primaryTypographyProps={{
                    fontSize: '11.5px',
                    fontWeight: isInboxActive ? 600 : 500,
                  }}
                />
                {taskCounts.inbox > 0 && (
                  <NavCountBadge active={isInboxActive}>
                    {taskCounts.inbox}
                  </NavCountBadge>
                )}
              </SubNavItem>

              {/* Today */}
              <SubNavItem
                active={isTodayActive}
                onClick={() => {
                  const newParams = new URLSearchParams();
                  newParams.set('tab', TaskBar.Tasks);
                  newParams.set('dateRange', 'today');
                  sidebar.setSearchParams(newParams);
                  changeStatusTab(TaskBar.Tasks, newParams);
                }}
              >
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.today')}
                  primaryTypographyProps={{
                    fontSize: '11.5px',
                    fontWeight: isTodayActive ? 600 : 500,
                  }}
                />
                {taskCounts.today > 0 && (
                  <NavCountBadge active={isTodayActive}>
                    {taskCounts.today}
                  </NavCountBadge>
                )}
              </SubNavItem>

              {/* Upcoming */}
              <SubNavItem
                active={isUpcomingActive}
                onClick={() => {
                  const newParams = new URLSearchParams();
                  newParams.set('tab', TaskBar.Tasks);
                  newParams.set('dateRange', 'this_week');
                  sidebar.setSearchParams(newParams);
                  changeStatusTab(TaskBar.Tasks, newParams);
                }}
              >
                <ListItemIcon>
                  <UpcomingIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('nav.upcoming')}
                  primaryTypographyProps={{
                    fontSize: '11.5px',
                    fontWeight: isUpcomingActive ? 600 : 500,
                  }}
                />
                {taskCounts.upcoming > 0 && (
                  <NavCountBadge active={isUpcomingActive}>
                    {taskCounts.upcoming}
                  </NavCountBadge>
                )}
              </SubNavItem>
            </Box>
          </Collapse>
        )}
      </ListItem>

      {/* ── INTELLIGENCE CATEGORY ── */}
      {!isCollapsed && (
        <CategoryHeader>{t('nav.intelligence')}</CategoryHeader>
      )}

      {/* Ask AI */}
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
          active={isAskAIActive}
          onClick={() => changeStatusTab(TaskBar.AskAI)}
        >
          <ListItemIcon>
            <AskAIIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('nav.askAi')}
            primaryTypographyProps={{
              fontSize: '12.5px',
              fontWeight: isAskAIActive ? 600 : 500,
            }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>

      {/* Insights */}
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
          active={isInsightsActive}
          onClick={() => changeStatusTab(TaskBar.Insights)}
        >
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('nav.insights')}
            primaryTypographyProps={{
              fontSize: '12.5px',
              fontWeight: isInsightsActive ? 600 : 500,
            }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
      </ListItem>

      {/* ── WORKSPACE CATEGORY ── */}
      {!isCollapsed && (
        <CategoryHeader>{t('nav.workspace')}</CategoryHeader>
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
          active={isProjectsActive}
          onClick={handleProjectsTabClick}
        >
          <ListItemIcon>
            <ProjectIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('nav.projects')}
            primaryTypographyProps={{
              fontSize: '12.5px',
              fontWeight: 500,
            }}
            sx={{
              display: isCollapsed ? 'none' : { xs: 'none', lg: 'block' },
            }}
          />
        </NavItem>
        <NavItem
          id="joyride-templates"
          active={isTemplatesActive}
          onClick={handleTemplatesTabClick}
        >
          <ListItemIcon>
            <TemplateIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('nav.templates')}
            primaryTypographyProps={{
              fontSize: '12.5px',
              fontWeight: 500,
            }}
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
