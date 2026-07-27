import { useState, lazy, Suspense } from 'react';
import { useMutation } from '@apollo/client';
import { useWorkspace } from './hooks/useWorkspace.hook';
import { WorkspaceLibrary } from './components/Library/WorkspaceLibrary';
import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';
import { CREATE_PROJECT_GROUP } from './Workspace.graphql';
import { CreateProjectModal } from './components/Library/modals/CreateProjectModal';
import { sileo } from '@/utils';
import type { WorkspaceProps } from './types/workspace.types';

const WorkspaceEditor = lazy(() =>
  import('./components/Editor/WorkspaceEditor').then((m) => ({
    default: m.WorkspaceEditor,
  })),
);
import { WorkspaceEditorSkeleton } from './components/WorkspaceEditorSkeleton';
import { Box } from '@mui/material';
import { BlockNoteEditor } from '@blocknote/core';
import { getDefaultReactSlashMenuItems } from '@blocknote/react';
import {
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
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  const [createProjectGroup] = useMutation(CREATE_PROJECT_GROUP, {
    refetchQueries: ['GetProjectGroups', 'GetWorkspaces'],
  });

  const handleCreateProject = async (name: string, color: string) => {
    try {
      await createProjectGroup({
        variables: {
          input: { name, color },
        },
      });
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'Projects');
      newParams.delete('groupId');
      newParams.delete('workspaceId');
      setSearchParams(newParams);

      sileo.success({
        title: 'Project created',
        description: `Project "${name}" created successfully.`,
        fill: 'var(--sileo-success-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };
  const {
    register,
    setValue,
    watch,
    getValues,
    saveState,
    tasksData,
    handleSelectTask,
    selectTask,
    handleUpdateTask,
    runOnboarding,
    handleFinishOnboarding,
    onboardingSteps,
    workspacesData,
    workspacesLoading,
    hasWorkspaces,
    handleSelectWorkspace,
    handleCreateNew,
    getWorkspaceMentionMenuItems,
    searchParams,
    setSearchParams,
    selectedGroupId,
    loadMore,
  } = useWorkspace({ isEditorOpen, onEditorChange });

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
                loadMore={loadMore}
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
            <WorkspaceEmptyState
              onCreate={() => setIsCreateProjectModalOpen(true)}
            />
          </div>
        )}
      </Box>

      <CreateProjectModal
        open={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <OnboardingWrapper
        steps={onboardingSteps}
        run={runOnboarding}
        onFinish={handleFinishOnboarding}
      />
    </Box>
  );
};

export default Workspace;
