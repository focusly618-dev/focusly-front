import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import {
  CalendarMonthOutlined as CalendarIcon,
  TimerOutlined as TimerIcon,
  ChecklistRounded as SubtasksIcon,
  DescriptionOutlined as DocumentIcon,
  TaskAltRounded as TaskIcon,
  EventRepeatRounded as UpdateIcon,
  NoteAddOutlined as InsertIcon,
  DeleteOutline as DeleteIcon,
  NotesRounded as NotesIcon,
  RadioButtonUnchecked as SubtaskIcon,
  FolderOutlined as FolderIcon,
} from '@mui/icons-material';
import { ReplyMarkdown } from '@/components/chat/ReplyMarkdown';
import type { Task } from '@/redux/tasks/task.types';
import type { LuminaActionPayload } from '@/utils';
import {
  PRIORITY_COLORS,
  normalizeEstimateTimer,
  parseDeadline,
} from '../actionExecution';
import {
  documentContent,
  documentOutline,
  taskMinutes,
  wordCount,
  type ProjectView,
  type WorkspaceView,
} from '../planModel';
import {
  formatMinutes,
  formatSlot,
  formatWhen,
  toDateTimeInput,
} from '../planFormat';
import { missingSubtaskTitles } from '../subtaskOps';
import type { PlanController } from '../useActionPlan.hook';
import {
  usePlanNavigation,
  useWorkspaceTitleLookup,
} from '../usePlanNavigation.hook';
import {
  BRAND,
  Branch,
  DetailLabel,
  LinkButton,
  MarkdownBox,
  MetaChip,
} from '../ActionPlan.styles';
import { PlanItem } from './PlanItem';
import { ChangeList, type Change } from './ChangeList';
import { itemState, type NodeProps } from './nodeState';

const PriorityChip = ({ level }: { level: number }) => {
  const { t } = useTranslation();
  const color = PRIORITY_COLORS[level] ?? PRIORITY_COLORS[2];
  return (
    <MetaChip accent={color}>
      <Box
        component="span"
        sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }}
      />
      {t(`actionPlan.priority.${level in PRIORITY_COLORS ? level : 2}`)}
    </MetaChip>
  );
};

/* ── Task ─────────────────────────────────────────────────────────────── */

