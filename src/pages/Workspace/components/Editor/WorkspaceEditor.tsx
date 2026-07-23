import { useState } from 'react';
import { EditorContainer, MainEditorArea } from './WorkspaceEditor.styles';

import type { WorkspaceEditorProps } from '../../types/workspace.types';
import { EditorHeader } from './components/EditorHeader/EditorHeader';
import { EditorContent } from './components/EditorContent/EditorContent';
import { EditorSidebar } from './components/EditorSidebar/EditorSidebar';

import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

import { useWorkspaceEditor } from './hooks/useWorkspaceEditor.hook';

export const WorkspaceEditor = ({
  onBack,
  setValue,
  watch,
  selectTask,
  handleSelectTask,
  handleUpdateTask,
  tasksData,
  onStartFocus,
  onOpenTaskDetails,
  isRightSidebarOpen,
  setIsRightSidebarOpen,
  getCustomSlashMenuItems,
  getWorkspaceMentionMenuItems,
  activeFocusTaskId,
  onUnlinkTask,
  saveState,
  loadMore,
}: WorkspaceEditorProps) => {
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isCentered, setIsCentered] = useState<boolean>(() => {
    return localStorage.getItem('editor_centered_mode') === 'true';
  });

  const toggleCentered = () => {
    setIsCentered((prev) => {
      localStorage.setItem('editor_centered_mode', String(!prev));
      return !prev;
    });
  };

  const {
    currentTitle,
    currentFolder,

    showPalette,
    setShowPalette,

    searchTerm,
    setSearchTerm,

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
            selectTask={selectTask}
            handleSelectTask={handleSelectTask}
            setValue={setValue}
            saveState={saveState}
            loadMore={loadMore}
            hasMore={tasksData?.hasMore}
            editor={editor}
            sourceLanguage={sourceLanguage}
            setSourceLanguage={setSourceLanguage}
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            isCentered={isCentered}
            onToggleCentered={toggleCentered}
            onToggleSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            onStartFocus={onStartFocus}
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
            targetLanguage={targetLanguage}
            isCentered={isCentered}
            toggleCentered={toggleCentered}
          />
        </MainEditorArea>

        <EditorSidebar
          isRightSidebarOpen={isRightSidebarOpen}
          setIsRightSidebarOpen={setIsRightSidebarOpen}
          selectTask={selectTask}
          handleUpdateTask={handleUpdateTask}
          onOpenTaskDetails={onOpenTaskDetails}
          onStartFocus={onStartFocus}
          activeFocusTaskId={activeFocusTaskId}
          onUnlinkTask={onUnlinkTask}
          setShowPalette={setShowPalette}
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
