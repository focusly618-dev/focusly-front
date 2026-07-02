import { useState } from 'react';
import { Dialog, DialogContent, Box, TextField, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { TaskDetailModalProps } from './types/TaskDetailModal.types';
import {
  modalBackdropSx,
  paperPropsSx,
  dialogContentSx,
  titleInputPropsSx,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.styles';
import { useTaskDetailModal } from './hooks/useTaskDetailModal.hooks';
import { improveTaskAI } from '@/api/AI/apiAIPlanner';
import { sileo } from '@/utils/sileo';

// Sub-components
import { Collaborators } from './components/Collaborators/Collaborators';
import { TaskProperties } from './components/TaskProperties/TaskProperties';
import { TaskHeader } from './components/TaskHeader/TaskHeader';
import { TaskResources } from './components/TaskResources/TaskResources';
import { TaskDescription } from './components/TaskDescription/TaskDescription';
import { TaskActions } from './components/TaskActions/TaskActions';
import { TaskWorkspaces } from './components/TaskWorkspaces/TaskWorkspaces';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const TaskDetailModal = ({
  open,
  onClose,
  onSave,
  initialStart,
  initialTask,
  handleDelete: onDelete,
  isAIScheduleEnabled,
  setIsAIScheduleEnabled,
}: TaskDetailModalProps) => {
  const {
    isReadOnly,
    isDirty,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    category,
    setCategory,
    status,
    setStatus,
    tags,
    setTags,
    newTag,
    setNewTag,
    isAddingTag,
    setIsAddingTag,
    handleSave,
    handleAddTag,
    handleUpdate,
    handleDelete,
    realTime,
    setRealTime,
    timeSlotDisplay,
    errors,
    duration,
    setDuration,
    color,
    setColor,
    currentDate,
    setCurrentDate,
    loadingSave,
    links,
    handleAddLink,
    handleRemoveLink,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    isAddingLink,
    setIsAddingLink,
    collaborators,
    handleAddCollaborator,
    isGeneratingMeet,
    handleGenerateMeet,
    handleTimerChange,
    hasMeetLink,
    createURLWorkSpace,
    handleRemoveWorkspace,
  } = useTaskDetailModal({
    onSave,
    onClose,
    initialStart,
    initialTask,
    onDelete,
    isAIScheduleEnabled,
    setIsAIScheduleEnabled,
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLinksExpanded, setIsLinksExpanded] = useState(true);
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);

  const handleImproveTask = async (
    mode: 'subtasks' | 'estimate' | 'priority' | 'all',
  ) => {
    if (!title.trim()) {
      sileo.warning({
        title: 'Título requerido',
        description:
          'Por favor escribe un título para la tarea antes de usar la IA.',
        duration: 3000,
      });
      return;
    }

    sileo.info({
      title: 'Optimizando Tarea',
      description:
        'Lumina está analizando y mejorando los campos de tu tarea...',
      duration: 3000,
    });

    try {
      const res = await improveTaskAI({ title, description, mode });

      if (mode === 'subtasks' || mode === 'all') {
        if (res.subtasks && res.subtasks.length > 0) {
          const checklistText =
            '\n\nChecklist:\n' + res.subtasks.map((s) => `☐ ${s}`).join('\n');
          setDescription((description || '') + checklistText);
        }
      }

      if (mode === 'estimate' || mode === 'all') {
        if (res.estimatedTime) {
          setDuration(res.estimatedTime);
        }
      }

      if (mode === 'priority' || mode === 'all') {
        if (res.suggestedPriority) {
          const map: Record<string, 'High' | 'Med' | 'Low'> = {
            HIGH: 'High',
            MEDIUM: 'Med',
            LOW: 'Low',
          };
          setPriority(map[res.suggestedPriority.toUpperCase()] || 'Med');
        }
      }

      sileo.success({
        title: 'Tarea Optimizada',
        description: 'Lumina ha mejorado los campos de tu tarea con éxito.',
        duration: 3000,
      });
    } catch (e) {
      console.error('Error improving task:', e);
      sileo.error({
        title: 'Error de IA',
        description: 'No se pudieron sugerir mejoras para la tarea.',
        duration: 3000,
      });
    }
  };

  const isPureGoogleTask = initialTask?.source === 'google';
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              ...paperPropsSx,
              width: isFullScreen ? '100%' : '800px',
              height: isFullScreen ? '100%' : 'auto',
              maxWidth: isFullScreen ? '100%' : '800px',
              maxHeight: isFullScreen ? '100%' : '90vh',
              margin: isFullScreen ? 0 : 2,
              borderRadius: isFullScreen ? 0 : '16px',
            },
          },
          backdrop: { sx: modalBackdropSx },
        }}
      >
        <DialogContent
          sx={{
            ...dialogContentSx,
            overflow: 'hidden !important',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': {
              display: 'none !important',
            },
            '& .ps__rail-y': {
              backgroundColor: 'transparent !important',
              border: 'none !important',
              opacity: 1,
              width: '10px !important',
              zIndex: 1000,
            },
            '& .ps__thumb-y': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.2) !important'
                  : 'rgba(0, 0, 0, 0.15) !important',
              borderRadius: '10px !important',
              width: '6px !important',
              right: '2px !important',
              transition: 'background-color 0.2s, width 0.2s !important',
            },
            '& .ps__rail-y:hover .ps__thumb-y, & .ps__rail-y.ps--clicking .ps__thumb-y':
              {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.3) !important'
                    : 'rgba(0, 0, 0, 0.25) !important',
                width: '8px !important',
              },
          }}
        >
          <PerfectScrollbar
            style={{
              maxHeight: 'calc(90vh - 100px)',
              padding: '0px',
            }}
            options={{ wheelPropagation: false, suppressScrollX: true }}
          >
            <TaskHeader
              color={color}
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
              title={title}
              onClose={onClose}
              initialTask={initialTask}
              handleDelete={handleDelete}
              isReadOnly={isReadOnly}
            />
            <Box sx={{ p: 3, pt: 1.5 }}>
              <Box sx={{ px: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Give your task a clear name..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    ...titleInputPropsSx,
                    '& .MuiOutlinedInput-root': {
                      ...titleInputPropsSx['& .MuiOutlinedInput-root'],
                      paddingRight: '12px',
                    },
                  }}
                  error={!!errors.title}
                  helperText={errors.title}
                  disabled={isReadOnly}
                  InputProps={{
                    endAdornment: (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', pr: 1 }}
                      >
                        <Box
                          onClick={(e) =>
                            !isReadOnly && setColorAnchor(e.currentTarget)
                          }
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: color || '#1e293b',
                            cursor: isReadOnly ? 'default' : 'pointer',
                            border: '2px solid white',
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: isReadOnly ? 'none' : 'scale(1.1)',
                            },
                          }}
                        />
                      </Box>
                    ),
                  }}
                />
              </Box>

              <TaskProperties
                isOwner={initialTask ? initialTask.is_owner : true}
                status={status}
                setStatus={setStatus}
                priority={priority}
                setPriority={setPriority}
                category={category}
                setCategory={setCategory}
                color={color}
                setColor={setColor}
                colorAnchor={colorAnchor}
                setColorAnchor={setColorAnchor}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                tags={tags}
                setTags={setTags}
                newTag={newTag}
                setNewTag={setNewTag}
                isAddingTag={isAddingTag}
                setIsAddingTag={setIsAddingTag}
                handleAddTag={handleAddTag}
                duration={duration}
                setDuration={setDuration}
                realTime={realTime}
                setRealTime={setRealTime}
                isPureGoogleTask={isPureGoogleTask}
                timeSlotDisplay={timeSlotDisplay}
                handleTimerChange={handleTimerChange}
                createdAt={initialTask?.created_at}
              />

              <TaskResources
                links={links}
                isLinksExpanded={isLinksExpanded}
                setIsLinksExpanded={setIsLinksExpanded}
                isGeneratingMeet={isGeneratingMeet}
                handleGenerateMeet={handleGenerateMeet}
                hasMeetLink={hasMeetLink}
                setIsAddingLink={setIsAddingLink}
                isAddingLink={isAddingLink}
                newLinkTitle={newLinkTitle}
                setNewLinkTitle={setNewLinkTitle}
                newLinkUrl={newLinkUrl}
                setNewLinkUrl={setNewLinkUrl}
                handleAddLink={handleAddLink}
                handleRemoveLink={handleRemoveLink}
                isReadOnly={isReadOnly}
              />

              <Collaborators
                collaborators={collaborators}
                handleAddCollaborator={handleAddCollaborator}
                isReadOnly={isReadOnly}
              />

              <TaskWorkspaces
                workspaces={initialTask?.workspaces}
                onNavigate={createURLWorkSpace}
                onRemove={handleRemoveWorkspace}
                isReadOnly={isReadOnly}
              />

              <TaskDescription
                description={description}
                setDescription={setDescription}
                isReadOnly={isReadOnly}
              />
            </Box>
          </PerfectScrollbar>
        </DialogContent>

        <TaskActions
          initialTask={initialTask}
          isDirty={isDirty}
          handleDelete={handleDelete}
          onClose={onClose}
          handleUpdate={handleUpdate}
          handleSave={handleSave}
          loadingSave={loadingSave}
          isReadOnly={isReadOnly}
          handleImproveTask={handleImproveTask}
          disabled={!title.trim() || !duration.trim()}
        />
      </Dialog>
    </LocalizationProvider>
  );
};
