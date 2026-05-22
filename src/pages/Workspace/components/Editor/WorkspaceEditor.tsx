import { EditorContainer, MainEditorArea } from './WorkspaceEditor.styles';

import type { WorkspaceEditorProps } from '../../types/workspace.types';
import { EditorHeader } from './components/EditorHeader/EditorHeader';
import { EditorContent } from './components/EditorContent/EditorContent';
import { EditorSidebar } from './components/EditorSidebar/EditorSidebar';

import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// Hook
import { useWorkspaceEditor } from './hooks/useWorkspaceEditor.hook';

export const WorkspaceEditor = ({
  onBack,
  setValue,
  watch,
  selectTask,
  handleSelectTask,
  handleUpdateTask,
  tasksData,
  selectedSubtaskIndex,
  onStartFocus,
  onOpenTaskDetails,
  isRightSidebarOpen,
  setIsRightSidebarOpen,
  getCustomSlashMenuItems,
  getWorkspaceMentionMenuItems,
  activeFocusTaskId,
  onUnlinkTask,
}: WorkspaceEditorProps) => {
  const {
    currentTitle,
    currentFolder,

    showPalette,
    setShowPalette,

    searchTerm,
    setSearchTerm,

    filterTab,
    setFilterTab,

    filteredTasks,

    editor,

    onboardingSteps,
    runOnboarding,
    handleOnboardingComplete,
  } = useWorkspaceEditor({
    watch,
    tasksData,
  });

  return (
    <>
      <EditorContainer>
        <MainEditorArea>
          <EditorHeader
            onBack={onBack}
            showPalette={showPalette}
            setShowPalette={setShowPalette}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredTasks={filteredTasks}
            filterTab={filterTab}
            setFilterTab={setFilterTab}
            selectTask={selectTask}
            selectedSubtaskIndex={selectedSubtaskIndex}
            handleSelectTask={handleSelectTask}
            setValue={setValue}
          />

          <EditorContent
            currentFolder={currentFolder}
            currentTitle={currentTitle}
            setTitle={(title) => setValue('title', title)}
            editor={editor}
            onContentChange={() => {
              setValue('content', JSON.stringify(editor.document));
            }}
            getCustomSlashMenuItems={getCustomSlashMenuItems}
            getWorkspaceMentionMenuItems={getWorkspaceMentionMenuItems}
            setValue={setValue}
            watch={watch}
          />
        </MainEditorArea>

        <EditorSidebar
          isRightSidebarOpen={isRightSidebarOpen}
          setIsRightSidebarOpen={setIsRightSidebarOpen}
          selectedSubtaskIndex={selectedSubtaskIndex}
          selectTask={selectTask}
          handleUpdateTask={handleUpdateTask}
          onOpenTaskDetails={onOpenTaskDetails}
          onStartFocus={onStartFocus}
          activeFocusTaskId={activeFocusTaskId}
          onUnlinkTask={onUnlinkTask}
        />
      </EditorContainer>

      <OnboardingWrapper
        steps={onboardingSteps}
        run={runOnboarding}
        onFinish={handleOnboardingComplete}
      />
    </>
  );
};
