import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, IconButton, Typography, alpha } from '@mui/material';
import {
  CheckCircleRounded as DoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { LuminaAnimatedFace } from '@/components/ui';
import { surfaceColor } from '@/context';
import { aiStreamService } from '@/services/aiStreamService';
import {
  editorAssistantService,
  type BackgroundActivity,
} from '@/services/editorAssistantService';
import { TaskBar } from '@/pages/Home/components/Sidebar/types/Sidebar.types';

const BRAND = '#008767';

const subscribeMainChat = (onChange: () => void) =>
  aiStreamService.subscribe(() => onChange());

/**
 * Editor assistant replies still writing — or finished — while their document
 * isn't open. Shown on every page, so leaving the editor never hides that
 * Lumina is still working; a click goes back to the document.
 */
export const EditorAIBackgroundIndicator = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const activity = useSyncExternalStore(
    editorAssistantService.subscribe,
    editorAssistantService.getBackgroundActivity,
  );
  // The main chat's own indicator sits in the same corner.
  const mainChatGenerating = useSyncExternalStore(subscribeMainChat, () =>
    aiStreamService.isGenerating(),
  );

  if (activity.length === 0) return null;

  const openDocument = (item: BackgroundActivity) => {
    editorAssistantService.setOpen(item.key, true);
    const params = new URLSearchParams({
      tab: TaskBar.Workspace,
      workspaceId: item.workspaceId,
    });
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'fixed',
        right: { xs: 12, sm: 24 },
        bottom: mainChatGenerating ? 88 : 24,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
        maxWidth: 'calc(100vw - 24px)',
      }}
    >
      {activity.map((item) => {
        const title = item.documentTitle.trim() || t('editorAI.untitled');
        const writing = item.status === 'writing';
        return (
          <Box
            key={item.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              pl: 0.5,
              pr: writing ? 0.5 : 0.25,
              borderRadius: 999,
              bgcolor: (theme) =>
                surfaceColor(
                  theme,
                  'rgba(15, 15, 22, 0.9)',
                  'rgba(36, 36, 37, 0.92)',
                  'rgba(255, 255, 255, 0.95)',
                ),
              backdropFilter: 'blur(16px)',
              border: `1px solid ${alpha(BRAND, 0.4)}`,
              boxShadow: `0 10px 28px ${alpha('#000', 0.25)}`,
              animation: 'editorAiBgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              '@keyframes editorAiBgIn': {
                from: { opacity: 0, transform: 'translateY(12px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <ButtonBase
              onClick={() => openDocument(item)}
              aria-label={t('editorAI.background.open', { title })}
              sx={{
                gap: 1.25,
                px: 1.25,
                py: 1,
                borderRadius: 999,
                fontFamily: 'inherit',
                textAlign: 'left',
                minWidth: 0,
              }}
            >
              {writing ? (
                <LuminaAnimatedFace size={20} primaryColor={BRAND} />
              ) : (
                <DoneIcon sx={{ fontSize: 20, color: BRAND }} />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    color: BRAND,
                  }}
                >
                  {writing
                    ? t('editorAI.background.writing')
                    : t('editorAI.background.done')}
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '11px',
                    lineHeight: 1.25,
                    color: 'text.secondary',
                    maxWidth: 220,
                  }}
                >
                  {t('editorAI.background.in', { title })}
                </Typography>
              </Box>
            </ButtonBase>
            {!writing && (
              <IconButton
                size="small"
                aria-label={t('editorAI.background.dismiss')}
                onClick={() => editorAssistantService.dismissActivity(item.key)}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
