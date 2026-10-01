import { Box, useMediaQuery } from '@mui/material';
import { blink, dotPulse } from '@/styles/mui';
import { useSiteContent } from '../content';
import { useSiteTokens } from '../tokens';
import { SiteIcon, type IconName } from '../icons';
import { useTicker } from '../hooks';

// Fixed calendar events and the focus blocks Lumina drops in (day index,
// start/end hour; `i` indexes the localized labels).
const EVENTS = [
  { d: 0, s: 10, e: 11.5, i: 0 },
  { d: 2, s: 14, e: 15, i: 1 },
  { d: 3, s: 9.5, e: 10.5, i: 2 },
];
const BLOCKS = [
  { d: 0, s: 12, e: 14 },
  { d: 1, s: 9, e: 10.5 },
  { d: 2, s: 10.5, e: 11.5 },
  { d: 4, s: 15.5, e: 16 },
];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16];
const SIDE_ICONS: IconName[] = [
  'checklist',
  'calendar_month',
  'auto_awesome',
  'timer',
  'description',
  'insights',
];

const fmtHour = (h: number) => `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;

export const TypingDots = () => (
  <Box component="span" sx={{ display: 'flex', gap: '3px' }}>
    {[0, 0.15, 0.3].map((delay) => (
      <Box
        key={delay}
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'currentColor',
          animation: `${dotPulse} 1s ${delay}s infinite`,
        }}
      />
    ))}
  </Box>
);

/** Hero loop (10 s): type a prompt, Lumina answers with a plan, blocks land on the calendar. */
export const HeroDemo = () => {
  const tk = useSiteTokens();
  const { c } = useSiteContent();
  const h = c.hero;
  const desktop = useMediaQuery('(min-width:1024px)');
  const { t, reduced } = useTicker();

  const clock = reduced ? 8000 : t % 10000;
  const live = clock < 9400;
  const typedN =
    clock < 300
      ? 0
      : clock < 1500
        ? Math.ceil(((clock - 300) / 1200) * h.prompt.length)
        : h.prompt.length;
  const typing = clock < 1600;
  const sent = clock >= 1600 && live;
  const thinking = clock >= 1600 && clock < 2400;
  const plan = clock >= 2400 && live;
  const pressed = clock >= 3600 && live;

  const days = desktop ? 5 : 3;
  const colW = `(100% - 40px) / ${days}`;
  const lift = (on: boolean, y = 8) =>
    on || reduced ? 'none' : `translateY(${y}px)`;

  const calendarItems = [
    ...EVENTS.map((e) => ({
      ...e,
      block: false,
      on: true,
      label: h.events[e.i],
    })),
    ...BLOCKS.map((e, i) => ({
      ...e,
      block: true,
      on: clock >= 3900 + i * 180 && live,
      label: h.items[i],
    })),
  ].filter((e) => e.d < days);

  return (
    <Box
      role="img"
      aria-label={h.alt}
      sx={{
        width: '100%',
        maxWidth: 1080,
        mt: 7,
        border: `1px solid ${tk.border}`,
        borderRadius: '14px',
        bgcolor: tk.surface,
        boxShadow: `0 40px 80px -30px rgba(0,0,0,.28),${tk.shadow}`,
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      {/* Browser chrome */}
      <Box
        sx={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.75,
          borderBottom: `1px solid ${tk.border}`,
          bgcolor: tk.surface2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            component="span"
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: tk.border,
            }}
          />
        ))}
        <Box
          sx={{
            flex: 1,
            maxWidth: 340,
            mx: 'auto',
            height: 24,
            borderRadius: '6px',
            bgcolor: tk.bg,
            border: `1px solid ${tk.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            fontSize: 12,
            color: tk.muted,
          }}
        >
          <SiteIcon name="lock" size={14} />
          Focusly
        </Box>
        <Box component="span" sx={{ width: 46 }} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: desktop
            ? '56px minmax(300px,340px) minmax(0,1fr)'
            : 'minmax(0,1fr)',
          height: desktop ? 460 : 'auto',
        }}
      >
        {desktop && (
          <Box
            sx={{
              borderRight: `1px solid ${tk.border}`,
              bgcolor: tk.bg2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.75,
              py: 1.5,
            }}
          >
            {SIDE_ICONS.map((icon) => {
              const on = icon === 'calendar_month';
              return (
                <Box
                  key={icon}
                  component="span"
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '9px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: on ? tk.brandSoft : 'transparent',
                    color: on ? tk.brandText : tk.muted,
                  }}
                >
                  <SiteIcon name={icon} />
                </Box>
              );
            })}
          </Box>
        )}

        {/* Chat */}
        <Box
          sx={{
            borderRight: desktop ? `1px solid ${tk.border}` : 0,
            borderBottom: desktop ? 0 : `1px solid ${tk.border}`,
            height: desktop ? 'auto' : 330,
            display: 'flex',
            flexDirection: 'column',
            p: 1.75,
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                bgcolor: tk.brandSoft,
                color: tk.brandText,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <SiteIcon name="auto_awesome" size={16} />
            </Box>
            <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
              Lumina
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 1.25,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                alignSelf: 'flex-end',
                maxWidth: '85%',
                bgcolor: tk.brand,
                color: tk.onBrand,
                px: 1.5,
                py: 1,
                borderRadius: '12px 12px 4px 12px',
                fontSize: 13.5,
                opacity: sent ? 1 : 0,
                transform: lift(sent),
                transition: 'opacity 300ms ease-out, transform 300ms ease-out',
              }}
            >
              {h.prompt}
            </Box>
            <Box sx={{ display: 'grid', alignItems: 'end' }}>
              <Box
                sx={{
                  gridArea: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontSize: 13,
                  color: tk.muted,
                  opacity: thinking ? 1 : 0,
                  transition: 'opacity 200ms ease-out',
                }}
              >
                {h.thinking}
                <TypingDots />
              </Box>
              <Box
                sx={{
                  gridArea: '1/1',
                  border: `1px solid ${tk.border}`,
                  borderRadius: '12px',
                  bgcolor: tk.bg,
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  opacity: plan ? 1 : 0,
                  transform: lift(plan),
                  transition:
                    'opacity 300ms ease-out, transform 300ms ease-out',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <SiteIcon
                    name="auto_awesome"
                    size={16}
                    sx={{ color: tk.brandText }}
                  />
                  {h.plan}
                </Box>
                {h.items.map((label, i) => {
                  const on = clock >= 2500 + i * 150 && live;
                  return (
                    <Box
                      key={label}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: 13,
                        opacity: on ? 1 : 0,
                        transform: lift(on, 6),
                        transition:
                          'opacity 250ms ease-out, transform 250ms ease-out',
                      }}
                    >
                      <SiteIcon
                        name="event_available"
                        size={16}
                        sx={{ color: tk.brandText }}
                      />
                      <Box
                        component="span"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {label}
                      </Box>
                      <Box
                        component="span"
                        sx={{ color: tk.muted, fontSize: 12 }}
                      >
                        {h.durations[i]}
                      </Box>
                    </Box>
                  );
                })}
                <Box
                  sx={{
                    height: 32,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.75,
                    fontSize: 13,
                    fontWeight: 600,
                    bgcolor: pressed ? tk.brand : 'transparent',
                    color: pressed ? tk.onBrand : tk.text,
                    border: `1px solid ${pressed ? tk.brand : tk.border}`,
                    transition:
                      'background-color 200ms ease-out, color 200ms ease-out',
                  }}
                >
                  <SiteIcon name={pressed ? 'check' : 'event'} size={16} />
                  {pressed ? h.added : h.add}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              height: 40,
              flexShrink: 0,
              border: `1px solid ${tk.border}`,
              borderRadius: '10px',
              bgcolor: tk.bg,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              pl: 1.5,
              pr: 0.75,
              fontSize: 13.5,
            }}
          >
            <Box
              component="span"
              sx={{
                color: typing && typedN ? tk.text : tk.muted,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {typing && typedN ? h.prompt.slice(0, typedN) : h.placeholder}
            </Box>
            {typing && !reduced && (
              <Box
                component="span"
                sx={{
                  width: '1.5px',
                  height: 16,
                  bgcolor: tk.text,
                  animation: `${blink} 1s steps(1) infinite`,
                }}
              />
            )}
            <Box component="span" sx={{ flex: 1 }} />
            <Box
              component="span"
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                bgcolor: tk.brand,
                color: tk.onBrand,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <SiteIcon name="arrow_upward" size={16} />
            </Box>
          </Box>
        </Box>

        {/* Calendar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: desktop ? 'auto' : 300,
          }}
        >
          <Box
            sx={{
              height: 38,
              flexShrink: 0,
              display: 'grid',
              gridTemplateColumns: `40px repeat(${days}, 1fr)`,
              borderBottom: `1px solid ${tk.border}`,
              alignItems: 'center',
            }}
          >
            <span />
            {h.days.slice(0, days).map((d) => (
              <Box
                key={d}
                component="span"
                sx={{
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: tk.muted,
                }}
              >
                {d}
              </Box>
            ))}
          </Box>
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {HOURS.map((hour) => (
              <Box
                key={hour}
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${((hour - 9) / 8) * 100}%`,
                  borderTop: `1px solid ${tk.border}`,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    left: 6,
                    top: 3,
                    fontSize: 10.5,
                    color: tk.muted,
                  }}
                >
                  {hour}:00
                </Box>
              </Box>
            ))}
            {Array.from({ length: days }, (_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `calc(40px + ${colW} * ${i})`,
                  borderLeft: `1px solid ${tk.border}`,
                }}
              />
            ))}
            {calendarItems.map((e) => (
              <Box
                key={`${e.block}-${e.d}-${e.s}`}
                sx={{
                  position: 'absolute',
                  top: `${((e.s - 9) / 8) * 100}%`,
                  height: `calc(${((e.e - e.s) / 8) * 100}% - 3px)`,
                  left: `calc(40px + ${colW} * ${e.d} + 3px)`,
                  width: `calc(${colW} - 6px)`,
                  borderRadius: '6px',
                  px: 0.75,
                  py: 0.5,
                  overflow: 'hidden',
                  bgcolor: e.block ? tk.brand : tk.event,
                  color: e.block ? tk.onBrand : tk.eventText,
                  opacity: e.on ? 1 : 0,
                  transform:
                    e.on || reduced ? 'translateY(0)' : 'translateY(-24px)',
                  transition:
                    'opacity 400ms ease-out, transform 400ms cubic-bezier(.16,1,.3,1)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {e.label}
                </Box>
                <Box
                  component="span"
                  sx={{ fontSize: 10.5, lineHeight: 1.3, opacity: 0.85 }}
                >
                  {fmtHour(e.s)}–{fmtHour(e.e)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
