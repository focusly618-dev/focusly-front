import { useState } from 'react';
import { Dialog, DialogContent, Box, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { CreateTaskModalProps } from './types/CreateTaskModal.types';
import {
  modalBackdropSx,
  paperPropsSx,
  dialogContentSx,
  titleInputPropsSx,
} from './CreateTaskModal.styles';
import { useCreateTaskModal } from './hooks/useCreateTaskModal.hooks';

// Sub-components
import { TaskHeader } from './components/TaskHeader/TaskHeader';
import { TaskProperties } from './components/TaskProperties/TaskProperties';
import { TaskLinksResources } from './components/TaskLinksResources/TaskLinksResources';
import { TaskDescription } from './components/TaskDescription/TaskDescription';
import { TaskFooterActions } from './components/TaskFooterActions/TaskFooterActions';
import { TaskPopovers } from './components/TaskPopovers/TaskPopovers';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export const CreateTaskModal = ({
  open,
  onClose,
  onSave,
  initialStart,
  initialTask,
  handleDelete: onDelete,
}: CreateTaskModalProps) => {
  const {
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
    loadingSave,
    setCurrentDate,
    links,
    handleAddLink,
    handleRemoveLink,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    isAddingLink,
    setIsAddingLink,
    isGeneratingMeet,
    handleGenerateMeet,
    handleTimerChange,
    hasMeetLink,
  } = useCreateTaskModal({
    onSave,
    onClose,
    initialStart,
    initialTask,
    onDelete,
  });

  // Popover anchors
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [categoryAnchor, setCategoryAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);

  // Timer Suggestions State
  const [durationSuggestions, setDurationSuggestions] = useState<string[]>([]);
  const [realTimeSuggestions, setRealTimeSuggestions] = useState<string[]>([]);
  const [durationAnchor, setDurationAnchor] = useState<HTMLDivElement | null>(
    null,
  );
  const [realTimeAnchor, setRealTimeAnchor] = useState<HTMLDivElement | null>(
    null,
  );

  // UI State
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
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
              maxHeight: 'calc(90vh - 100px)', // Adjusted height to accommodate header
              padding: '0px', // Removed padding to let header handle its own spacing
            }}
            options={{ wheelPropagation: false, suppressScrollX: true }}
          >
            <TaskHeader
              color={color}
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
              onClose={onClose}
              initialTask={initialTask}
              handleDelete={handleDelete}
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
                  InputProps={{
                    endAdornment: (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', pr: 1 }}
                      >
                        <Box
                          onClick={(e) => setColorAnchor(e.currentTarget)}
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: color || '#1e293b',
                            cursor: 'pointer',
                            border: '2px solid white',
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        />
                      </Box>
                    ),
                  }}
                />
              </Box>

              <TaskProperties
                status={status}
                setStatusAnchor={setStatusAnchor}
                priority={priority}
                setPriorityAnchor={setPriorityAnchor}
                category={category}
                setCategoryAnchor={setCategoryAnchor}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                timeSlotDisplay={timeSlotDisplay}
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
                handleTimerChange={handleTimerChange}
                durationSuggestions={durationSuggestions}
                setDurationSuggestions={setDurationSuggestions}
                durationAnchor={durationAnchor}
                setDurationAnchor={setDurationAnchor}
                realTimeSuggestions={realTimeSuggestions}
                setRealTimeSuggestions={setRealTimeSuggestions}
                realTimeAnchor={realTimeAnchor}
                setRealTimeAnchor={setRealTimeAnchor}
                errors={errors}
              />

              <TaskLinksResources
                links={links}
                handleAddLink={handleAddLink}
                handleRemoveLink={handleRemoveLink}
                newLinkTitle={newLinkTitle}
                setNewLinkTitle={setNewLinkTitle}
                newLinkUrl={newLinkUrl}
                setNewLinkUrl={setNewLinkUrl}
                isAddingLink={isAddingLink}
                setIsAddingLink={setIsAddingLink}
                hasMeetLink={hasMeetLink}
                isGeneratingMeet={isGeneratingMeet}
                handleGenerateMeet={handleGenerateMeet}
              />

              <TaskDescription
                description={description}
                setDescription={setDescription}
              />
            </Box>
          </PerfectScrollbar>
        </DialogContent>

        <TaskFooterActions
          initialTask={initialTask}
          onClose={onClose}
          handleSave={handleSave}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          loadingSave={loadingSave}
        />

        <TaskPopovers
          statusAnchor={statusAnchor}
          setStatusAnchor={setStatusAnchor}
          setStatus={setStatus}
          priorityAnchor={priorityAnchor}
          setPriorityAnchor={setPriorityAnchor}
          setPriority={(p) => setPriority(p as typeof priority)}
          categoryAnchor={categoryAnchor}
          setCategoryAnchor={setCategoryAnchor}
          setCategory={setCategory}
          colorAnchor={colorAnchor}
          setColorAnchor={setColorAnchor}
          color={color}
          setColor={setColor}
        />
      </Dialog>
    </LocalizationProvider>
  );
};
