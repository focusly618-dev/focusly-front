import { Box } from '@mui/material';
import { useSiteContent } from '../content';
import { LUMINA, useSiteTokens } from '../tokens';
import { SiteIcon } from '../icons';
import { useTicker } from '../hooks';
import { TypingDots } from './HeroDemo';

/** Lumina section loop (11 s): a request becomes four tasks, then "Crear todas". */
export const LuminaChatDemo = () => {
  const tk = useSiteTokens();
  const { c } = useSiteContent();
  const d = c.lumina.demo;
  const { t, reduced } = useTicker();

  const clock = reduced ? 9000 : t % 11000;
  const live = clock < 10400;
  const userOn = clock >= 400 && live;
  const thinking = clock >= 1200 && clock < 2400;
  const planOn = clock >= 2400 && live;
  const created = clock >= 4800 && live;
  const pressing = clock >= 4400 && clock < 4600 && !reduced;
  const lift = (on: boolean, y = 8) =>
    on || reduced ? 'none' : `translateY(${y}px)`;

  return (
    <Box
      role="img"
      aria-label={d.aria}
      sx={{
        flex: '1 1 420px',
        minHeight: 500,
        bgcolor: tk.lumSurface,
        border: `1px solid ${tk.lumBorder}`,
        borderRadius: '18px',
        p: 2.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1.5,
          borderBottom: `1px solid ${tk.lumBorder}`,
        }}
      >
        <Box
          component="span"
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'rgba(16,185,129,.16)',
            color: LUMINA.accent,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <SiteIcon name="auto_awesome" size={17} />
        </Box>
        <Box component="span" sx={{ fontWeight: 600, fontSize: 15 }}>
          Lumina
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            alignSelf: 'flex-end',
            maxWidth: '86%',
            bgcolor: LUMINA.brand,
            color: LUMINA.onBrand,
            px: 1.75,
            py: 1.25,
            borderRadius: '14px 14px 4px 14px',
            fontSize: 14.5,
            lineHeight: 1.5,
            opacity: userOn ? 1 : 0,
            transform: lift(userOn),
            transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          }}
        >
          {d.before}{' '}
          <Box
            component="span"
            sx={{
              bgcolor: 'rgba(4,40,29,.14)',
              px: 0.75,
              py: '1px',
              borderRadius: '5px',
              fontWeight: 600,
            }}
          >
            {d.mention}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', alignItems: 'end' }}>
          <Box
            sx={{
              gridArea: '1/1',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              fontSize: 14,
              color: LUMINA.muted,
              opacity: thinking ? 1 : 0,
              transition: 'opacity 200ms ease-out',
            }}
          >
            {d.thinking}
            <TypingDots />
          </Box>
          <Box
            sx={{
              gridArea: '1/1',
              bgcolor: tk.lumBg,
              border: `1px solid ${tk.lumBorder}`,
              borderRadius: '14px',
              p: 1.75,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              opacity: planOn ? 1 : 0,
              transform: lift(planOn),
              transition: 'opacity 300ms ease-out, transform 300ms ease-out',
            }}
          >
            <Box
              sx={{
                fontSize: 13.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <SiteIcon
                name="auto_awesome"
                size={17}
                sx={{ color: LUMINA.accent }}
              />
              {d.planTitle}
            </Box>
            {d.tasks.map(([name, meta], i) => {
              const on = clock >= 2600 + i * 180 && live;
              return (
                <Box
                  key={name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    fontSize: 14,
                    px: 1.25,
                    py: 1,
                    borderRadius: '9px',
                    bgcolor: tk.lumSurface,
                    opacity: on ? 1 : 0,
                    transform: lift(on, 6),
                    transition:
                      'opacity 250ms ease-out, transform 250ms ease-out',
                  }}
                >
                  <SiteIcon
                    name={
                      created ? 'check_circle_filled' : 'radio_button_unchecked'
                    }
                    size={19}
                    sx={{ color: created ? LUMINA.accent : LUMINA.faint }}
                  />
                  <Box component="span" sx={{ flex: 1 }}>
                    {name}
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontSize: 12.5, color: LUMINA.muted }}
                  >
                    {meta}
                  </Box>
                </Box>
              );
            })}
            <Box
              sx={{
                height: 38,
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                fontSize: 14,
                fontWeight: 600,
                bgcolor: created ? 'transparent' : LUMINA.brand,
                color: created ? LUMINA.accent : LUMINA.onBrand,
                border: `1px solid ${LUMINA.brand}`,
                transform: pressing ? 'scale(.97)' : 'none',
                transition:
                  'transform 150ms ease-out, background-color 200ms ease-out, color 200ms ease-out',
              }}
            >
              <SiteIcon name={created ? 'check' : 'add_task'} size={18} />
              {created ? d.created : d.create}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          height: 44,
          border: `1px solid ${tk.lumBorder}`,
          borderRadius: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pl: 1.5,
          pr: 0.75,
          fontSize: 14,
          color: LUMINA.faint,
        }}
      >
        <SiteIcon name="attach_file" size={19} />
        <Box component="span" sx={{ flex: 1 }}>
          {d.input}
        </Box>
        <Box
          component="span"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: LUMINA.brand,
            color: LUMINA.onBrand,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <SiteIcon name="arrow_upward" size={18} />
        </Box>
      </Box>
    </Box>
  );
};
