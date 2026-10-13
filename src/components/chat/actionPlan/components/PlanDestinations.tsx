import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import {
  CalendarMonthOutlined as CalendarIcon,
  DescriptionOutlined as DocumentIcon,
  FolderOutlined as ProjectIcon,
  TaskAltOutlined as TasksIcon,
} from '@mui/icons-material';
import { GoButton } from '../ActionPlan.styles';
import { planDestinations } from '../planDestinations';
import type { PlanController } from '../useActionPlan.hook';
import { usePlanNavigation } from '../usePlanNavigation.hook';

/**
 * Once the plan ran: straight to what it made (the project, its tasks, the
 * document, the calendar on the day things were scheduled).
 */
export const PlanDestinations = ({ plan }: { plan: PlanController }) => {
  const { t } = useTranslation();
  const nav = usePlanNavigation();
  const where = planDestinations(plan.actions, plan.statuses, plan.createdIds);
  const { projectId, documentId, tasks, calendar } = where;

  const openTasks = () => {
    if (projectId) nav.openProjectTasks(projectId);
    else if (tasks.singleId) nav.openTask(tasks.singleId);
    else nav.openTasks();
  };

  const buttons = [
    projectId && (
      <GoButton key="project" onClick={() => nav.openProject(projectId)}>
        <ProjectIcon />
        {t('actionPlan.open.viewProject')}
      </GoButton>
    ),
    documentId && (
      <GoButton key="document" onClick={() => nav.openWorkspace(documentId)}>
        <DocumentIcon />
        {t('actionPlan.open.document')}
      </GoButton>
    ),
    tasks.count > 0 && (
      <GoButton key="tasks" onClick={openTasks}>
        <TasksIcon />
        {tasks.singleId && !projectId
          ? t('actionPlan.open.task')
          : t('actionPlan.open.tasks', { count: tasks.count })}
      </GoButton>
    ),
    calendar && (
      <GoButton
        key="calendar"
        onClick={() => nav.openCalendar(calendar.date, calendar.view)}
      >
        <CalendarIcon />
        {t('actionPlan.open.inCalendar')}
      </GoButton>
    ),
  ].filter(Boolean);

  if (buttons.length === 0) return null;
  return (
    <Box
      role="group"
      aria-label={t('actionPlan.open.goTo')}
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}
    >
      {buttons}
    </Box>
  );
};
