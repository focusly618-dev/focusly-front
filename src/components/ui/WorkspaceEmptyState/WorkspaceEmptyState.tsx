import { Box, Typography } from '@mui/material';
import {
  WorkspaceContainer,
  MainContent,
  IllustrationContainer,
  RobotIcon,
  LightningBadge,
  ActionButton,
  ButtonContainer,
} from '@/pages/Workspace/Workspace.styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BoltIcon from '@mui/icons-material/Bolt';
import type { WorkspaceEmptyStateProps } from './WorkspaceEmptyState.types';
import {
  robotIconInnerSx,
  lightningIconInnerSx,
  titleSx,
  descriptionSx,
} from './WorkspaceEmptyState.styles';

export const WorkspaceEmptyState = ({ onCreate }: WorkspaceEmptyStateProps) => {
  return (
    <WorkspaceContainer>
      <MainContent>
        <IllustrationContainer>
          <Box position="relative">
            <RobotIcon>
              <SmartToyIcon sx={robotIconInnerSx} />
            </RobotIcon>
            <LightningBadge>
              <BoltIcon sx={lightningIconInnerSx} />
            </LightningBadge>
          </Box>
        </IllustrationContainer>

        <Typography variant="h4" sx={titleSx}>
          Start Your First Strategic Plan
        </Typography>

        <Typography variant="body1" sx={descriptionSx}>
          Use headers, code blocks, and lists to document your thoughts. Link
          this page to a task to sync with your schedule.
        </Typography>

        <ButtonContainer>
          <ActionButton onClick={onCreate}>CREATE A NEW PROJECT</ActionButton>
        </ButtonContainer>
      </MainContent>
    </WorkspaceContainer>
  );
};
