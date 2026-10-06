import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, alpha } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useBilling } from '@/hooks/useBilling';

const BRAND = '#008767';

/** In place of the input on the free plan: the editor assistant is Pro. */
export const EditorProGate = () => {
  const { t } = useTranslation();
  const { openUpgrade } = useBilling();
  return (
    <Box
      role="region"
      aria-label={t('billing.editorGate.title')}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
        p: 1.75,
        borderRadius: '12px',
        border: `1px solid ${alpha(BRAND, 0.3)}`,
        bgcolor: alpha(BRAND, 0.06),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <LockIcon sx={{ fontSize: 16, color: BRAND }} />
        <Typography sx={{ fontWeight: 750, fontSize: '13.5px' }}>
          {t('billing.editorGate.title')}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '12.5px' }}
      >
        {t('billing.editorGate.body')}
      </Typography>
      <Button
        size="small"
        variant="contained"
        onClick={() => openUpgrade('editor')}
        sx={{
          mt: 0.5,
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 700,
          bgcolor: BRAND,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#007357', boxShadow: 'none' },
        }}
      >
        {t('billing.editorGate.cta')}
      </Button>
    </Box>
  );
};
