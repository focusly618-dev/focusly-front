import { useWorkspace } from './hooks/useWorkspace.hook';
import { WorkspaceLibrary } from './components/Library/WorkspaceLibrary';
import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';
import type { Step } from 'react-joyride';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_WORKSPACE_BY_ID, GET_WORKSPACES } from './Workspace.graphql';
import { useEffect, useState, lazy, Suspense } from 'react';
import type { WorkspaceProps, WorkspaceTypes } from './types/workspace.types';

const WorkspaceEditor = lazy(() =>
  import('./components/Editor/WorkspaceEditor').then((m) => ({
    default: m.WorkspaceEditor,
  })),
);
import { WorkspaceEditorSkeleton } from './components/WorkspaceEditorSkeleton';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { BlockNoteEditor } from '@blocknote/core';
import { getDefaultReactSlashMenuItems } from '@blocknote/react';
import {
  Folder as FolderIcon,
  InfoOutlined as InfoIcon,
  CalendarTodayOutlined as CalendarIcon,
  SpeedOutlined as SpeedIcon,
} from '@mui/icons-material';
import { WorkspaceEmptyState } from '@/components/ui/WorkspaceEmptyState';

export const Workspace = ({
  isEditorOpen,
  onEditorChange,
  onStartFocus,
  onOpenTaskDetails,
  isSidebarOpen,
  onSidebarChange,
  activeFocusTaskId,
}: WorkspaceProps) => {
  const {
    register,
    setValue,
    watch,
    getValues,
    reset,
    selectTask,
    handleSelectTask,
    handleUpdateTask,
    tasksData,
    saveState,
  } = useWorkspace();

  const [runOnboarding, setRunOnboarding] = useState((): boolean => {
    return localStorage.getItem('onboarding_workspace_completed') !== 'true';
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGroupId = searchParams.get('groupId');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [prevGroupId, setPrevGroupId] = useState(selectedGroupId);

  if (selectedGroupId !== prevGroupId) {
    setPrevGroupId(selectedGroupId);
    setIsCreatingNew(false);
  }

  const onboardingSteps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Welcome to Your Workspace! 🧠
          </Typography>
          <Typography variant="body2">
            This is where you plan your strategy and organize your thoughts.
          </Typography>
        </Box>
      ),
    },
    {
      target: '#joyride-workspace-search',
      content: 'Quickly find your notes or projects using the search bar.',
    },
    {
      target: '#joyride-workspace-create-note',
      content: 'Start a new strategic note to capture your next big idea.',
    },
  ];

  const handleFinishOnboarding = (): void => {
    setRunOnboarding(false);
    localStorage.setItem('onboarding_workspace_completed', 'true');
  };

  // Queries
  const { data: workspacesData, loading: workspacesLoading } = useQuery(
    GET_WORKSPACES,
    {
      variables: { search: '' },
    },
  );

  const [getWorkspaceById] = useLazyQuery(GET_WORKSPACE_BY_ID);
  const workspaceIdParam = searchParams.get('workspaceId');

  const hasWorkspaces = (workspacesData?.workspaces?.length ?? 0) > 0;

  useEffect(() => {
    const loadWorkspaceFromUrl = async () => {
      if (workspaceIdParam) {
        setIsCreatingNew(false);
        if (watch('id') !== workspaceIdParam) {
          try {
            const { data } = await getWorkspaceById({
              variables: { id: workspaceIdParam },
            });
            const workspace = data?.workspace;
            if (workspace) {
              reset({
                id: workspace.id,
                title: workspace.title,
                content: workspace.content,
                taskId: workspace.taskId || null,
                projectId: workspace.projectId,
                groupId: workspace.groupId,
                project: workspace.project,
                emoji: workspace.emoji,
                background_color: workspace.background_color,
                card_show_background: workspace.card_show_background,
                saveStatus: true,
              });
              if (workspace.task) {
                handleSelectTask(workspace.task);
              } else {
                handleSelectTask(null);
              }
              onEditorChange(true);
            } else {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('workspaceId');
              setSearchParams(newParams);
            }
          } catch (error) {
            console.error('Error loading workspace from URL', error);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('workspaceId');
            setSearchParams(newParams);
          }
        }
      } else {
        if (isEditorOpen && !isCreatingNew) {
          onEditorChange(false);
        }
      }
    };
    loadWorkspaceFromUrl();
  }, [
    workspaceIdParam,
    isEditorOpen,
    isCreatingNew,
    getWorkspaceById,
    onEditorChange,
    setValue,
    handleSelectTask,
    searchParams,
    setSearchParams,
    watch,
    reset,
  ]);

  const workspaceId = watch('id');

  useEffect(() => {
    if (isEditorOpen && workspaceId && !workspaceIdParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('workspaceId', workspaceId);
      setSearchParams(newParams);
    }
  }, [
    isEditorOpen,
    workspaceId,
    workspaceIdParam,
    searchParams,
    setSearchParams,
  ]);

  const handleSelectWorkspace = (workspace: WorkspaceTypes): void => {
    setIsCreatingNew(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('workspaceId', workspace.id);
    setSearchParams(newParams);

    reset({
      id: workspace.id,
      title: workspace.title,
      content: workspace.content,
      taskId: workspace.taskId || null,
      projectId: workspace.projectId,
      groupId: workspace.groupId,
      project: workspace.project,
      emoji: workspace.emoji,
      background_color: workspace.background_color,
      card_show_background: workspace.card_show_background,
      saveStatus: true,
    });
    if (workspace.task) {
      handleSelectTask(workspace.task);
    } else {
      handleSelectTask(null);
    }
    onEditorChange(true);
  };

  const handleCreateNew = (): void => {
    setIsCreatingNew(true);
    reset({
      title: 'Untitled Strategic Plan',
      taskId: undefined,
      content: '[]',
      id: undefined,
      projectId: undefined,
      groupId: selectedGroupId || undefined,
      emoji: undefined,
      background_color: undefined,
      card_show_background: false,
      saveStatus: true,
    });

    handleSelectTask(null);
    onEditorChange(true);
  };

  const getCustomSlashMenuItems = (editor: BlockNoteEditor) => {
    const defaultItems = getDefaultReactSlashMenuItems(editor);
    const filtered = defaultItems.filter(
      (item) => item.title !== 'Audio' && item.title !== 'File',
    );

    const customItems = [
      {
        title: 'Callout block',
        onItemClick: () => {
          editor.insertBlocks(
            [
              {
                type: 'paragraph',
                content: '⚠️ Callout: Write something important here...',
              },
            ],
            editor.getTextCursorPosition().block,
            'after',
          );
        },
        aliases: ['alert', 'warning', 'info', 'note'],
        groupName: 'Advanced',
        icon: <InfoIcon sx={{ color: 'info.main', fontSize: 18 }} />,
        subtext: 'Insert a highlighted note or alert box',
      },
      {
        title: 'Meeting Notes template',
        onItemClick: () => {
          editor.insertBlocks(
            [
              {
                type: 'heading',
                content:
                  '📅 Meeting Notes - ' + new Date().toLocaleDateString(),
                props: { level: 2 },
              },
              {
                type: 'paragraph',
                content: '**Attendees:** [List participants]',
              },
              {
                type: 'heading',
                content: '🎯 Objectives',
                props: { level: 3 },
              },
              {
                type: 'bulletListItem',
                content: 'Discuss project milestones',
              },
              {
                type: 'bulletListItem',
                content: 'Align on next design iterations',
              },
              {
                type: 'heading',
                content: '✅ Action Items',
                props: { level: 3 },
              },
              {
                type: 'checkListItem',
                content: 'Create high-fidelity mockups',
              },
            ],
            editor.getTextCursorPosition().block,
            'after',
          );
        },
        aliases: ['template', 'meeting', 'agenda'],
        groupName: 'Templates',
        icon: <CalendarIcon sx={{ color: 'primary.main', fontSize: 18 }} />,
        subtext: 'Insert a pre-structured meeting outline',
      },
      {
        title: 'Sprint Plan template',
        onItemClick: () => {
          editor.insertBlocks(
            [
              {
                type: 'heading',
                content: '🚀 Sprint Planning',
                props: { level: 2 },
              },
              {
                type: 'paragraph',
                content:
                  '**Sprint Goals:** Deliver the core features & design refinements.',
              },
              {
                type: 'heading',
                content: '📋 Backlog Items',
                props: { level: 3 },
              },
              {
                type: 'checkListItem',
                content: 'Build auto-save status indicator in workspace editor',
              },
              {
                type: 'checkListItem',
                content: 'Enable image and video blocks inside documents',
              },
            ],
            editor.getTextCursorPosition().block,
            'after',
          );
        },
        aliases: ['sprint', 'scrum', 'agile'],
        groupName: 'Templates',
        icon: <SpeedIcon sx={{ color: 'success.main', fontSize: 18 }} />,
        subtext: 'Insert a detailed sprint planning layout',
      },
    ];

    return [...filtered, ...customItems];
  };

  const getWorkspaceMentionMenuItems = (editor: BlockNoteEditor) => {
    if (!workspacesData?.workspaces) return [];

    const currentId = watch('id');
    const otherWorkspaces = workspacesData.workspaces.filter(
      (w: WorkspaceTypes) => w.id !== currentId,
    );

    return otherWorkspaces.map((w: WorkspaceTypes) => ({
      title: w.title,
      icon: (
        <FolderIcon
          sx={{ fontSize: 18, color: w.project?.color || 'primary.main' }}
        />
      ),
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: 'link',
            href: `/dashboard?tab=Workspace&workspaceId=${w.id}`,
            content: `@${w.title}`,
          },
          {
            type: 'text',
            text: ' ',
            styles: {},
          },
        ]);
      },
    }));
  };

  const handleUnlinkTask = (): void => {
    handleSelectTask(null);
    setValue('taskId', null);
  };

  if (workspacesLoading) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Main Workspace Workspace Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isEditorOpen ? (
          <div
            id="joyride-workspace-editor"
            style={{ height: '100%', width: '100%' }}
          >
            <Suspense fallback={<WorkspaceEditorSkeleton />}>
              <WorkspaceEditor
                key={watch('id') || 'new-workspace'}
                onBack={() => {
                  onEditorChange(false);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('workspaceId');
                  setSearchParams(newParams);
                }}
                register={register}
                setValue={setValue}
                watch={watch}
                getValues={getValues}
                selectTask={selectTask}
                handleSelectTask={handleSelectTask}
                handleUpdateTask={handleUpdateTask}
                tasksData={tasksData}
                onStartFocus={onStartFocus}
                onOpenTaskDetails={onOpenTaskDetails}
                isRightSidebarOpen={isSidebarOpen}
                setIsRightSidebarOpen={onSidebarChange}
                workspaces={workspacesData?.workspaces}
                getCustomSlashMenuItems={getCustomSlashMenuItems}
                getWorkspaceMentionMenuItems={getWorkspaceMentionMenuItems}
                activeFocusTaskId={activeFocusTaskId}
                onUnlinkTask={handleUnlinkTask}
                saveState={saveState}
              />
            </Suspense>
          </div>
        ) : hasWorkspaces ? (
          <div
            id="joyride-workspace-library"
            style={{ height: '100%', width: '100%' }}
          >
            <WorkspaceLibrary
              onCreate={handleCreateNew}
              onSelect={handleSelectWorkspace}
              selectedGroupId={selectedGroupId}
            />
          </div>
        ) : (
          <div
            id="joyride-workspace-empty"
            style={{ height: '100%', width: '100%' }}
          >
            <WorkspaceEmptyState onCreate={handleCreateNew} />
          </div>
        )}
      </Box>

      <OnboardingWrapper
        steps={onboardingSteps}
        run={runOnboarding}
        onFinish={handleFinishOnboarding}
      />
    </Box>
  );
};

export default Workspace;
