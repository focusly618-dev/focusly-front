import { Box, IconButton, Slide, Stack, Typography, useTheme } from '@mui/material';
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { dismissSessionExpiredNotice } from '@/redux/auth/auth.slice';
import {
  bannerWrapperSx,
  bannerCardSx,
  contentStackSx,
  iconWrapperSx,
  textContainerSx,
  titleSx,
  descriptionSx,
  dismissButtonSx,
} from './SessionExpiredBanner.styles';

export const SessionExpiredBanner = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((state) => state.auth.sessionExpiredNotice);
  const isDark = theme.palette.mode === 'dark';

  return (
    <Slide direction="down" in={isVisible} mountOnEnter unmountOnExit>
      <Box sx={bannerWrapperSx}>
        <Box sx={bannerCardSx(theme, isDark)}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={contentStackSx}>
            <Box sx={iconWrapperSx(theme, isDark)}>
              <HistoryToggleOffRoundedIcon fontSize="small" />
            </Box>

            <Box sx={textContainerSx}>
              <Typography sx={titleSx(theme)}>
                Your session has expired. Please sign in again.
              </Typography>
              <Typography sx={descriptionSx(theme)}>
                For security, we signed you out and redirected you to login.
              </Typography>
            </Box>

            <IconButton
              aria-label="Dismiss session expired banner"
              onClick={() => dispatch(dismissSessionExpiredNotice())}
              size="small"
              sx={dismissButtonSx(theme, isDark)}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Slide>
  );
};
