import React from 'react';
import { Box, alpha, type SxProps, type Theme } from '@mui/material';

// The pieces every guide frame is drawn with: a miniature app window,
// placeholder text bars, keycaps and calendar-style blocks — all in the
// theme's colors, so the frames look like Focusly in light and dark mode.
// (Motion and accent colors live in motion.ts.)

const sxList = (sx?: SxProps<Theme>) =>
  sx === undefined ? [] : Array.isArray(sx) ? sx : [sx];

/** A small app window, with a title bar of three dots. */
export const MockWindow = ({
  children,
  sx,
  bodySx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  bodySx?: SxProps<Theme>;
}) => (
  <Box
    sx={[
      (theme) => ({
        width: '100%',
        maxWidth: 520,
        height: '100%',
        maxHeight: 248,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: `0 14px 36px ${alpha('#000', theme.palette.mode === 'dark' ? 0.4 : 0.1)}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }),
      ...sxList(sx),
    ]}
  >
    <Box
      sx={{
        height: 22,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        px: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={(theme) => ({
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.text.primary, 0.14),
          })}
        />
      ))}
    </Box>
    <Box
      sx={[
        { flex: 1, minHeight: 0, p: 1.5, position: 'relative' },
        ...sxList(bodySx),
      ]}
    >
      {children}
    </Box>
  </Box>
);

/** A line of placeholder text. */
export const Bar = ({
  w = '100%',
  h = 6,
  tone = 0.1,
  color,
  sx,
}: {
  w?: number | string;
  h?: number;
  tone?: number;
  color?: string;
  sx?: SxProps<Theme>;
}) => (
  <Box
    sx={[
      (theme) => ({
        width: w,
        height: h,
        flexShrink: 0,
        borderRadius: `${h}px`,
        bgcolor: alpha(color ?? theme.palette.text.primary, tone),
      }),
      ...sxList(sx),
    ]}
  />
);

/** A keyboard key. */
export const Key = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="kbd"
    sx={(theme) => ({
      minWidth: 26,
      height: 26,
      px: 0.75,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '7px',
      border: `1px solid ${theme.palette.divider}`,
      borderBottomWidth: 2,
      bgcolor: 'background.paper',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 12,
      fontWeight: 600,
      color: 'text.primary',
      lineHeight: 1,
    })}
  >
    {children}
  </Box>
);

/** A small rounded label. */
export const Pill = ({
  children,
  color,
  active,
  sx,
}: {
  children: React.ReactNode;
  color?: string;
  active?: boolean;
  sx?: SxProps<Theme>;
}) => (
  <Box
    sx={[
      (theme) => {
        const c = color ?? theme.palette.primary.main;
        return {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          height: 20,
          px: 0.9,
          borderRadius: '6px',
          fontSize: 10.5,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          color: active ? c : 'text.secondary',
          bgcolor: active ? alpha(c, 0.12) : 'transparent',
          border: `1px solid ${active ? alpha(c, 0.3) : theme.palette.divider}`,
          '& svg': { fontSize: 12 },
        };
      },
      ...sxList(sx),
    ]}
  >
    {children}
  </Box>
);

/** A colored block with an accent edge, like a calendar event. */
export const Block = ({
  color,
  sx,
  lines = 1,
  dashed,
}: {
  color: string;
  sx?: SxProps<Theme>;
  lines?: number;
  dashed?: boolean;
}) => (
  <Box
    sx={[
      {
        borderRadius: '5px',
        bgcolor: alpha(color, dashed ? 0.07 : 0.16),
        borderLeft: `3px solid ${color}`,
        outline: dashed ? `1px dashed ${alpha(color, 0.6)}` : undefined,
        p: '4px 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        overflow: 'hidden',
      },
      ...sxList(sx),
    ]}
  >
    {Array.from({ length: lines }, (_, i) => (
      <Bar
        key={i}
        w={i === 0 ? '80%' : '55%'}
        h={4}
        color={color}
        tone={0.55}
      />
    ))}
  </Box>
);

/** A round checkbox, optionally ticked. */
export const Check = ({ done, color }: { done?: boolean; color?: string }) => (
  <Box
    sx={(theme) => {
      const c = color ?? theme.palette.primary.main;
      return {
        width: 12,
        height: 12,
        flexShrink: 0,
        borderRadius: '50%',
        border: `1.5px solid ${done ? c : alpha(theme.palette.text.primary, 0.3)}`,
        bgcolor: done ? c : 'transparent',
      };
    }}
  />
);

/** An arrow pointing from one part of a frame to another. */
export const Arrow = ({ sx }: { sx?: SxProps<Theme> }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={[
      { width: 22, height: 22, flexShrink: 0, color: 'text.disabled' },
      ...sxList(sx),
    ]}
  >
    <path
      d="M4 12h15m-5-5 5 5-5 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Box>
);

/** A mouse pointer, for frames that show a drag or a click. */
export const Pointer = ({ sx }: { sx?: SxProps<Theme> }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={[
      (theme) => ({
        position: 'absolute',
        width: 16,
        height: 16,
        color: theme.palette.text.primary,
        filter: `drop-shadow(0 1px 1px ${alpha('#000', 0.3)})`,
        pointerEvents: 'none',
      }),
      ...sxList(sx),
    ]}
  >
    <path
      d="M5 3l14 8-6 1.5L10 19z"
      fill="currentColor"
      stroke="#fff"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </Box>
);
