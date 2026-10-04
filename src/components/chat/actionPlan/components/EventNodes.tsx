import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  EventOutlined as EventIcon,
  EditCalendarOutlined as EventUpdateIcon,
  EventBusyOutlined as EventDeleteIcon,
  CalendarMonthOutlined as CalendarIcon,
  TimerOutlined as TimerIcon,
  VideocamOutlined as MeetIcon,
  GroupOutlined as GuestsIcon,
  PlaceOutlined as PlaceIcon,
  NotesRounded as NotesIcon,
  LinkOff as BlockedIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { ReplyMarkdown } from '@/components/chat/ReplyMarkdown';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';
import { cleanEmails } from '../eventBody';
import {
  eventGuests,
  eventMinutes,
  existingEventTimes,
  findCalendarEvent,
  formatEventTimes,
  hasMeetLink,
  newEventTimes,
  updatedEventTimes,
} from '../eventPreview';
import { formatMinutes, toDateTimeInput } from '../planFormat';
import {
  DetailLabel,
  LinkButton,
  MarkdownBox,
  MetaChip,
} from '../ActionPlan.styles';
import { PlanItem } from './PlanItem';
import { ChangeList, type Change } from './ChangeList';
import { itemState, type NodeProps } from './nodeState';

const GOOGLE_BLUE = '#4285F4';
const MEET_GREEN = '#00897B';
const DANGER = '#EF4444';
const WARNING = '#F59E0B';

type EventNodeProps = NodeProps & { index: number };

/* ── Shared pieces ────────────────────────────────────────────────────── */

interface GuestEntry {
  email: string;
  status?: string;
  mark?: '+' | '−';
}

const RESPONSES = ['accepted', 'declined', 'tentative', 'needsAction'];

