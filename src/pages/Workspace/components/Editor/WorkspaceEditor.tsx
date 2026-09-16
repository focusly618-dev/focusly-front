import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { EditorContainer, MainEditorArea } from './WorkspaceEditor.styles';

import type { WorkspaceEditorProps } from '../../workspace.types';
import { EditorHeader } from './components/EditorHeader/EditorHeader';
import { EditorContent } from './components/EditorContent/EditorContent';
import { EditorSidebar } from './components/EditorSidebar/EditorSidebar';
import { SearchPalette } from './components/SearchPalette/SearchPalette';

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
  const [linkedTaskOverrides, setLinkedTaskOverrides] = useState<
    Record<string, boolean>
  >({});

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

  const workspaceId = watch('id');
  const primaryTaskId = watch('taskId');

  const linkedTasks = useMemo(() => {
    const availableTasks = tasksData?.tasks ?? [];
    const linkedTaskIds = new Set<string>();

    availableTasks.forEach((task) => {
      const belongsToWorkspace = Boolean(
        workspaceId &&
        (task.workspace_id === workspaceId ||
          task.workspaces?.some((workspace) => workspace.id === workspaceId)),
      );
      const isLegacyPrimaryTask =
        task.id === selectTask?.id && task.id === primaryTaskId;

      if (belongsToWorkspace || isLegacyPrimaryTask) {
        linkedTaskIds.add(task.id);
      }
    });

    Object.entries(linkedTaskOverrides).forEach(([taskId, isLinked]) => {
      if (isLinked) linkedTaskIds.add(taskId);
      else linkedTaskIds.delete(taskId);
    });

    const linked = availableTasks.filter((task) => linkedTaskIds.has(task.id));
    if (selectTask && linkedTaskIds.has(selectTask.id) && !linked.length) {
      return [selectTask];
    }

    return linked;
  }, [
    linkedTaskOverrides,
    primaryTaskId,
    selectTask,
    tasksData?.tasks,
    workspaceId,
  ]);

  const handleToggleLinkedTask = useCallback(
    async (task: WorkspaceEditorProps['selectTask'], isLinked: boolean) => {
      if (!task) return;

      setLinkedTaskOverrides((current) => ({
        ...current,
        [task.id]: !isLinked,
      }));

      if (!workspaceId) {
        if (!isLinked) {
          handleSelectTask(task);
          setValue('taskId', task.id, { shouldDirty: true });
        } else if (task.id === selectTask?.id) {
          onUnlinkTask?.();
        }
        return;
      }

      await handleUpdateTask(task.id, {
        workspace_id: isLinked ? null : workspaceId,
      });

      if (isLinked && task.id === selectTask?.id) {
        onUnlinkTask?.();
      }
    },
    [
      handleSelectTask,
      handleUpdateTask,
      onUnlinkTask,
      selectTask?.id,
      setValue,
      workspaceId,
    ],
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
          linkedTasks={linkedTasks}
          handleUpdateTask={handleUpdateTask}
          onStartFocus={onStartFocus}
          activeFocusTaskId={activeFocusTaskId}
          onUnlinkTask={(task) => {
            void handleToggleLinkedTask(task ?? selectTask, true);
          }}
          setShowPalette={setShowPalette}
          markdownContent={liveContent || currentContent}
          markdownEditorRef={markdownEditorRef}
        />
      </EditorContainer>

      {showPalette && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 76, md: 88 },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 'calc(100vw - 32px)', sm: 420 },
            zIndex: 1400,
          }}
        >
          <SearchPalette
            showPalette={showPalette}
            setShowPalette={setShowPalette}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredTasks={filteredTasks}
            selectTask={selectTask}
            handleSelectTask={handleSelectTask}
            setValue={setValue}
            loadMore={loadMore}
            hasMore={tasksData?.hasMore}
            linkedTaskIds={linkedTasks.map((task) => task.id)}
            onToggleTask={handleToggleLinkedTask}
          />
        </Box>
      )}

      <OnboardingWrapper
        steps={onboardingSteps}
        run={runOnboarding}
        onFinish={handleOnboardingComplete}
      />
    </>
  );
};
