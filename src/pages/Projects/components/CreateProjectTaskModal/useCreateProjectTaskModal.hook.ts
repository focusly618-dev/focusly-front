import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material';
import { sileo, UNTITLED_WORKSPACE_TITLE } from '@/utils';
import { PRIORITY_OPTIONS, isCustomEmoji } from '@/components/ui';
import {
  GET_WORKSPACES,
  CREATE_WORKSPACE,
} from '@/pages/Workspace/Workspace.graphql';
import type {
  CreateProjectTaskModalProps,
  ProjectOption,
} from './CreateProjectTaskModal.types';

// ── Constants ────────────────────────────────────────────────────────────────

export const STATUS_OPTIONS = [
  { id: 'backlog', label: 'Backlog', color: '#64748b' },
  { id: 'todo', label: 'To Do', color: '#94a3b8' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'review', label: 'Review', color: '#8b5cf6' },
  { id: 'done', label: 'Done', color: '#10b981' },
];

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
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCreateProjectTaskModal({
  open,
  onClose,
  task,
  projects,
  selectedProjectId,
  projectName = 'Select Project',
  projectEmoji = '📁',
  linkedWorkspaceId,
  defaultStatus,
  onCreate,
  onUpdate,
  onDelete,
}: CreateProjectTaskModalProps) {
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

  const selectedProject =
    selectedProjectOverride ||
    (selectedProjectId && projects
      ? projects.find((p) => p.id === selectedProjectId)
      : projects?.[0]);

  const currentProjectName = selectedProject?.name || projectName;
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
      refetchQueries: [
        'GetWorkspacesPaginated',
        'GetWorkspaces',
        'GetProjectGroups',
      ],
      update(cache) {
        cache.evict({ fieldName: 'workspacesPaginated' });
        cache.evict({ fieldName: 'workspaces' });
        cache.gc();
      },
    });

  const handleCreateWorkspace = async (customTitle?: string) => {
    const titleToUse = (
      customTitle !== undefined ? customTitle : newWorkspaceTitle
    ).trim();
    if (!titleToUse) {
      sileo.warning({
        title: 'Título requerido',
        description: 'Por favor escribe un título para el workspace.',
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
        sileo.success({
          title: 'Workspace creado y vinculado',
          description: `"${newWs.title || titleToUse}"`,
          duration: 2500,
        });
        return newWs;
      }
    } catch (err) {
      console.error('Error al crear workspace:', err);
      sileo.error({
        title: 'Error',
        description: 'No se pudo crear el workspace. Intenta de nuevo.',
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
    return combined.filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
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

  const isWorkspaceLinked = Boolean(
    selectedWorkspace || selectedWorkspaceId || task?.workspaceId,
  );
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

  // ── Sync form with task prop or reset for new task ─────────────────────────
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || defaultStatus || 'in_progress');
        setPriority(task.priority || 'Medium');

        if (task.rawDeadline) {
          try {
            setDueDate(new Date(task.rawDeadline).toISOString().slice(0, 10));
          } catch {
            setDueDate(task.rawDeadline.slice(0, 10));
          }
        } else if (task.dueDate && /^\d{4}-\d{2}-\d{2}/.test(task.dueDate)) {
          setDueDate(task.dueDate.slice(0, 10));
        } else {
          setDueDate('');
        }

        setEstimatedDuration(task.duration || '30m');
        setModules(
          task.modules && task.modules.length > 0
            ? task.modules
            : task.tag
              ? [task.tag]
              : [],
        );
        setSubtasks(
          (task.subtasks || []).map((s) => ({
            id: s.id,
            title: s.title,
            time: s.duration || '15m',
            completed: Boolean(s.completed),
          })),
        );
        setSelectedWorkspaceId(task.workspaceId || linkedWorkspaceId || null);

        const matchedProject = projects?.find(
          (p) => p.id === task.projectId || p.id === task.project?.id,
        );
        if (matchedProject) {
          setSelectedProjectOverride(matchedProject);
        } else if (selectedProjectId && projects) {
          setSelectedProjectOverride(
            projects.find((p) => p.id === selectedProjectId),
          );
        } else {
          setSelectedProjectOverride(undefined);
        }
      } else {
        setTitle('');
        setDescription('');
        setStatus(defaultStatus || 'in_progress');
        setPriority('Medium');
        setDueDate('');
        setEstimatedDuration('30m');
        setModules([]);
        setSubtasks([]);
        setSelectedWorkspaceId(linkedWorkspaceId || null);
        if (selectedProjectId && projects) {
          setSelectedProjectOverride(
            projects.find((p) => p.id === selectedProjectId),
          );
        } else {
          setSelectedProjectOverride(undefined);
        }
      }
    }
  }, [
    open,
    task,
    linkedWorkspaceId,
    defaultStatus,
    selectedProjectId,
    projects,
  ]);

  // ── Derived config ─────────────────────────────────────────────────────────
  const currentStatusConfig =
    STATUS_OPTIONS.find(
      (s) => s.id === status || s.label.toLowerCase() === status.toLowerCase(),
    ) || STATUS_OPTIONS[2];

  const currentPriorityConfig =
    PRIORITY_OPTIONS.find(
      (p) =>
        p.id.toLowerCase() === priority.toLowerCase() ||
        p.label.toLowerCase() === priority.toLowerCase(),
    ) || PRIORITY_OPTIONS[1];

  const completedCount = subtasks.filter((s) => s.completed).length;

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const themeTokens = {
    surfaceBg: isDark ? '#141417' : '#ffffff',
    cardBg: isDark ? '#1a1a1f' : '#f8fafc',
    cardBorder: isDark ? '#27272a' : '#e2e8f0',
    secondaryText: isDark ? '#a1a1aa' : '#64748b',
    headerText: isDark ? '#f4f4f5' : '#0f172a',
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
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
      sileo.warning({
        title: 'Title required',
        description: 'Please enter a title for the task.',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        status: currentStatusConfig.id,
        priority: currentPriorityConfig.id,
        modules,
        dueDate: dueDate || undefined,
        estimatedDuration,
        description: description.trim(),
        subtasks,
        projectId: selectedProject?.id,
        workspaceId: selectedWorkspaceId || undefined,
      };

      if (isEditing && task) {
        if (onUpdate) {
          await onUpdate(task.id, payload);
        } else if (onCreate) {
          await onCreate({ ...payload, id: task.id });
        }
        sileo.success({
          title: 'Task updated',
          description: `"${title.trim()}" saved successfully.`,
          duration: 2500,
        });
        onClose();
      } else {
        if (onCreate) {
          await onCreate(payload);
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

  const handleDeleteTask = async () => {
    if (!task?.id || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(task.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsSubmitting(false);
    }
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
    handleKeyDown,
    handleRedirectWorkspace,
  };
}