const GuestList = ({
  guests,
  label,
}: {
  guests: GuestEntry[];
  label: string;
}) => {
  const { t } = useTranslation();
  if (guests.length === 0) return null;
  return (
    <Box>
      <DetailLabel>{label}</DetailLabel>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {guests.map((guest) => (
          <Box
            component="li"
            key={`${guest.mark ?? ''}${guest.email}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.35,
              fontSize: '0.82rem',
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: guest.mark === '−' ? DANGER : GOOGLE_BLUE,
                bgcolor:
                  guest.mark === '−' ? `${DANGER}1F` : `${GOOGLE_BLUE}1F`,
              }}
            >
              {guest.mark ?? guest.email[0]}
            </Box>
            <Box
              component="span"
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textDecoration: guest.mark === '−' ? 'line-through' : 'none',
              }}
            >
              {guest.email}
            </Box>
            {guest.status && RESPONSES.includes(guest.status) && (
              <Typography variant="caption" color="text.secondary">
                {t(`actionPlan.event.response.${guest.status}`)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Notice = ({ tone, children }: { tone?: string; children: string }) => (
  <Typography
    variant="caption"
    component="p"
    sx={{ m: 0, mt: 0.5, color: tone ?? 'text.secondary' }}
  >
    {children}
  </Typography>
);

const Description = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <DetailLabel>
        <NotesIcon sx={{ fontSize: 13, verticalAlign: '-2px', mr: 0.5 }} />
        {t('actionPlan.fields.description')}
      </DetailLabel>
      <MarkdownBox>
        <ReplyMarkdown>{text}</ReplyMarkdown>
      </MarkdownBox>
    </Box>
  );
};

/** Why a calendar action can't run, and where to fix it. */
const ConnectCalendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box sx={{ mt: 0.5 }}>
      <Notice tone="warning.main">{t('actionPlan.event.connectHint')}</Notice>
      <LinkButton
        onClick={() => navigate('/profile/integrations')}
        sx={{ ml: -0.75 }}
      >
        <CalendarIcon />
        {t('actionPlan.event.connect')}
      </LinkButton>
    </Box>
  );
};

/** "Open in Google Calendar" / "Join Meet" once the event exists. */
const EventLinks = ({ plan, index }: EventNodeProps) => {
  const { t } = useTranslation();
  const links = plan.links[index];
  if (plan.statuses[index] !== 'done' || !links) return null;
  const open = (url: string) => window.open(url, '_blank', 'noopener');
  return (
    <Box
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, ml: -0.75 }}
    >
      {links.url && (
        <LinkButton onClick={() => open(links.url!)}>
          <OpenIcon />
          {t('actionPlan.open.calendar')}
        </LinkButton>
      )}
      {links.meetUrl && (
        <LinkButton onClick={() => open(links.meetUrl!)}>
          <MeetIcon />
          {t('actionPlan.open.meet')}
        </LinkButton>
      )}
    </Box>
  );
};

const MeetChip = () => {
  const { t } = useTranslation();
  return (
    <MetaChip accent={MEET_GREEN}>
      <MeetIcon />
      {t('actionPlan.event.meet')}
    </MetaChip>
  );
};

const BlockedChip = () => {
  const { t } = useTranslation();
  return (
    <MetaChip accent={WARNING}>
      <BlockedIcon />
      {t('actionPlan.event.needsCalendar')}
    </MetaChip>
  );
};

const eventTitle = (
  event: GoogleCalendarEvent | undefined,
  fallback: string | undefined,
  t: (key: string) => string,
) => event?.title || fallback || t('actionPlan.event.unknown');

/* ── New event ────────────────────────────────────────────────────────── */

export const EventNode = ({ plan, index }: EventNodeProps) => {
  const { t, i18n } = useTranslation();
  const action = plan.effectiveAction(index);
  const { payload } = action;
  const times = newEventTimes(payload);
  const minutes = eventMinutes(times);
  const when = formatEventTimes(
    times,
    i18n.language,
    t('actionPlan.event.allDay'),
  );
  const guests = cleanEmails(payload.attendees);
  const blocked = plan.isBlocked(index);

  return (
    <PlanItem
      {...itemState(plan, index)}
      icon={<EventIcon />}
      iconColor={GOOGLE_BLUE}
      title={payload.title || t('actionPlan.event.untitled')}
      meta={
        <>
          {when && (
            <MetaChip accent={GOOGLE_BLUE}>
              <CalendarIcon />
              {when}
            </MetaChip>
          )}
          {minutes !== null && (
            <MetaChip>
              <TimerIcon />
              {formatMinutes(minutes)}
            </MetaChip>
          )}
          {payload.meet && <MeetChip />}
          {guests.length > 0 && (
            <MetaChip>
              <GuestsIcon />
              {t('actionPlan.event.guests', { count: guests.length })}
            </MetaChip>
          )}
          {payload.location && (
            <MetaChip>
              <PlaceIcon />
              {payload.location}
            </MetaChip>
          )}
          {blocked && <BlockedChip />}
        </>
      }
      defaultExpanded={guests.length > 0}
      details={
        guests.length > 0 || payload.description || payload.meet ? (
          <>
            <GuestList
              label={t('actionPlan.fields.guests')}
              guests={guests.map((email) => ({ email }))}
            />
            {guests.length > 0 && (
              <Notice tone="warning.main">
                {t('actionPlan.event.guestsNotice')}
              </Notice>
            )}
            {payload.meet && (
              <Notice>{t('actionPlan.event.meetCreated')}</Notice>
            )}
            {payload.description && <Description text={payload.description} />}
          </>
        ) : undefined
      }
      editFields={
        times.allDay
          ? [
              {
                key: 'title',
                label: t('actionPlan.edit.title'),
                type: 'text',
                value: payload.title || '',
              },
            ]
          : [
              {
                key: 'title',
                label: t('actionPlan.edit.title'),
                type: 'text',
                value: payload.title || '',
              },
              {
                key: 'start',
                label: t('actionPlan.edit.start'),
                type: 'datetime-local',
                value: toDateTimeInput(times.start),
              },
            ]
      }
      onSaveEdit={(values) => {
        const start = values.start ? new Date(values.start) : null;
        // A new start moves the whole event: keep its length.
        const end =
          start && times.start && times.end && payload.end
            ? toDateTimeInput(
                new Date(
                  start.getTime() +
                    (times.end.getTime() - times.start.getTime()),
                ),
              )
            : payload.end;
        plan.editItem(index, {
          title: values.title.trim() || payload.title,
          start: values.start || payload.start,
          end,
        });
      }}
      footer={
        blocked ? <ConnectCalendar /> : <EventLinks plan={plan} index={index} />
      }
    />
  );
};

/* ── Change to an existing event ──────────────────────────────────────── */

export const EventUpdateNode = ({ plan, index }: EventNodeProps) => {
  const { t, i18n } = useTranslation();
  const action = plan.effectiveAction(index);
  const { payload } = action;
  const event = findCalendarEvent(plan.calendarEvents, payload.id);
  const blocked = plan.isBlocked(index);
  const allDayLabel = t('actionPlan.event.allDay');

  const currentGuests = eventGuests(event);
  const known = new Set(currentGuests.map((g) => g.email!.toLowerCase()));
  const adding = cleanEmails(payload.add_attendees).filter(
    (email) => !known.has(email.toLowerCase()),
  );
  const removing = cleanEmails(payload.remove_attendees);
  const addsMeet = Boolean(payload.meet) && !hasMeetLink(event);
  const notOrganizer = event?.is_owner === false;

  const changes: Change[] = [];
  if (payload.title && payload.title !== event?.title) {
    changes.push({
      label: t('actionPlan.fields.title'),
      before: event?.title ?? null,
      after: payload.title,
    });
  }
  const moved = updatedEventTimes(payload, event);
  const movedText = moved
    ? formatEventTimes(moved, i18n.language, allDayLabel)
    : null;
  if (movedText) {
    changes.push({
      label: t('actionPlan.fields.when'),
      before: formatEventTimes(
        existingEventTimes(event),
        i18n.language,
        allDayLabel,
      ),
      after: movedText,
    });
  }
  if (payload.location !== undefined && payload.location !== event?.location) {
    changes.push({
      label: t('actionPlan.fields.location'),
      before: event?.location || null,
      after: payload.location || '—',
    });
  }
  if (payload.description !== undefined) {
    changes.push({
      label: t('actionPlan.fields.description'),
      before: null,
      after: t('actionPlan.event.descriptionReplaced'),
    });
  }
  if (addsMeet) {
    changes.push({
      label: t('actionPlan.fields.meet'),
      before: null,
      after: t('actionPlan.event.meetAdded'),
    });
  }
  const guestChanges = adding.length + removing.length;
  const notifies = currentGuests.length > 0 || adding.length > 0;

  return (
    <PlanItem
      {...itemState(plan, index)}
      icon={<EventUpdateIcon />}
      iconColor={GOOGLE_BLUE}
      title={eventTitle(event, payload.title, t)}
      meta={
        <>
          <MetaChip accent={WARNING}>
            {t('actionPlan.update.changes', {
              count: changes.length + guestChanges,
            })}
          </MetaChip>
          {adding.length > 0 && (
            <MetaChip accent={GOOGLE_BLUE}>
              {t('actionPlan.event.addGuests', { count: adding.length })}
            </MetaChip>
          )}
          {removing.length > 0 && (
            <MetaChip accent={DANGER}>
              {t('actionPlan.event.removeGuests', { count: removing.length })}
            </MetaChip>
          )}
          {(addsMeet || hasMeetLink(event)) && <MeetChip />}
          {notOrganizer && event?.organizer_email && (
            <MetaChip accent={WARNING}>
              {t('actionPlan.event.organizedBy', {
                email: event.organizer_email,
              })}
            </MetaChip>
          )}
          {blocked && <BlockedChip />}
        </>
      }
      defaultExpanded
      details={
        changes.length > 0 || guestChanges > 0 ? (
          <>
            {changes.length > 0 && <ChangeList changes={changes} />}
            <GuestList
              label={t('actionPlan.fields.guests')}
              guests={[
                ...adding.map((email) => ({ email, mark: '+' as const })),
                ...removing.map((email) => ({ email, mark: '−' as const })),
              ]}
            />
            {payload.description && <Description text={payload.description} />}
          </>
        ) : undefined
      }
      footer={
        blocked ? (
          <ConnectCalendar />
        ) : (
          <>
            {notOrganizer && plan.statuses[index] !== 'done' && (
              <Notice tone="warning.main">
                {t('actionPlan.event.notOrganizerHint')}
              </Notice>
            )}
            {notifies && plan.statuses[index] !== 'done' && (
              <Notice>{t('actionPlan.event.updateNotice')}</Notice>
            )}
            <EventLinks plan={plan} index={index} />
          </>
        )
      }
    />
  );
};

/* ── Canceling an event ───────────────────────────────────────────────── */

export const EventDeleteNode = ({ plan, index }: EventNodeProps) => {
  const { t, i18n } = useTranslation();
  const { payload } = plan.effectiveAction(index);
  const event = findCalendarEvent(plan.calendarEvents, payload.id);
  const guests = eventGuests(event);
  const when = formatEventTimes(
    existingEventTimes(event),
    i18n.language,
    t('actionPlan.event.allDay'),
  );
  const blocked = plan.isBlocked(index);

  return (
    <PlanItem
      {...itemState(plan, index)}
      tone="danger"
      icon={<EventDeleteIcon />}
      iconColor={DANGER}
      title={eventTitle(event, payload.title, t)}
      meta={
        <>
          <MetaChip accent={DANGER}>{t('actionPlan.event.cancel')}</MetaChip>
          {when && (
            <MetaChip>
              <CalendarIcon />
              {when}
            </MetaChip>
          )}
          {guests.length > 0 && (
            <MetaChip accent={DANGER}>
              <GuestsIcon />
              {t('actionPlan.event.cancelNotice', { count: guests.length })}
            </MetaChip>
          )}
          {hasMeetLink(event) && <MeetChip />}
          {blocked && <BlockedChip />}
        </>
      }
      details={
        guests.length > 0 ? (
          <GuestList
            label={t('actionPlan.fields.guests')}
            guests={guests.map((g) => ({
              email: g.email!,
              status: g.responseStatus,
            }))}
          />
        ) : undefined
      }
      footer={blocked ? <ConnectCalendar /> : undefined}
    />
  );
};
