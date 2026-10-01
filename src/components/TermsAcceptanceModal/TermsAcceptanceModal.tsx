import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { GavelRounded as GavelIcon } from '@mui/icons-material';
import { BaseModal } from '@/components/modals';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, updateUser } from '@/redux/auth/auth.slice';
import {
  UserAcceptTerms,
  UserGet,
  type UserResponse,
} from '@/api/User/apiUser';
import { sileo } from '@/utils';

// The legal pages must stay readable while this modal is pending (its links
// open them in a new tab), so it never renders on top of them.
const LEGAL_PATHS = ['/terms', '/privacy'];

const legalLink = (href: string) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: 'inherit', fontWeight: 700 }}
  />
);

const termsState = (user: UserResponse) => ({
  termsVersion: user.termsVersion ?? null,
  termsAcceptedAt: user.termsAcceptedAt ?? null,
  needsTermsAcceptance: Boolean(user.needsTermsAcceptance),
});

/**
 * Blocks the app until the logged-in user has accepted the current Terms and
 * Privacy Notice. The backend owns the current version, so the user is
 * re-fetched once per session (the copy in localStorage may predate it).
 */
export const TermsAcceptanceModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLogged, user } = useAppSelector((state) => state.auth);
  const userId = user?.id;

  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLogged || !userId) {
      setOpen(false);
      return;
    }

    let cancelled = false;
    UserGet(userId)
      .then((fresh) => {
        if (cancelled) return;
        dispatch(updateUser(termsState(fresh)));
        setIsUpdate(Boolean(fresh.termsVersion));
        setOpen(Boolean(fresh.needsTermsAcceptance));
      })
      .catch(() => {
        // Don't lock the user out over a failed check; it runs again on the
        // next session.
      });

    return () => {
      cancelled = true;
    };
  }, [isLogged, userId, dispatch]);

  const handleAccept = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const updated = await UserAcceptTerms(userId);
      dispatch(updateUser(termsState(updated)));
      setOpen(false);
    } catch {
      sileo.error({
        title: t('legal.acceptModal.error'),
        fill: 'var(--sileo-error-bg)',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setOpen(false);
    await dispatch(logout());
    navigate('/login');
  };

  if (!open || LEGAL_PATHS.includes(pathname)) return null;

  return (
    <BaseModal
      open
      // Acceptance is required: the modal can't be dismissed without a choice.
      onClose={() => {}}
      hideCloseButton
      maxWidth={480}
      title={t('legal.acceptModal.title')}
      subtitle={t('legal.acceptModal.subtitle')}
      icon={<GavelIcon sx={{ color: '#008767' }} />}
      iconBgColor="rgba(0, 135, 103, 0.12)"
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            disabled={isSaving}
          >
            {t('legal.acceptModal.logout')}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAccept}
            disabled={isSaving}
          >
            {t('legal.acceptModal.accept')}
          </Button>
        </Box>
      }
    >
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
      >
        <Trans
          i18nKey={
            isUpdate
              ? 'legal.acceptModal.updatedBody'
              : 'legal.acceptModal.newBody'
          }
          components={{
            terms: legalLink('/terms'),
            privacy: legalLink('/privacy'),
          }}
        />
      </Typography>
    </BaseModal>
  );
};
