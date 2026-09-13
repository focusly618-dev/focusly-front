import { useCallback, useState } from 'react';
import { EditorContainer, MainEditorArea } from './WorkspaceEditor.styles';

import type { WorkspaceEditorProps } from '../../workspace.types';
import { EditorHeader } from './components/EditorHeader/EditorHeader';
import { EditorContent } from './components/EditorContent/EditorContent';
import { EditorSidebar } from './components/EditorSidebar/EditorSidebar';

import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';
import { useWorkspaceEditor } from './useWorkspaceEditor.hook';

export const WorkspaceEditor = ({
  onBack,
  setValue,
  watch,
  selectTask,
  handleSelectTask,
  handleUpdateTask,
  tasksData,
  onStartFocus,
  isRightSidebarOpen,
  setIsRightSidebarOpen,
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
    currentContent,
    currentFolder,
    currentEmoji,

    showPalette,
    setShowPalette,

    searchTerm,
    setSearchTerm,

    filteredTasks,

    initialMarkdown,
    markdownEditorRef,

    onboardingSteps,
    runOnboarding,
    handleOnboardingComplete,
  } = useWorkspaceEditor({
    watch,
    tasksData,
  });

  const [prevContent, setPrevContent] = useState(currentContent);
  const [liveContent, setLiveContent] = useState<string>(currentContent || '');

  if (currentContent !== prevContent) {
    setPrevContent(currentContent);
    setLiveContent(currentContent || '');
  }

  const [prevTitle, setPrevTitle] = useState(currentTitle);
  const [liveTitle, setLiveTitle] = useState<string>(currentTitle || '');

  if (currentTitle !== prevTitle) {
    setPrevTitle(currentTitle);
    setLiveTitle(currentTitle || '');
  }

  const handleContentChange = useCallback(
    (markdown: string) => {
      setLiveContent(markdown);
      setValue('content', markdown, { shouldDirty: true });
    },
    [setValue],
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      setLiveTitle(title);
      setValue('title', title, { shouldDirty: true });
    },
    [setValue],
  );

  return (
    <>
      <EditorContainer>
        <MainEditorArea>
          <EditorHeader
            onBack={onBack}
            currentFolder={currentFolder}
            currentTitle={liveTitle || currentTitle}
            isRightSidebarOpen={isRightSidebarOpen}
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
            markdownEditorRef={markdownEditorRef}
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
            currentTitle={liveTitle || currentTitle}
            setTitle={handleTitleChange}
            initialMarkdown={initialMarkdown}
            markdownEditorRef={markdownEditorRef}
            onChange={handleContentChange}
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
          currentFolder={currentFolder}
          currentTitle={liveTitle || currentTitle}
          currentEmoji={currentEmoji}
          selectTask={selectTask}
          handleUpdateTask={handleUpdateTask}
          onStartFocus={onStartFocus}
          activeFocusTaskId={activeFocusTaskId}
          onUnlinkTask={onUnlinkTask}
          setShowPalette={setShowPalette}
          markdownContent={liveContent || currentContent}
          markdownEditorRef={markdownEditorRef}
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
