import { useState, useEffect } from 'react';
import { Dialog, Box } from '@mui/material';
import {
  AutoAwesome as SparklesIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';

import { CURRENT_RELEASE_VERSION, releaseData } from './ReleaseModal.utils';
import {
  ModalContainer,
  IconWrapper,
  Title,
  DividerLine,
  Description,
  FeatureCard,
  FeatureText,
  AcceptButton,
} from './ReleaseModal.styles';

export const ReleaseModal = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };
  useEffect(() => {
    // Only show if user is logged in
    if (!user) return;

    const lastSeenVersion = localStorage.getItem('focusly_last_seen_version');

    if (lastSeenVersion !== CURRENT_RELEASE_VERSION) {
      setTimeout(() => handleOpen(), 30);
    }
  }, [user]);

  const handleAccept = () => {
    localStorage.setItem('focusly_last_seen_version', CURRENT_RELEASE_VERSION);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleAccept}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backgroundImage: 'none',
          overflow: 'visible',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      <ModalContainer>
        <IconWrapper>
          <SparklesIcon sx={{ fontSize: 28 }} />
        </IconWrapper>

        <Title>{releaseData.title}</Title>
        <DividerLine />

        <Description>{releaseData.description}</Description>

        {releaseData.features.map((feature, idx) => (
          <FeatureCard key={idx}>
            {feature.icon}
            <FeatureText>{feature.text}</FeatureText>
          </FeatureCard>
        ))}

        <Box
          sx={{
            width: '100%',
            mt: 1,
            p: '4px',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '16px',
          }}
        >
          <AcceptButton onClick={handleAccept} disableElevation>
            Accept <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </AcceptButton>
        </Box>
      </ModalContainer>
    </Dialog>
  );
};
