import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { SearchPalette } from '../SearchPalette/SearchPalette';
import type { TaskSearchItems } from '../../../../types/workspace.types';
import {
  HeaderCenter,
  HeaderLeft,
  HeaderRight,
} from '@/pages/Workspace/Workspace.styles';
import {
  BackButton,
  EditorHeader as StyledEditorHeader,
} from './EditorHeader.styles';

interface EditorHeaderProps {
  onBack: () => void;
  showPalette: boolean;
  setShowPalette: (b: boolean) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filteredTasks: TaskSearchItems[];
  selectTask: TaskSearchItems | null;
  handleSelectTask: (task: TaskSearchItems | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (field: any, value: any) => void;
}

export const EditorHeader = ({
  onBack,
  showPalette,
  setShowPalette,
  searchTerm,
  setSearchTerm,
  filteredTasks,
  selectTask,
  handleSelectTask,
  setValue,
}: EditorHeaderProps) => {
  return (
    <StyledEditorHeader>
      <HeaderLeft>
        <BackButton
          startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
          onClick={onBack}
        >
          BACK TO WORKSPACES
        </BackButton>
      </HeaderLeft>

      <HeaderCenter
        id="joyride-editor-search"
        sx={{ position: 'relative', zIndex: 50, mx: 2 }}
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
        />
      </HeaderCenter>

      <HeaderRight />
    </StyledEditorHeader>
  );
};
