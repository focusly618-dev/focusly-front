import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  AutoAwesomeRounded as PlanIcon,
  CheckCircleRounded as DoneIcon,
  TimerOutlined as TimerIcon,
  CalendarMonthOutlined as CalendarIcon,
} from '@mui/icons-material';
import { isKnownLuminaAction, type ParsedLuminaAction } from '@/utils';
import { useActionPlan } from './useActionPlan.hook';
import { isDestructive } from './planModel';
import { formatMinutes, formatRange } from './planFormat';
import {
  DeleteNode,
  InsertNode,
  ProjectNode,
  SubtasksNode,
  TaskNode,
  UpdateNode,
  WorkspaceNode,
} from './components/PlanNodes';
import {
  EventDeleteNode,
  EventNode,
  EventUpdateNode,
} from './components/EventNodes';
import {
  BRAND,
  HeaderIcon,
  MetaChip,
  PlanBody,
  PlanCard,
  PlanFooter,
  PlanHeader,
  SectionLabel,
  SummaryRow,
} from './ActionPlan.styles';

interface ActionPlanProps {
  actions: ParsedLuminaAction[];
}

const CHANGE_TYPES = [
  'UPDATE_TASK',
  'UPDATE_SUBTASKS',
  'DELETE_TASK',
  'UPDATE_EVENT',
  'DELETE_EVENT',
];

/**
 * What Lumina proposes to create or change, as a reviewable tree: projects
 * with their documents and tasks, calendar events, changes as before →
 * after. The user picks what to run, can tweak titles and dates, and opens
 * what was created.
 */
