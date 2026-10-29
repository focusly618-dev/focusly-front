import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { VisibilityOutlined as ViewIcon } from '@mui/icons-material';

/** Over a canvas opened on a phone: it can be looked at and moved around,
 * not edited. Lets touches through to the canvas under it. */
export const CanvasReadOnlyNotice = () => {
  const { t } = useTranslation();

  return (
    <Box
      role="status"
      sx={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        maxWidth: 'calc(100% - 32px)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        pointerEvents: 'none',
      }}
    >
      <ViewIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary' }}
        >
          {t(
            'workspaceEditor.canvases.readOnlyPhone',
            'Solo lectura en el teléfono',
          )}
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
          {t(
            'workspaceEditor.canvases.readOnlyPhoneDesc',
            'Ábrelo en una computadora para editarlo.',
          )}
        </Typography>
      </Box>
    </Box>
  );
};