export const TaskNode = ({ plan, index }: NodeProps & { index: number }) => {
  const { t, i18n } = useTranslation();
  const nav = usePlanNavigation();
  const workspaceTitle = useWorkspaceTitleLookup();
  const action = plan.effectiveAction(index);
  const { payload } = action;
  const minutes = taskMinutes(action);
  const start = parseDeadline(payload.deadline);
  const subtasks = payload.subtasks ?? [];
  const linkedDoc =
    payload.workspace_id && !payload.workspace_ref
      ? workspaceTitle(payload.workspace_id)
      : null;
  const createdId = plan.createdIds[index];

  const subtaskMinutes = subtasks.reduce(
    (sum, s) =>
      sum +
      (typeof s === 'object' && s.estimate_timer
        ? normalizeEstimateTimer(s.estimate_timer)
        : 0),
    0,
  );

  return (
    <PlanItem
      {...itemState(plan, index)}
      icon={<TaskIcon />}
      iconColor={BRAND}
      title={payload.title || t('actionPlan.untitledTask')}
      meta={
        <>
          {start && (
            <MetaChip>
              <CalendarIcon />
              {formatSlot(start, minutes, i18n.language)}
            </MetaChip>
          )}
          <MetaChip>
            <TimerIcon />
            {formatMinutes(minutes)}
          </MetaChip>
          <PriorityChip level={payload.priority_level ?? 2} />
          {subtasks.length > 0 && (
            <MetaChip>
              <SubtasksIcon />
              {t('actionPlan.task.subtaskCount', { count: subtasks.length })}
            </MetaChip>
          )}
          {linkedDoc && (
            <MetaChip accent={BRAND}>
              <DocumentIcon />
              {linkedDoc}
            </MetaChip>
          )}
        </>
      }
      details={
        subtasks.length > 0 || payload.notes ? (
          <>
            {subtasks.length > 0 && (
              <Box>
                <DetailLabel>
                  {t('actionPlan.task.subtasks')}
                  {subtaskMinutes > 0 && ` · ${formatMinutes(subtaskMinutes)}`}
                </DetailLabel>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {subtasks.map((s, i) => {
                    const title = typeof s === 'string' ? s : s.title;
                    const timer =
                      typeof s === 'object' && s.estimate_timer
                        ? normalizeEstimateTimer(s.estimate_timer)
                        : null;
                    return (
                      <Box
                        component="li"
                        key={`${title}-${i}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 0.35,
                          fontSize: '0.82rem',
                        }}
                      >
                        <SubtaskIcon
                          sx={{ fontSize: 14, color: 'text.disabled' }}
                        />
                        <Box component="span" sx={{ flex: 1 }}>
                          {title}
                        </Box>
                        {timer && (
                          <Typography variant="caption" color="text.secondary">
                            {formatMinutes(timer)}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
            {payload.notes && (
              <Box>
                <DetailLabel>
                  <NotesIcon
                    sx={{ fontSize: 13, verticalAlign: '-2px', mr: 0.5 }}
                  />
                  {t('actionPlan.task.notes')}
                </DetailLabel>
                <MarkdownBox>
                  <ReplyMarkdown>
                    {payload.notes.replace(/\s*\[COLOR:[^\]]*\]\s*/g, ' ')}
                  </ReplyMarkdown>
                </MarkdownBox>
              </Box>
            )}
          </>
        ) : undefined
      }
      editFields={[
        {
          key: 'title',
          label: t('actionPlan.edit.title'),
          type: 'text',
          value: payload.title || '',
        },
        {
          key: 'deadline',
          label: t('actionPlan.edit.start'),
          type: 'datetime-local',
          value: toDateTimeInput(start),
        },
      ]}
      onSaveEdit={(values) =>
        plan.editItem(index, {
          title: values.title.trim() || payload.title,
          deadline: values.deadline || payload.deadline,
        })
      }
      openLabel={t('actionPlan.open.task')}
      onOpen={createdId ? () => nav.openTask(createdId) : undefined}
    />
  );
};

/* ── Document ─────────────────────────────────────────────────────────── */

export const WorkspaceNode = ({
  plan,
  view,
}: NodeProps & { view: WorkspaceView }) => {
  const { t } = useTranslation();
  const nav = usePlanNavigation();
  const [showFull, setShowFull] = useState(false);
  const action = plan.effectiveAction(view.index);
  const content = documentContent(action);
  const outline = documentOutline(content).filter((h) => h.level > 1);
  const words = wordCount(content);
  const createdId = plan.createdIds[view.index];
  const isNote = action.type === 'CREATE_NOTE';

  return (
    <PlanItem
      {...itemState(plan, view.index)}
      icon={<DocumentIcon />}
      iconColor="#3B82F6"
      title={
        action.payload.title ||
        t(isNote ? 'actionPlan.untitledNote' : 'actionPlan.untitledDocument')
      }
      meta={
        <>
          <MetaChip accent="#3B82F6">
            {t(
              isNote ? 'actionPlan.document.note' : 'actionPlan.document.label',
            )}
          </MetaChip>
          {outline.length > 0 && (
            <MetaChip>
              {t('actionPlan.document.sections', { count: outline.length })}
            </MetaChip>
          )}
          {words > 0 && (
            <MetaChip>
              {t('actionPlan.document.words', { count: words })}
            </MetaChip>
          )}
          {view.tasks.length > 0 && (
            <MetaChip>
              {t('actionPlan.document.linkedTasks', {
                count: view.tasks.length,
              })}
            </MetaChip>
          )}
        </>
      }
      details={
        content ? (
          <>
            {outline.length > 0 && (
              <Box>
                <DetailLabel>{t('actionPlan.document.outline')}</DetailLabel>
                <Box component="ul" sx={{ m: 0, pl: 2, listStyle: 'disc' }}>
                  {outline.map((h, i) => (
                    <Typography
                      component="li"
                      key={`${h.text}-${i}`}
                      sx={{
                        fontSize: '0.82rem',
                        ml: (h.level - 2) * 1.5,
                        py: 0.15,
                      }}
                    >
                      {h.text}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            <LinkButton
              onClick={() => setShowFull((v) => !v)}
              sx={{ ml: -0.75 }}
            >
              <DocumentIcon />
              {showFull
                ? t('actionPlan.document.hideContent')
                : t('actionPlan.document.showContent')}
            </LinkButton>
            {showFull && (
              <MarkdownBox>
                <ReplyMarkdown>{content}</ReplyMarkdown>
              </MarkdownBox>
            )}
          </>
        ) : undefined
      }
      editFields={[
        {
          key: 'title',
          label: t('actionPlan.edit.title'),
          type: 'text',
          value: action.payload.title || '',
        },
      ]}
      onSaveEdit={(values) =>
        plan.editItem(view.index, {
          title: values.title.trim() || action.payload.title,
        })
      }
      openLabel={t('actionPlan.open.document')}
      onOpen={createdId ? () => nav.openWorkspace(createdId) : undefined}
    >
      {view.tasks.length > 0 && (
        <Branch sx={{ mt: 0.5 }}>
          {view.tasks.map((task) => (
            <TaskNode key={task} plan={plan} index={task} />
          ))}
        </Branch>
      )}
    </PlanItem>
  );
};

/* ── Project ──────────────────────────────────────────────────────────── */

export const ProjectNode = ({
  plan,
  view,
}: NodeProps & { view: ProjectView }) => {
  const { t } = useTranslation();
  const nav = usePlanNavigation();
  const action = view.index !== null ? plan.effectiveAction(view.index) : null;
  const name =
    action?.payload.name ||
    view.name ||
    t('actionPlan.project.existingFallback');
  const createdId = view.index !== null ? plan.createdIds[view.index] : null;
  const projectId =
    createdId || (view.key.startsWith('id:') ? view.key.slice(3) : null);
  const taskCount =
    view.tasks.length +
    view.workspaces.reduce((sum, ws) => sum + ws.tasks.length, 0);

  return (
    <PlanItem
      {...(view.index !== null && view.isNew
        ? itemState(plan, view.index)
        : {
            index: null,
            status: view.index !== null ? plan.statuses[view.index] : 'pending',
          })}
      tone="project"
      icon={view.emoji ? <span aria-hidden>{view.emoji}</span> : <FolderIcon />}
      iconColor={view.color || BRAND}
      title={name}
      meta={
        <>
          <MetaChip accent={BRAND}>
            {view.isNew
              ? t('actionPlan.project.new')
              : t('actionPlan.project.existing')}
          </MetaChip>
          {view.workspaces.length > 0 && (
            <MetaChip>
              {t('actionPlan.project.documents', {
                count: view.workspaces.length,
              })}
            </MetaChip>
          )}
          {taskCount > 0 && (
            <MetaChip>
              {t('actionPlan.project.tasks', { count: taskCount })}
            </MetaChip>
          )}
        </>
      }
      editFields={
        view.isNew && view.index !== null
          ? [
              {
                key: 'name',
                label: t('actionPlan.edit.name'),
                type: 'text',
                value: name,
              },
            ]
          : undefined
      }
      onSaveEdit={(values) =>
        view.index !== null &&
        plan.editItem(view.index, { name: values.name.trim() || name })
      }
      openLabel={t('actionPlan.open.project')}
      onOpen={projectId ? () => nav.openProject(projectId) : undefined}
    >
      {(view.workspaces.length > 0 || view.tasks.length > 0) && (
        <Branch sx={{ mt: 0.5 }}>
          {view.workspaces.map((ws) => (
            <WorkspaceNode key={ws.index} plan={plan} view={ws} />
          ))}
          {view.tasks.map((task) => (
            <TaskNode key={task} plan={plan} index={task} />
          ))}
        </Branch>
      )}
    </PlanItem>
  );
};

/* ── Change to an existing task ───────────────────────────────────────── */

const STATUS_KEYS: Record<string, string> = {
  Todo: 'todo',
  Planning: 'planning',
  Pending: 'pending',
  'On Hold': 'onHold',
  Review: 'review',
  Done: 'done',
  Backlog: 'backlog',
  Scheduled: 'scheduled',
  Archived: 'archived',
};

const statusLabel = (
  status: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
) =>
  STATUS_KEYS[status]
    ? t(`actionPlan.taskStatus.${STATUS_KEYS[status]}`)
    : status;

/** Names for documents and projects, existing or created in this plan. */
interface NameLookups {
  workspace: (id?: string | null, ref?: string) => string | null;
  project: (id?: string | null, ref?: string) => string | null;
}

const useNameLookups = (plan: PlanController): NameLookups => {
  const workspaceTitle = useWorkspaceTitleLookup();
  const fromPlan = (
    type: string[],
    ref: string | undefined,
    key: 'title' | 'name',
  ) => {
    if (!ref) return null;
    const action = plan.actions.find(
      (a) => type.includes(a.type) && a.payload.ref === ref,
    );
    return (action?.payload[key] as string | undefined) ?? null;
  };
  return {
    workspace: (id, ref) =>
      fromPlan(['CREATE_WORKSPACE', 'CREATE_NOTE'], ref, 'title') ??
      (id ? workspaceTitle(id) : null),
    project: (id, ref) =>
      fromPlan(['CREATE_PROJECT_GROUP'], ref, 'name') ??
      (id
        ? (plan.existingProjects.find((p) => p.id === id)?.name ?? null)
        : null),
  };
};

const taskChanges = (
  payload: LuminaActionPayload,
  task: Task | undefined,
  t: (key: string, opts?: Record<string, unknown>) => string,
  locale: string,
  names: NameLookups,
): Change[] => {
  const changes: Change[] = [];
  if (payload.status && payload.status !== task?.status) {
    changes.push({
      label: t('actionPlan.fields.status'),
      before: task?.status ? statusLabel(task.status, t) : null,
      after: statusLabel(payload.status, t),
    });
  }
  if (payload.workspace_id || payload.workspace_ref) {
    changes.push({
      label: t('actionPlan.fields.document'),
      before: task?.workspace_id ? names.workspace(task.workspace_id) : null,
      after:
        names.workspace(payload.workspace_id, payload.workspace_ref) ??
        t('actionPlan.update.aDocument'),
    });
  }
  if (payload.project_group_id || payload.project_ref) {
    changes.push({
      label: t('actionPlan.fields.project'),
      before: task?.project_id ? names.project(task.project_id) : null,
      after:
        names.project(payload.project_group_id, payload.project_ref) ??
        t('actionPlan.update.aProject'),
    });
  }
  const when = (value?: string | null) => {
    const date = parseDeadline(value ?? undefined);
    return date ? formatWhen(date, locale) : null;
  };
  if (payload.title && payload.title !== task?.title) {
    changes.push({
      label: t('actionPlan.fields.title'),
      before: task?.title ?? null,
      after: payload.title,
    });
  }
  const newStart = payload.estimated_start_date || payload.deadline;
  if (newStart) {
    changes.push({
      label: t('actionPlan.fields.start'),
      before: when(task?.estimated_start_date || task?.deadline),
      after: when(newStart) ?? newStart,
    });
  }
  if (payload.estimated_end_date) {
    changes.push({
      label: t('actionPlan.fields.end'),
      before: when(task?.estimated_end_date),
      after: when(payload.estimated_end_date) ?? payload.estimated_end_date,
    });
  }
  if (
    payload.priority_level != null &&
    payload.priority_level !== task?.priority_level
  ) {
    changes.push({
      label: t('actionPlan.fields.priority'),
      before:
        task?.priority_level != null
          ? t(`actionPlan.priority.${task.priority_level}`)
          : null,
      after: t(`actionPlan.priority.${payload.priority_level}`),
    });
  }
  if (payload.estimate_timer != null) {
    changes.push({
      label: t('actionPlan.fields.duration'),
      before: task?.estimate_timer ? formatMinutes(task.estimate_timer) : null,
      after: formatMinutes(
        normalizeEstimateTimer(Number(payload.estimate_timer)),
      ),
    });
  }
  if (payload.notes) {
    changes.push({
      label: t('actionPlan.fields.notes'),
      before: null,
      after: t('actionPlan.update.notesReplaced'),
    });
  }
  return changes;
};

export const UpdateNode = ({ plan, index }: NodeProps & { index: number }) => {
  const { t, i18n } = useTranslation();
  const nav = usePlanNavigation();
  const action = plan.effectiveAction(index);
  const task = plan.tasks.find(
    (candidate) => candidate.id === action.payload.id,
  );
  const names = useNameLookups(plan);
  const changes = taskChanges(action.payload, task, t, i18n.language, names);
  const createdId = plan.createdIds[index];

  return (
    <PlanItem
      {...itemState(plan, index)}
      icon={<UpdateIcon />}
      iconColor="#F59E0B"
      title={
        task?.title ||
        action.payload.title ||
        t('actionPlan.update.unknownTask')
      }
      meta={
        <>
          {action.payload.status && (
            <MetaChip
              accent={action.payload.status === 'Done' ? BRAND : '#F59E0B'}
            >
              → {statusLabel(action.payload.status, t)}
            </MetaChip>
          )}
          <MetaChip accent="#F59E0B">
            {t('actionPlan.update.changes', { count: changes.length })}
          </MetaChip>
        </>
      }
      defaultExpanded
      details={
        changes.length > 0 ? <ChangeList changes={changes} /> : undefined
      }
      openLabel={t('actionPlan.open.task')}
      onOpen={createdId ? () => nav.openTask(createdId) : undefined}
    />
  );
};

/* ── Content for the open document ────────────────────────────────────── */

export const InsertNode = ({ plan, index }: NodeProps & { index: number }) => {
  const { t } = useTranslation();
  const markdown = plan.effectiveAction(index).payload.markdown || '';
  const words = wordCount(markdown);
  return (
    <PlanItem
      {...itemState(plan, index)}
      icon={<InsertIcon />}
      iconColor="#8B5CF6"
      title={t('actionPlan.insert.title')}
      meta={
        <>
          <MetaChip>{t('actionPlan.insert.hint')}</MetaChip>
          {words > 0 && (
            <MetaChip>
              {t('actionPlan.document.words', { count: words })}
            </MetaChip>
          )}
        </>
      }
      details={
        markdown ? (
          <MarkdownBox>
            <ReplyMarkdown>{markdown}</ReplyMarkdown>
          </MarkdownBox>
        ) : undefined
      }
    />
  );
};

/* ── A task's checklist ───────────────────────────────────────────────── */

const SUBTASK_OPS = [
  { key: 'add', color: BRAND, mark: '+' },
  { key: 'complete', color: BRAND, mark: '✓' },
  { key: 'reopen', color: '#F59E0B', mark: '↺' },
  { key: 'remove', color: '#EF4444', mark: '✕' },
] as const;

export const SubtasksNode = ({
  plan,
  index,
}: NodeProps & { index: number }) => {
  const { t } = useTranslation();
  const nav = usePlanNavigation();
  const action = plan.effectiveAction(index);
  const { payload } = action;
  const task = plan.tasks.find((candidate) => candidate.id === payload.id);
  const missing = task?.subtasks
    ? missingSubtaskTitles(task.subtasks, payload)
    : [];
  const createdId = plan.createdIds[index];

  const entries = SUBTASK_OPS.flatMap((op) =>
    (op.key === 'add'
      ? (payload.add ?? []).map((s) => ({
          title: s.title,
          minutes: s.estimate_timer
            ? normalizeEstimateTimer(Number(s.estimate_timer))
            : null,
        }))
      : (payload[op.key] ?? []).map((title) => ({ title, minutes: null }))
    ).map((entry) => ({ ...entry, op })),
  );

  return (
    <PlanItem
      {...itemState(plan, index)}
      icon={<SubtasksIcon />}
      iconColor={BRAND}
      title={task?.title || t('actionPlan.update.unknownTask')}
      meta={
        <>
          {SUBTASK_OPS.map((op) => {
            const count =
              op.key === 'add'
                ? (payload.add?.length ?? 0)
                : (payload[op.key]?.length ?? 0);
            return count > 0 ? (
              <MetaChip key={op.key} accent={op.color}>
                {t(`actionPlan.subtasks.${op.key}`, { count })}
              </MetaChip>
            ) : null;
          })}
        </>
      }
      defaultExpanded
      details={
        <>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {entries.map((entry, i) => (
              <Box
                component="li"
                key={`${entry.op.key}-${entry.title}-${i}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.35,
                  fontSize: '0.82rem',
                }}
              >
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    width: 16,
                    textAlign: 'center',
                    fontWeight: 800,
                    color: entry.op.color,
                  }}
                >
                  {entry.op.mark}
                </Box>
                <Box
                  component="span"
                  sx={{
                    flex: 1,
                    textDecoration:
                      entry.op.key === 'remove' ? 'line-through' : 'none',
                  }}
                >
                  {entry.title}
                </Box>
                {entry.minutes && (
                  <Typography variant="caption" color="text.secondary">
                    {formatMinutes(entry.minutes)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          {missing.length > 0 && (
            <Typography variant="caption" color="warning.main">
              {t('actionPlan.subtasks.missing', { titles: missing.join(', ') })}
            </Typography>
          )}
        </>
      }
      openLabel={t('actionPlan.open.task')}
      onOpen={createdId ? () => nav.openTask(createdId) : undefined}
    />
  );
};

/* ── Deleting a task ──────────────────────────────────────────────────── */

export const DeleteNode = ({ plan, index }: NodeProps & { index: number }) => {
  const { t, i18n } = useTranslation();
  const action = plan.effectiveAction(index);
  const task = plan.tasks.find(
    (candidate) => candidate.id === action.payload.id,
  );
  const start = parseDeadline(
    task?.estimated_start_date || task?.deadline || undefined,
  );
  const subtaskCount = task?.subtasks?.length ?? 0;

  return (
    <PlanItem
      {...itemState(plan, index)}
      tone="danger"
      icon={<DeleteIcon />}
      iconColor="#EF4444"
      title={
        task?.title ||
        action.payload.title ||
        t('actionPlan.update.unknownTask')
      }
      meta={
        <>
          <MetaChip accent="#EF4444">
            {t('actionPlan.delete.permanent')}
          </MetaChip>
          {start && (
            <MetaChip>
              <CalendarIcon />
              {formatWhen(start, i18n.language)}
            </MetaChip>
          )}
          {subtaskCount > 0 && (
            <MetaChip>
              {t('actionPlan.task.subtaskCount', { count: subtaskCount })}
            </MetaChip>
          )}
          {task?.google_event_id && (
            <MetaChip accent="#4285F4">
              {t('actionPlan.delete.alsoGoogle')}
            </MetaChip>
          )}
        </>
      }
    />
  );
};
