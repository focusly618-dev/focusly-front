import { useState } from 'react';
import {
  Box,
  Switch,
  Typography,
  Button,
  TextField,
  IconButton,
  useTheme,
  Stack,
} from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import {
  BlockOutlined as BlockIcon,
  Security as StrictIcon,
  CalendarMonthOutlined as CalendarIcon,
  Language as GlobeIcon,
  DeleteOutline as DeleteIcon,
  CheckCircle as CheckedIcon,
  SocialDistance as SocialIcon,
  Tv as MediaIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  ShieldGrid,
  ShieldItemCard,
  ShieldInfo,
  ShieldLabel,
  BlocklistPanel,
  BlocklistTitle,
  BlocklistItem,
  BlocklistDomain,
  Badge,
} from '../Settings.styles';

export const FocusEngineSettings = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [blockSocial, setBlockSocial] = useState(true);
  const [blockEntertainment, setBlockEntertainment] = useState(true);
  const [deepLockMode, setDeepLockMode] = useState(false);

  const [blockedWebsites, setBlockedWebsites] = useState<string[]>([
    'twitter.com',
    'youtube.com',
  ]);
  const [newWebsite, setNewWebsite] = useState('');

  const handleAddWebsite = () => {
    if (newWebsite.trim() && !blockedWebsites.includes(newWebsite.trim())) {
      setBlockedWebsites((prev) => [...prev, newWebsite.trim()]);
      setNewWebsite('');
    }
  };

  const handleRemoveWebsite = (domain: string) => {
    setBlockedWebsites((prev) => prev.filter((site) => site !== domain));
  };

  const switchStyles = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#6366F1',
      '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#6366F1',
    },
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontSize: '0.85rem',
      backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
      '& fieldset': {
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.06)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(99, 102, 241, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366F1',
      },
    },
    '& .MuiInputBase-input': {
      color: 'text.primary',
    },
  };

  return (
    <Box>
      {/* Focus Shield */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper" sx={{ color: '#EF4444' }}>
              <BlockIcon />
            </Box>
            <Typography>{t('focusEngineSettings.shield.title')}</Typography>
          </SectionTitle>
          <Badge sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}>
            {t('common.active')}
          </Badge>
        </SectionHeader>

        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '8px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.08)'
                : 'rgba(99, 102, 241, 0.04)',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: '18px', mt: -0.25 }}>🔌</Typography>
          <Box>
            <Typography
              variant="body2"
              fontWeight={650}
              color="text.primary"
              sx={{ mb: 0.5 }}
            >
              {t('focusEngineSettings.shield.bannerTitle')}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', lineHeight: 1.5 }}
            >
              <Trans
                i18nKey="focusEngineSettings.shield.bannerDesc"
                components={{
                  companionLink: (
                    <a
                      href="#"
                      style={{
                        color: '#6366F1',
                        fontWeight: 600,
                        textDecoration: 'underline',
                      }}
                    />
                  ),
                }}
              />
            </Typography>
          </Box>
        </Box>

        <ShieldGrid sx={{ mb: 4 }}>
          {/* Social Media Block */}
          <ShieldItemCard
            active={blockSocial}
            onClick={() => setBlockSocial(!blockSocial)}
          >
            <ShieldInfo>
              <SocialIcon
                sx={{ color: blockSocial ? '#6366F1' : 'text.secondary' }}
              />
              <Box>
                <ShieldLabel>
                  {t('focusEngineSettings.shield.social.label')}
                </ShieldLabel>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block' }}
                >
                  {t('focusEngineSettings.shield.social.desc')}
                </Typography>
              </Box>
            </ShieldInfo>
            <Switch
              checked={blockSocial}
              size="small"
              sx={switchStyles}
              readOnly
            />
          </ShieldItemCard>

          {/* Entertainment Block */}
          <ShieldItemCard
            active={blockEntertainment}
            onClick={() => setBlockEntertainment(!blockEntertainment)}
          >
            <ShieldInfo>
              <MediaIcon
                sx={{
                  color: blockEntertainment ? '#6366F1' : 'text.secondary',
                }}
              />
              <Box>
                <ShieldLabel>
                  {t('focusEngineSettings.shield.media.label')}
                </ShieldLabel>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block' }}
                >
                  {t('focusEngineSettings.shield.media.desc')}
                </Typography>
              </Box>
            </ShieldInfo>
            <Switch
              checked={blockEntertainment}
              size="small"
              sx={switchStyles}
              readOnly
            />
          </ShieldItemCard>
        </ShieldGrid>

        {/* Custom Blocklist Panel */}
        <BlocklistPanel>
          <BlocklistTitle>
            {t('focusEngineSettings.shield.blocklistTitle')}
          </BlocklistTitle>
          <Box sx={{ mb: 2 }}>
            {blockedWebsites.map((site) => (
              <BlocklistItem key={site}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GlobeIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                  <BlocklistDomain>{site}</BlocklistDomain>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveWebsite(site)}
                >
                  <DeleteIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                </IconButton>
              </BlocklistItem>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              size="small"
              fullWidth
              placeholder={t('focusEngineSettings.shield.placeholder')}
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              sx={inputStyles}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddWebsite}
              sx={{
                bgcolor: 'text.primary',
                color: 'background.paper',
                borderRadius: '8px',
                px: 3,
                boxShadow: 'none',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#111827',
                  boxShadow: 'none',
                },
              }}
            >
              {t('common.add')}
            </Button>
          </Box>
        </BlocklistPanel>
      </SectionCard>

      {/* Deep Lock Mode (Strict Mode) */}
      <SectionCard sx={{ border: '1px solid rgba(239, 68, 68, 0.15)' }}>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper" sx={{ color: '#EF4444' }}>
              <StrictIcon />
            </Box>
            <Typography>{t('focusEngineSettings.deepLock.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ maxWidth: '80%' }}>
            <Typography
              sx={{
                fontSize: '0.925rem',
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {t('focusEngineSettings.deepLock.enableTitle')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block' }}
            >
              {t('focusEngineSettings.deepLock.enableDesc')}
            </Typography>
          </Box>
          <Switch
            checked={deepLockMode}
            onChange={(e) => setDeepLockMode(e.target.checked)}
            sx={switchStyles}
          />
        </Box>
      </SectionCard>

      {/* Calendar Protection */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <CalendarIcon />
            </Box>
            <Typography>{t('focusEngineSettings.calendar.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            borderRadius: '16px',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(34, 197, 94, 0.08)'
                : 'rgba(34, 197, 94, 0.03)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'}`,
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  color: 'text.primary',
                }}
              >
                {t('focusEngineSettings.calendar.syncTitle')}
              </Typography>
              <CheckedIcon sx={{ color: '#22C55E', fontSize: 18 }} />
            </Stack>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
            >
              {t('focusEngineSettings.calendar.syncDesc')}
            </Typography>
          </Box>
          <Badge sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}>
            {t('common.connected')}
          </Badge>
        </Box>
      </SectionCard>
    </Box>
  );
};
