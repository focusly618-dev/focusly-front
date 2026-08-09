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
import { WorkspaceEmptyState } from '@/components/ui/WorkspaceEmptyState';

export const Workspace = ({
  isEditorOpen,
  onEditorChange,
  onStartFocus,
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
    isCreatingNew,
    handleSelectWorkspace,
    handleCreateNew,
    searchParams,
    setSearchParams,
    selectedGroupId,
    loadMore,
  } = useWorkspace({ isEditorOpen, onEditorChange });

  const handleUnlinkTask = (): void => {
    handleSelectTask(null);
    setValue('taskId', null);
  };

  const isInitialLoading =
    workspacesLoading && !workspacesData && !isEditorOpen;
  if (isInitialLoading) return null;

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
                key={
                  isCreatingNew
                    ? 'new-workspace'
                    : watch('id') || 'workspace-editor'
                }
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
                isRightSidebarOpen={isSidebarOpen}
                setIsRightSidebarOpen={onSidebarChange}
                workspaces={workspacesData?.workspaces}
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