export const ActionPlan = ({ actions: proposed }: ActionPlanProps) => {
  const { t, i18n } = useTranslation();
  // Models sometimes invent action types; only show what can actually run.
  const actions = useMemo(
    () => proposed.filter(isKnownLuminaAction),
    [proposed],
  );
  const plan = useActionPlan(actions);
  const { tree, summary } = plan;

  const selectedCount = plan.selected.size;
  const pendingSelected = actions.filter(
    (_, i) => plan.selected.has(i) && plan.statuses[i] !== 'done',
  ).length;
  const doneCount = plan.statuses.filter((s) => s === 'done').length;
  const onlyUpdates = actions.every((a) => CHANGE_TYPES.includes(a.type));
  const onlyDeletions = actions.every(isDestructive);
  const deletingSelected = plan.pendingDeletions > 0;
  // "tasks will be deleted", "events will be canceled", or both.
  const deletionTypes = new Set(
    actions
      .filter(
        (a, i) =>
          isDestructive(a) &&
          plan.selected.has(i) &&
          plan.statuses[i] !== 'done',
      )
      .map((a) => a.type),
  );
  const confirmKey =
    deletionTypes.size > 1
      ? 'actionPlan.delete.confirmMixed'
      : deletionTypes.has('DELETE_EVENT')
        ? 'actionPlan.delete.confirmEvents'
        : 'actionPlan.delete.confirm';

  if (actions.length === 0) return null;

  const subtitle = plan.isRunning
    ? t('actionPlan.header.running', { done: doneCount, total: selectedCount })
    : plan.isCompleted
      ? t('actionPlan.header.done')
      : plan.hasErrors
        ? t('actionPlan.header.someFailed')
        : t('actionPlan.header.review');

  return (
    <PlanCard role="group" aria-label={t('actionPlan.header.title')}>
      <PlanHeader>
        <HeaderIcon>
          {plan.isCompleted ? <DoneIcon /> : <PlanIcon />}
        </HeaderIcon>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}
          >
            {onlyUpdates
              ? t('actionPlan.header.changesTitle')
              : t('actionPlan.header.title')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
          <SummaryRow>
            {summary.projects > 0 && (
              <MetaChip accent={BRAND}>
                {t('actionPlan.summary.projects', { count: summary.projects })}
              </MetaChip>
            )}
            {summary.documents > 0 && (
              <MetaChip accent="#3B82F6">
                {t('actionPlan.summary.documents', {
                  count: summary.documents,
                })}
              </MetaChip>
            )}
            {summary.tasks > 0 && (
              <MetaChip accent={BRAND}>
                {t('actionPlan.summary.tasks', { count: summary.tasks })}
                {summary.subtasks > 0 &&
                  ` · ${t('actionPlan.summary.subtasks', { count: summary.subtasks })}`}
              </MetaChip>
            )}
            {summary.events > 0 && (
              <MetaChip accent="#4285F4">
                {t('actionPlan.summary.events', { count: summary.events })}
                {summary.guests > 0 &&
                  ` · ${t('actionPlan.summary.guests', { count: summary.guests })}`}
              </MetaChip>
            )}
            {summary.updates > 0 && (
              <MetaChip accent="#F59E0B">
                {t('actionPlan.summary.updates', { count: summary.updates })}
              </MetaChip>
            )}
            {summary.deletions > 0 && (
              <MetaChip accent="#EF4444">
                {t('actionPlan.summary.deletions', {
                  count: summary.deletions,
                })}
              </MetaChip>
            )}
            {summary.minutes > 0 && (
              <MetaChip>
                <TimerIcon />
                {formatMinutes(summary.minutes)}
              </MetaChip>
            )}
            {summary.firstDate && summary.lastDate && (
              <MetaChip>
                <CalendarIcon />
                {formatRange(
                  summary.firstDate,
                  summary.lastDate,
                  i18n.language,
                )}
              </MetaChip>
            )}
          </SummaryRow>
        </Box>
      </PlanHeader>

      {plan.isRunning && (
        <LinearProgress
          variant="determinate"
          value={selectedCount ? (doneCount / selectedCount) * 100 : 0}
          sx={{
            height: 3,
            '& .MuiLinearProgress-bar': { backgroundColor: BRAND },
          }}
        />
      )}

      <PlanBody>
        {tree.projects.map((project) => (
          <ProjectNode key={project.key} plan={plan} view={project} />
        ))}
        {tree.workspaces.map((ws) => (
          <WorkspaceNode key={ws.index} plan={plan} view={ws} />
        ))}
        {tree.tasks.length > 0 && tree.projects.length > 0 && (
          <SectionLabel>{t('actionPlan.sections.otherTasks')}</SectionLabel>
        )}
        {tree.tasks.map((task) => (
          <TaskNode key={task} plan={plan} index={task} />
        ))}
        {tree.events.length > 0 && tree.events.length < actions.length && (
          <SectionLabel>{t('actionPlan.sections.events')}</SectionLabel>
        )}
        {tree.events.map((index) => (
          <EventNode key={index} plan={plan} index={index} />
        ))}
        {tree.updates.length > 0 && !onlyUpdates && (
          <SectionLabel>{t('actionPlan.sections.updates')}</SectionLabel>
        )}
        {tree.updates.map((index) =>
          actions[index].type === 'UPDATE_SUBTASKS' ? (
            <SubtasksNode key={index} plan={plan} index={index} />
          ) : actions[index].type === 'UPDATE_EVENT' ? (
            <EventUpdateNode key={index} plan={plan} index={index} />
          ) : (
            <UpdateNode key={index} plan={plan} index={index} />
          ),
        )}
        {tree.deletions.length > 0 && !onlyDeletions && (
          <SectionLabel sx={{ color: 'error.main' }}>
            {t('actionPlan.sections.deletions')}
          </SectionLabel>
        )}
        {tree.deletions.map((index) =>
          actions[index].type === 'DELETE_EVENT' ? (
            <EventDeleteNode key={index} plan={plan} index={index} />
          ) : (
            <DeleteNode key={index} plan={plan} index={index} />
          ),
        )}
        {tree.inserts.map((index) => (
          <InsertNode key={index} plan={plan} index={index} />
        ))}
      </PlanBody>

      <PlanFooter>
        {plan.isCompleted ? (
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: BRAND,
              fontWeight: 650,
            }}
          >
            <DoneIcon sx={{ fontSize: 18 }} />
            {t('actionPlan.footer.done', { count: doneCount })}
          </Typography>
        ) : (
          <>
            {actions.length > 1 && !plan.isRunning && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button
                  size="small"
                  color="inherit"
                  onClick={plan.selectAll}
                  sx={{ px: 1, py: 0.25, minWidth: 0 }}
                >
                  {t('actionPlan.footer.selectAll')}
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={plan.selectNone}
                  sx={{ px: 1, py: 0.25, minWidth: 0 }}
                >
                  {t('actionPlan.footer.selectNone')}
                </Button>
              </Box>
            )}
            <Box sx={{ flex: 1 }} />
            {deletingSelected && !plan.isRunning && (
              <FormControlLabel
                sx={{
                  order: 10,
                  flexBasis: '100%',
                  m: 0,
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: (theme) => alpha(theme.palette.error.main, 0.35),
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.06),
                  '& .MuiFormControlLabel-label': { fontSize: '0.8rem' },
                }}
                control={
                  <Checkbox
                    size="small"
                    color="error"
                    checked={plan.destructiveConfirmed}
                    onChange={(e) =>
                      plan.setDestructiveConfirmed(e.target.checked)
                    }
                  />
                }
                label={t(confirmKey, { count: plan.pendingDeletions })}
              />
            )}
            {plan.hasErrors && !plan.isRunning && (
              <Typography variant="caption" color="error">
                {t('actionPlan.footer.errors')}
              </Typography>
            )}
            <Button
              variant="contained"
              size="small"
              color={deletingSelected ? 'error' : 'primary'}
              onClick={plan.run}
              disabled={
                plan.isRunning ||
                pendingSelected === 0 ||
                plan.needsConfirmation
              }
              startIcon={
                plan.isRunning ? (
                  <CircularProgress size={14} color="inherit" />
                ) : undefined
              }
              sx={{ px: 2, py: 0.75 }}
            >
              {plan.isRunning
                ? t('actionPlan.footer.running')
                : plan.hasErrors
                  ? t('actionPlan.footer.retry', { count: pendingSelected })
                  : onlyDeletions
                    ? t('actionPlan.footer.delete', { count: pendingSelected })
                    : onlyUpdates || deletingSelected
                      ? t('actionPlan.footer.apply', { count: pendingSelected })
                      : t('actionPlan.footer.create', {
                          count: pendingSelected,
                        })}
            </Button>
          </>
        )}
      </PlanFooter>
    </PlanCard>
  );
};
