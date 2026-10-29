import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, Tooltip } from '@mui/material';
import type { CanvasView } from '../../../../useCanvasView.hook';
import { CanvasIdentityField } from '../../../CanvasIdentity/CanvasIdentityField';

interface CanvasBreadcrumbProps {
  documentTitle: string;
  canvasView: CanvasView;
}

/** "Document / 🎨 Canvas name" in the header while a canvas is open: the
 * document's title leads back to it; the canvas's icon and name are edited
 * in the same field that named it when it was created. */
export const CanvasBreadcrumb = ({
  documentTitle,
  canvasView,
}: CanvasBreadcrumbProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
      <Tooltip
        title={t('workspaceEditor.backToDocument', 'Volver al documento')}
      >
        <ButtonBase
          onClick={canvasView.close}
          sx={{
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: 600,
            color: 'text.secondary',
            maxWidth: { md: '200px', lg: '280px' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            px: 0.75,
            py: 0.25,
            borderRadius: '6px',
            '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
          }}
        >
          {documentTitle}
        </ButtonBase>
      </Tooltip>

      <Box component="span" sx={{ color: 'text.disabled', fontSize: '14px' }}>
        /
      </Box>

      <Box sx={{ width: { md: '260px', lg: '340px' }, minWidth: 140 }}>
        <CanvasIdentityField
          icon={canvasView.icon}
          name={canvasView.title}
          onIconChange={canvasView.setIcon}
          onNameChange={canvasView.setTitle}
          size="small"
        />
      </Box>
    </Box>
  );
};
