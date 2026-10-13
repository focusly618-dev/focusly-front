import { ListRowSkeleton } from '@/components/ui';
import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Collapse,
  Typography,
} from '@mui/material';
import { aiStreamService } from '@/services/aiStreamService';
import { calendarPlanService } from '@/services/calendarPlanService';
import { useTranslation } from 'react-i18next';
import {
  NavItem,
  SubNavItem,
  TreeSubNavItem,
  NavCountBadge,
  CategoryHeader,
} from '../Sidebar.styles';
import { TaskBar } from '../types/Sidebar.types';
import {
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import {
  CalendarTodayOutlined as DailyPlanIcon,
  CheckBoxOutlined as TasksIcon,
  MailOutline as InboxIcon,
  StarOutline as TodayIcon,
  KeyboardDoubleArrowRightRounded as UpcomingIcon,
  ElectricBoltOutlined as AskAIIcon,
  BarChartRounded as InsightsIcon,
  GridViewOutlined as ProjectIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowForwardRounded as ArrowForwardIcon,
} from '@mui/icons-material';
import type { UseSidebarReturn } from '../hooks/useSidebar';

interface TreeConnectorProps {
  isLast: boolean;
  isActive?: boolean;
}

const TreeConnector = ({ isLast, isActive }: TreeConnectorProps) => (
  <Box
    sx={{
      position: 'absolute',
      left: '19px',
      top: 0,
      bottom: 0,
      width: '14px',
      pointerEvents: 'none',
      zIndex: 1,
    }}
  >
    <Box
      className="tree-connector-elbow"
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '11px',
        height: '14px',
        borderLeft: (theme) =>
          `1.5px solid ${
            isActive
              ? theme.palette.mode === 'dark'
                ? '#2dd4bf'
                : '#008767'
              : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(0, 0, 0, 0.12)'
          }`,
        borderBottom: (theme) =>
          `1.5px solid ${
            isActive
              ? theme.palette.mode === 'dark'
                ? '#2dd4bf'
                : '#008767'
              : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(0, 0, 0, 0.12)'
          }`,
        borderBottomLeftRadius: '5px',
        transition: 'border-color 0.2s ease',
      }}
    />
    {!isLast && (
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: '14px',
          bottom: 0,
          borderLeft: (theme) =>
            `1.5px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(0, 0, 0, 0.12)'
            }`,
        }}
      />
    )}
  </Box>
);

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
    closeToggleCollapse,
    taskCounts,
    isTasksExpanded,
    toggleTasksExpanded,
    setIsTasksExpanded,
    isProjectsExpanded,
    toggleProjectsExpanded,
    setIsProjectsExpanded,
    projectGroups,
    projectGroupsLoading,
  } = sidebar;

  const currentTab = activeTab;
  const currentFilter = sidebar.searchParams.get('filter');
  const currentDateRange = sidebar.searchParams.get('dateRange');

  const isDailyPlanActive = currentTab === TaskBar.DailyPlan;
  // "Optimizar agenda" running, or its proposal waiting, from another tab.
  const calendarPlan = useSyncExternalStore(
    calendarPlanService.subscribe,
    calendarPlanService.getSnapshot,
  );
  const calendarPlanStatus = isDailyPlanActive
    ? null
    : calendarPlan.isPlanning
      ? 'planning'
      : calendarPlan.drafts.length > 0
        ? 'ready'
        : null;
  const isTasksActive =
    currentTab === TaskBar.Tasks && !currentFilter && !currentDateRange;
  const isInboxActive =
    currentTab === TaskBar.Tasks && currentFilter === 'inbox';
  const isTodayActive =
    currentTab === TaskBar.Tasks &&
    (currentFilter === 'today' || currentDateRange === 'today');
  const isUpcomingActive =
    currentTab === TaskBar.Tasks &&
    (currentFilter === 'upcoming' ||
      currentDateRange === 'this_week' ||
      currentDateRange === 'upcoming');
  const isAskAIActive = currentTab === TaskBar.AskAI;
  const isInsightsActive = currentTab === TaskBar.Insights;

  const [isAIGenerating, setIsAIGenerating] = useState(() =>
    aiStreamService.isGenerating(),
  );

  useEffect(() => {
    const unsub = aiStreamService.subscribe(() => {
      setIsAIGenerating(aiStreamService.isGenerating());
    });
    return unsub;
  }, []);
  const isProjectsActive =
    currentTab === TaskBar.Workspace &&
    !sidebar.searchParams.get('modal') &&
    !sidebar.searchParams.get('groupId');

  const MAX_RECENT_PROJECTS = 8;
  const recentProjects = projectGroups.slice(0, MAX_RECENT_PROJECTS);
  const hasMoreProjects = projectGroups.length > MAX_RECENT_PROJECTS;

  const handleProjectsTabClick = () => {
    if (isCollapsed) {
      closeToggleCollapse();
      setIsProjectsExpanded(true);
    }
    const newParams = new URLSearchParams();
    newParams.set('tab', TaskBar.Workspace);
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
          <ListItemIcon sx={{ position: 'relative' }}>
            <DailyPlanIcon />
            {calendarPlanStatus && (
              <Box
                role="status"
                aria-label={t(
                  calendarPlanStatus === 'planning'
                    ? 'calendar.organizingBackdrop'
                    : 'calendar.draftReadyTitle',
                )}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  boxShadow: (theme) => `0 0 8px ${theme.palette.primary.main}`,
                  ...(calendarPlanStatus === 'planning' && {
                    animation: 'calendarPlanPulse 1.5s infinite ease-in-out',
                    '@keyframes calendarPlanPulse': {
                      '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                      '50%': { transform: 'scale(1.4)', opacity: 0.6 },
                    },
                  }),
                }}
              />
            )}
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
            if (isCollapsed) {
              closeToggleCollapse();
              setIsTasksExpanded(true);
            }
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
                    transform: isTasksExpanded
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
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
                  newParams.set('filter', 'today');
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
                  newParams.set('filter', 'upcoming');
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
      {!isCollapsed && <CategoryHeader>{t('nav.intelligence')}</CategoryHeader>}

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
          <ListItemIcon sx={{ position: 'relative' }}>
            <AskAIIcon />
            {isAIGenerating && !isAskAIActive && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: '#a855f7',
                  boxShadow: '0 0 8px #a855f7',
                  animation: 'askAiNavPulse 1.5s infinite ease-in-out',
                  '@keyframes askAiNavPulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.4)', opacity: 0.6 },
                  },
                }}
              />
            )}
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
      {!isCollapsed && <CategoryHeader>{t('nav.workspace')}</CategoryHeader>}

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
              fontWeight: isProjectsActive ? 600 : 500,
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
                maxHeight: '10px',
              }}
            >
              {projectGroups.length > 0 && (
                <NavCountBadge active={isProjectsActive}>
                  {projectGroups.length}
                </NavCountBadge>
              )}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProjectsExpanded(e);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: '2px',
                  borderRadius: '4px',
                  color: isProjectsActive ? '#ffffff' : 'text.secondary',
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    bgcolor: isProjectsActive
                      ? 'rgba(255,255,255,0.2)'
                      : 'action.hover',
                  },
                }}
              >
                <ExpandMoreIcon
                  sx={{
                    fontSize: 14,
                    transform: isProjectsExpanded
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                    transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </Box>
            </Box>
          )}
        </NavItem>

        {/* Sub-items: Projects Tree List */}
        {!isCollapsed && (
          <Collapse
            in={isProjectsExpanded}
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
                position: 'relative',
              }}
            >
              {projectGroupsLoading ? (
                <Box sx={{ pl: '34px', pr: '10px' }}>
                  <ListRowSkeleton
                    rows={3}
                    leading="square"
                    lines={1}
                    dense
                    label={t('projects.loading')}
                  />
                </Box>
              ) : projectGroups.length === 0 ? (
                <Box
                  sx={{
                    position: 'relative',
                    pl: '34px',
                    pr: '10px',
                    py: '6px',
                  }}
                >
                  <TreeConnector isLast={true} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '11px',
                      color: 'text.disabled',
                      fontStyle: 'italic',
                    }}
                  >
                    {t('nav.noProjectsYet', 'Sin proyectos aún')}
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Tree Header / Indicator */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      pl: '34px',
                      pr: '10px',
                      pt: '4px',
                      pb: '3px',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '19px',
                        top: 0,
                        bottom: 0,
                        borderLeft: (theme) =>
                          `1.5px solid ${
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.14)'
                              : 'rgba(0, 0, 0, 0.12)'
                          }`,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color:
                          theme.palette.mode === 'dark' ? '#717684' : '#9CA3AF',
                        lineHeight: 1,
                      }}
                    >
                      {t('nav.recentProjects', 'Recientes')}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        color:
                          theme.palette.mode === 'dark' ? '#525866' : '#9CA3AF',
                        lineHeight: 1,
                      }}
                    >
                      {recentProjects.length}
                      {hasMoreProjects ? ` / ${projectGroups.length}` : ''}
                    </Typography>
                  </Box>

                  {/* 8 Most Recent Projects */}
                  {recentProjects.map((group, index) => {
                    const isGroupActive =
                      currentTab === TaskBar.Workspace &&
                      sidebar.searchParams.get('groupId') === group.id;
                    const noteCount =
                      group.workspaces?.length ??
                      group.generalWorkspaces?.length ??
                      0;
                    const isLast =
                      !hasMoreProjects && index === recentProjects.length - 1;

                    return (
                      <TreeSubNavItem
                        key={group.id}
                        active={isGroupActive}
                        onClick={() => {
                          const newParams = new URLSearchParams();
                          newParams.set('tab', TaskBar.Workspace);
                          newParams.set('groupId', group.id);
                          sidebar.setSearchParams(newParams);
                          changeStatusTab(TaskBar.Workspace, newParams);
                        }}
                      >
                        <TreeConnector
                          isLast={isLast}
                          isActive={isGroupActive}
                        />
                        <ListItemIcon
                          sx={{
                            minWidth: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isCustomEmoji(group.emoji) ? (
                            <Box
                              component="span"
                              sx={{
                                fontSize: '13px',
                                lineHeight: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {group.emoji}
                            </Box>
                          ) : group.emoji === 'outlined' ? (
                            <ModernFolderOutlinedIcon
                              sx={{
                                fontSize: 14,
                                color:
                                  group.color ||
                                  (theme.palette.mode === 'dark'
                                    ? '#a78bfa'
                                    : '#7c3aed'),
                              }}
                            />
                          ) : (
                            <ModernFolderFilledIcon
                              sx={{
                                fontSize: 14,
                                color:
                                  group.color ||
                                  (theme.palette.mode === 'dark'
                                    ? '#a78bfa'
                                    : '#7c3aed'),
                              }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={group.name}
                          primaryTypographyProps={{
                            fontSize: '11.5px',
                            fontWeight: isGroupActive ? 600 : 500,
                            noWrap: true,
                            textOverflow: 'ellipsis',
                          }}
                        />
                        {noteCount > 0 && (
                          <NavCountBadge active={isGroupActive}>
                            {noteCount}
                          </NavCountBadge>
                        )}
                      </TreeSubNavItem>
                    );
                  })}

                  {/* Terminal Node: View all projects if > 8 */}
                  {hasMoreProjects && (
                    <TreeSubNavItem
                      key="view-all-projects"
                      active={
                        currentTab === TaskBar.Workspace &&
                        !sidebar.searchParams.get('groupId') &&
                        !sidebar.searchParams.get('modal')
                      }
                      onClick={() => {
                        const newParams = new URLSearchParams();
                        newParams.set('tab', TaskBar.Workspace);
                        sidebar.setSearchParams(newParams);
                        changeStatusTab(TaskBar.Workspace, newParams);
                      }}
                      sx={{
                        opacity: 0.85,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <TreeConnector isLast={true} />
                      <ListItemIcon
                        sx={{
                          minWidth: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ArrowForwardIcon
                          sx={{
                            fontSize: 13,
                            color:
                              theme.palette.mode === 'dark'
                                ? '#a78bfa'
                                : '#7c3aed',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={t(
                          'nav.viewAllProjects',
                          'Ver todos ({{count}})',
                          { count: projectGroups.length },
                        )}
                        primaryTypographyProps={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'text.secondary',
                          noWrap: true,
                        }}
                      />
                    </TreeSubNavItem>
                  )}
                </>
              )}
            </Box>
          </Collapse>
        )}
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
          onClick={sidebar.openProfile}
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
                borderColor: 'transparent',
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
