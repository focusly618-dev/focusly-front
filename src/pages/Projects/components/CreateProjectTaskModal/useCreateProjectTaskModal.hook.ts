import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, alpha } from '@mui/material';
import { notify, UNTITLED_WORKSPACE_TITLE } from '@/utils';
import { PRIORITY_OPTIONS, isCustomEmoji } from '@/components/ui';
import {
  GET_WORKSPACES,
  CREATE_WORKSPACE,
} from '@/pages/Workspace/Workspace.graphql';
import type {
  CreateProjectTaskModalProps,
  ProjectOption,
} from './CreateProjectTaskModal.types';
import { surfaceColor } from '@/context';
import { parseDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { mapStatusFromBackend } from '../ProjectTasks/hooks/useTaskMutations.hook';
import { DEFAULT_PROJECT_STATUSES } from '../ProjectTasks/projectTasks.types';
import { toDateInputValue } from '../ProjectTasks/projectTaskDates';

// ── Constants ────────────────────────────────────────────────────────────────

// The project tasks view's statuses, so an existing task opens with its real
// status (and its usual name) instead of falling back.
export const STATUS_OPTIONS = DEFAULT_PROJECT_STATUSES.map(
  ({ id, label, labelKey, color }) => ({ id, label, labelKey, color }),
);

export const DURATION_OPTIONS = [
  '15m',
  '30m',
  '45m',
  '1h',
  '1h 30m',
  '2h',
  '3h',
  '4h',
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Subtask {
  id: string;
  title: string;
  time?: string;
  completed?: boolean;
  // Backend values carried through so a save doesn't erase them.
  estimateTimer?: number | null;
  completedAt?: string | null;
}

// What the form showed when an existing task was opened; on save only the
// fields that differ from it are sent, so untouched data is never rewritten.
interface FormSnapshot {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  estimatedDuration: string;
  modules: string[];
  subtasks: Subtask[];
  projectId?: string;
  workspaceId: string | null;
}

const toSubtaskPayload = (list: Subtask[]) =>
  list.map((s) => ({
    id: s.id,
    title: s.title,
    completed: Boolean(s.completed),
    completed_at: s.completedAt ?? null,
    estimate_timer: parseDuration(s.time) || s.estimateTimer || null,
  }));

const isSameList = (a: unknown[], b: unknown[]) =>
  JSON.stringify(a) === JSON.stringify(b);

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCreateProjectTaskModal({
  open,
  onClose,
  task,
  projects,
  selectedProjectId,
  projectName,
  projectEmoji = '📁',
  linkedWorkspaceId,
  defaultStatus,
  defaultTitle,
  onCreate,
  onUpdate,
  onDelete,
}: CreateProjectTaskModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isEditing = Boolean(task);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Project selection ──────────────────────────────────────────────────────
  const [selectedProjectOverride, setSelectedProjectOverride] = useState<
    ProjectOption | undefined
  >(undefined);
  const [projectMenuAnchor, setProjectMenuAnchor] =
    useState<null | HTMLElement>(null);

  const taskProject = task
    ? projects?.find(
        (p) => p.id === task.projectId || p.id === task.project?.id,
      )
    : undefined;
  const selectedProject =
    selectedProjectOverride ||
    taskProject ||
    (selectedProjectId && projects
      ? projects.find((p) => p.id === selectedProjectId)
      : projects?.[0]);

  const currentProjectName =
    selectedProject?.name ||
    projectName ||
    t('tasks.createProjectTaskModal.selectProject');
  const currentProjectColor = selectedProject?.color || '#3b82f6';
  const currentProjectEmoji =
    selectedProject?.emoji ||
    (projectEmoji !== '📁' ? projectEmoji : undefined);
  const isCurrentEmojiCustom = isCustomEmoji(currentProjectEmoji);
  const isCurrentOutlined = currentProjectEmoji === 'outlined';
  const hasProjects = Boolean(projects && projects.length > 0);
  const isMultipleProjects = Boolean(projects && projects.length > 1);

  // ── Workspace linking ──────────────────────────────────────────────────────
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    linkedWorkspaceId || null,
  );
  const [workspaceMenuAnchor, setWorkspaceMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] =
    useState(false);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('');
  const [createdWorkspaces, setCreatedWorkspaces] = useState<
    Array<{ id: string; title: string; emoji?: string; projectId?: string }>
  >([]);

  const {
    data: workspacesData,
    loading: loadingWorkspaces,
    refetch: refetchWorkspaces,
  } = useQuery(GET_WORKSPACES, {
    variables: {
      projectId: selectedProject?.id || undefined,
      limit: 50,
      offset: 0,
    },
    skip: !open,
    fetchPolicy: 'cache-and-network',
  });

  const [createWorkspaceMutation, { loading: isCreatingWorkspace }] =
    useMutation(CREATE_WORKSPACE, {
      // refetchQueries alone: evicting the lists as well made each list on
      // screen refetch itself on top of it (every list fetched twice).
      refetchQueries: ['GetWorkspacesPaginated', 'GetProjectGroups'],
    });

  const handleCreateWorkspace = async (customTitle?: string) => {
    const titleToUse = (
      customTitle !== undefined ? customTitle : newWorkspaceTitle
    ).trim();
    if (!titleToUse) {
      notify.warning({
        title: t('tasks.createProjectTaskModal.toast.workspaceTitleRequired'),
        description: t(
          'tasks.createProjectTaskModal.toast.workspaceTitleRequiredDesc',
        ),
        duration: 3000,
      });
      return;
    }

    try {
      const res = await createWorkspaceMutation({
        variables: {
          createWorkspaceInput: {
            title: titleToUse,
            content: '[]',
            groupId: selectedProject?.id || undefined,
            taskId: task?.id || undefined,
            saveStatus: true,
          },
        },
      });

      const newWs = res.data?.createWorkspace;
      if (newWs?.id) {
        setCreatedWorkspaces((prev) => [newWs, ...prev]);
        setSelectedWorkspaceId(newWs.id);
        setIsCreateWorkspaceDialogOpen(false);
        setNewWorkspaceTitle('');
        setWorkspaceMenuAnchor(null);
        await refetchWorkspaces();
        notify.success({
          title: t('tasks.createProjectTaskModal.toast.workspaceLinked'),
          description: newWs.title || titleToUse,
          duration: 2500,
        });
        return newWs;
      }
    } catch (err) {
      console.error('Error al crear workspace:', err);
      notify.error({
        title: t('tasks.createProjectTaskModal.toast.workspaceCreateFailed'),
        duration: 3000,
      });
    }
  };

  const availableWorkspaces: Array<{
    id: string;
    title: string;
    emoji?: string;
    projectId?: string;
    updatedAt?: string;
  }> = useMemo(() => {
    const fromQuery = workspacesData?.result?.workspaces || [];
    const combined = [...createdWorkspaces, ...fromQuery];
    const seen = new Set<string>();
    const deduplicated = combined.filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
    return deduplicated.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [workspacesData, createdWorkspaces]);

  const filteredWorkspaces = useMemo(() => {
    if (!workspaceSearch.trim()) return availableWorkspaces;
    const lower = workspaceSearch.toLowerCase();
    return availableWorkspaces.filter(
      (w) =>
        (w.title && w.title.toLowerCase().includes(lower)) ||
        (w.emoji && w.emoji.includes(lower)),
    );
  }, [availableWorkspaces, workspaceSearch]);

  const selectedWorkspace = useMemo(() => {
    if (selectedWorkspaceId) {
      return (
        availableWorkspaces.find((w) => w.id === selectedWorkspaceId) || null
      );
    }
    return null;
  }, [availableWorkspaces, selectedWorkspaceId]);

  // selectedWorkspaceId starts as the task's link, so after "unlink" this has
  // to stop counting the task's original workspace.
  const isWorkspaceLinked = Boolean(selectedWorkspace || selectedWorkspaceId);
  const displayWorkspaceTitle =
    selectedWorkspace?.title?.trim() ||
    (selectedWorkspaceId ? UNTITLED_WORKSPACE_TITLE : '');
  const displayWorkspaceSection = selectedWorkspace
    ? currentProjectName
    : currentProjectName;
  const displayWorkspaceEmoji = selectedWorkspace?.emoji || '📄';

  // ── Core form fields ───────────────────────────────────────────────────────
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<string>(defaultStatus || 'in_progress');
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [priority, setPriority] = useState<string>('Medium');
  const [priorityMenuAnchor, setPriorityMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('30m');
  const [durationMenuAnchor, setDurationMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [createMore, setCreateMore] = useState(false);
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskTime, setNewSubtaskTime] = useState('15m');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const initialSnapshotRef = useRef<FormSnapshot | null>(null);
  // Which open/task the form was last filled for. The parent re-renders with
  // fresh `projects`/`task` objects while the modal is open (refetches,
  // sockets), and refilling on each of those wiped what the user was typing.
  const filledForRef = useRef<string | null>(null);

  // ── Sync form with task prop or reset for new task ─────────────────────────
  useEffect(() => {
    if (!open) {
      filledForRef.current = null;
      return;
    }
    const fillKey = task?.id ?? 'new';
    if (filledForRef.current === fillKey) return;
    filledForRef.current = fillKey;

    setIsDeleteConfirmOpen(false);
    setSelectedProjectOverride(undefined);

    if (task) {
      const initialDueDate = toDateInputValue(task.rawDeadline);

      const initial: FormSnapshot = {
        title: task.title || '',
        description: task.description || '',
        status: mapStatusFromBackend(task.status || defaultStatus),
        priority: task.priority || 'Medium',
        dueDate: initialDueDate,
        // No estimate stays empty instead of silently becoming 30m.
        estimatedDuration: task.duration || '',
        modules:
          task.modules && task.modules.length > 0
            ? task.modules
            : task.tag
              ? [task.tag]
              : [],
        subtasks: (task.subtasks || []).map((s) => ({
          id: s.id,
          title: s.title,
          time: s.duration || '',
          completed: Boolean(s.completed),
          estimateTimer: s.estimateTimer ?? null,
          completedAt: s.completedAt ?? null,
        })),
        projectId: task.projectId || task.project?.id,
        workspaceId: task.workspaceId || linkedWorkspaceId || null,
      };
      initialSnapshotRef.current = initial;

      setTitle(initial.title);
      setDescription(initial.description);
      setStatus(initial.status);
      setPriority(initial.priority);
      setDueDate(initial.dueDate);
      setEstimatedDuration(initial.estimatedDuration);
      setModules(initial.modules);
      setSubtasks(initial.subtasks);
      setSelectedWorkspaceId(initial.workspaceId);
    } else {
      initialSnapshotRef.current = null;
      setTitle(defaultTitle || '');
      setDescription('');
      setStatus(defaultStatus || 'in_progress');
      setPriority('Medium');
      setDueDate('');
      setEstimatedDuration('30m');
      setModules([]);
      setSubtasks([]);
      setSelectedWorkspaceId(linkedWorkspaceId || null);
    }
  }, [open, task, linkedWorkspaceId, defaultStatus, defaultTitle]);

  // ── Derived config ─────────────────────────────────────────────────────────
  const currentStatusConfig =
    STATUS_OPTIONS.find((s) => s.id === mapStatusFromBackend(status)) ||
    STATUS_OPTIONS[1];

  const currentPriorityConfig =
    PRIORITY_OPTIONS.find(
      (p) =>
        p.id.toLowerCase() === priority.toLowerCase() ||
        p.label.toLowerCase() === priority.toLowerCase(),
    ) || PRIORITY_OPTIONS[1];

  const completedCount = subtasks.filter((s) => s.completed).length;

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const themeTokens = {
    surfaceBg: surfaceColor(theme, '#141417', '#1E1E1E', '#ffffff'),
    cardBg: surfaceColor(theme, '#1a1a1f', '#252525', '#f8fafc'),
    cardBorder: surfaceColor(theme, '#27272a', '#333333', '#e2e8f0'),
    secondaryText: isDark ? '#a1a1aa' : '#64748b',
    headerText: isDark ? '#f4f4f5' : '#0f172a',
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              completed: !s.completed,
              completedAt: s.completed ? null : new Date().toISOString(),
            }
          : s,
      ),
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: `st-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        time: newSubtaskTime || '15m',
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !modules.includes(trimmed)) {
      setModules((prev) => [...prev, trimmed]);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setModules((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      notify.warning({
        title: t('tasks.createProjectTaskModal.toast.titleRequired'),
        description: t('tasks.createProjectTaskModal.toast.titleRequiredDesc'),
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && task) {
        const changes = getChangedFields();
        if (Object.keys(changes).length === 0) {
          onClose();
          return;
        }
        if (onUpdate) {
          await onUpdate(task.id, changes);
        } else if (onCreate) {
          await onCreate({ ...changes, id: task.id });
        }
        notify.success({
          title: t('tasks.createProjectTaskModal.toast.taskUpdated'),
          description: title.trim(),
          duration: 2500,
        });
        onClose();
      } else {
        if (onCreate) {
          await onCreate({
            title: title.trim(),
            status: currentStatusConfig.id,
            priority: currentPriorityConfig.id,
            modules,
            dueDate: dueDate || undefined,
            estimatedDuration,
            description: description.trim(),
            subtasks: toSubtaskPayload(subtasks),
            projectId: selectedProject?.id,
            workspaceId: selectedWorkspaceId || undefined,
          });
        }

        if (createMore) {
          setTitle('');
          setDescription('');
          setSubtasks([]);
          setModules([]);
        } else {
          onClose();
        }
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only what the user actually changed. Re-sending untouched values used to
  // reopen completed tasks, drop statuses the form can't show (Scheduled,
  // Planning…), reset deadline times and move tasks to another project.
  const getChangedFields = (): Record<string, unknown> => {
    const initial = initialSnapshotRef.current;
    if (!initial) return {};
    const changes: Record<string, unknown> = {};

    if (title.trim() !== initial.title.trim()) changes.title = title.trim();
    if (description !== initial.description) {
      changes.description = description.trim();
    }
    if (status !== initial.status) changes.status = currentStatusConfig.id;
    if (priority !== initial.priority) {
      changes.priority = currentPriorityConfig.id;
    }
    // An emptied date or estimate removes it.
    if (dueDate !== initial.dueDate) changes.dueDate = dueDate;
    if (estimatedDuration !== initial.estimatedDuration) {
      changes.estimatedDuration = estimatedDuration;
    }
    if (!isSameList(modules, initial.modules)) changes.modules = modules;
    if (!isSameList(subtasks, initial.subtasks)) {
      changes.subtasks = toSubtaskPayload(subtasks);
    }
    if (
      selectedProjectOverride &&
      selectedProjectOverride.id !== initial.projectId
    ) {
      changes.projectId = selectedProjectOverride.id;
    }
    // null means the user unlinked the workspace.
    if (selectedWorkspaceId !== initial.workspaceId) {
      changes.workspaceId = selectedWorkspaceId;
    }
    return changes;
  };

  const handleDeleteTask = () => {
    if (!task?.id || !onDelete) return;
    setIsDeleteConfirmOpen(true);
  };

  // Runs from the confirm dialog, which shows the progress and stays open if
  // the delete fails (the mutation hook already reports the error).
  const confirmDeleteTask = async () => {
    if (!task?.id || !onDelete) return;
    await onDelete(task.id);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCreateTask();
    }
  };

  const handleRedirectWorkspace = () => {
    if (!selectedWorkspaceId) return;
    const newParams = new URLSearchParams(searchParams);
    // TaskBar.Workspace = 'Projects' — this is the tab that renders the Workspace component
    newParams.set('tab', 'Projects');
    newParams.set('workspaceId', selectedWorkspaceId);
    newParams.delete('projectId');
    newParams.delete('action');
    navigate(`/dashboard?${newParams.toString()}`);
    setSearchParams(newParams);
    onClose();
  };

  return {
    // Theme
    isDark,
    themeTokens,
    alpha,

    // Editing state
    isEditing,

    // Project
    selectedProject,
    selectedProjectOverride,
    setSelectedProjectOverride,
    projectMenuAnchor,
    setProjectMenuAnchor,
    currentProjectName,
    currentProjectColor,
    currentProjectEmoji,
    isCurrentEmojiCustom,
    isCurrentOutlined,
    hasProjects,
    isMultipleProjects,

    // Workspace
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    workspaceMenuAnchor,
    setWorkspaceMenuAnchor,
    workspaceSearch,
    setWorkspaceSearch,
    loadingWorkspaces,
    filteredWorkspaces,
    selectedWorkspace,
    isWorkspaceLinked,
    displayWorkspaceTitle,
    displayWorkspaceSection,
    displayWorkspaceEmoji,
    isCreateWorkspaceDialogOpen,
    setIsCreateWorkspaceDialogOpen,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    isCreatingWorkspace,
    handleCreateWorkspace,

    // Form fields
    isFullScreen,
    setIsFullScreen,
    title,
    setTitle,
    status,
    setStatus,
    statusMenuAnchor,
    setStatusMenuAnchor,
    priority,
    setPriority,
    priorityMenuAnchor,
    setPriorityMenuAnchor,
    modules,
    setModules,
    newTagInput,
    setNewTagInput,
    isAddingTag,
    setIsAddingTag,
    dueDate,
    setDueDate,
    estimatedDuration,
    setEstimatedDuration,
    durationMenuAnchor,
    setDurationMenuAnchor,
    createMore,
    setCreateMore,
    description,
    setDescription,
    subtasks,
    newSubtaskTitle,
    setNewSubtaskTitle,
    newSubtaskTime,
    setNewSubtaskTime,
    isSubmitting,

    // Derived
    currentStatusConfig,
    currentPriorityConfig,
    completedCount,

    // Handlers
    toggleSubtask,
    handleAddSubtask,
    handleRemoveSubtask,
    handleAddTag,
    handleRemoveTag,
    handleCreateTask,
    handleDeleteTask,
    confirmDeleteTask,
    isDeleteConfirmOpen,
    closeDeleteConfirm: () => setIsDeleteConfirmOpen(false),
    handleKeyDown,
    handleRedirectWorkspace,
  };
}
