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
import {
  PrecisionManufacturingOutlined as FocusIcon,
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
  SliderHeader,
  SliderLabel,
  SliderValue,
  PremiumSlider,
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
  const theme = useTheme();

  // Focus engine states
  const [focusLength, setFocusLength] = useState<number>(50);
  const [breakLength, setBreakLength] = useState<number>(5);

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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            mb: 0.5,
            letterSpacing: '-0.01em',
          }}
        >
          Build your focus environment
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Tailor how the AI schedules your tasks and safeguards your
          concentration.
        </Typography>
      </Box>

      {/* Focus & Break Blocks */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <FocusIcon />
            </Box>
            <Typography>Session Duration</Typography>
          </SectionTitle>
        </SectionHeader>

        {/* Focus Block Slider */}
        <Box sx={{ mb: 4 }}>
          <SliderHeader>
            <SliderLabel>Focus Block Length</SliderLabel>
            <SliderValue>{focusLength} min</SliderValue>
          </SliderHeader>
          <PremiumSlider
            value={focusLength}
            onChange={(_e, val) => setFocusLength(val as number)}
            min={25}
            max={90}
            step={5}
            valueLabelDisplay="off"
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mt: -0.5 }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              25 min
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              90 min
            </Typography>
          </Box>
        </Box>

        {/* Break Block Slider */}
        <Box sx={{ mb: 2 }}>
          <SliderHeader>
            <SliderLabel>Short Break Duration</SliderLabel>
            <SliderValue>{breakLength} min</SliderValue>
          </SliderHeader>
          <PremiumSlider
            value={breakLength}
            onChange={(_e, val) => setBreakLength(val as number)}
            min={3}
            max={15}
            step={1}
            valueLabelDisplay="off"
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mt: -0.5 }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              3 min
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              15 min
            </Typography>
          </Box>
        </Box>
      </SectionCard>

      {/* Focus Shield */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper" sx={{ color: '#EF4444' }}>
              <BlockIcon />
            </Box>
            <Typography>Focus Shield</Typography>
          </SectionTitle>
          <Badge sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}>
            Active
          </Badge>
        </SectionHeader>

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
                <ShieldLabel>Social Media</ShieldLabel>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block' }}
                >
                  Block Twitter, Instagram, Facebook
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
                <ShieldLabel>News & Media</ShieldLabel>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block' }}
                >
                  Block YouTube, Netflix, Reddit
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
          <BlocklistTitle>Blocked Websites</BlocklistTitle>
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
              placeholder="e.g. facebook.com"
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
              Add
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
            <Typography>Deep Lock Mode</Typography>
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
              Enable Lockout System
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block' }}
            >
              When enabled, ending a focus session requires intentional, timed
              action. This reinforces concentration habits and prevents impulse
              cancellation.
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
            <Typography>Calendar Protection</Typography>
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
                Google Calendar Sync
              </Typography>
              <CheckedIcon sx={{ color: '#22C55E', fontSize: 18 }} />
            </Stack>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
            >
              Focus blocks automatically protect your calendar availability by
              declining new meetings.
            </Typography>
          </Box>
          <Badge sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}>
            Connected
          </Badge>
        </Box>
      </SectionCard>
    </Box>
  );
};
