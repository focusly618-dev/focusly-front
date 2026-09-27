import React, { useId } from 'react';
import { cn } from '@/utils';
import type { LuminaSpeakingWaveProps } from './LuminaSpeakingWave.types';

export const LuminaSpeakingWave: React.FC<LuminaSpeakingWaveProps> = ({
  isSpeaking = true,
  className,
  label,
  size = 'sm',
}) => {
  const baseId = useId();
  const cleanId = baseId.replace(/:/g, '');

  if (!isSpeaking) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full select-none transition-all',
        'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25',
        className,
      )}
    >
      <style>{`
        @keyframes soundWaveBar-${cleanId} {
          0%, 100% {
            transform: scaleY(0.25);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .sound-bar-${cleanId} {
          transform-origin: center bottom;
          will-change: transform;
        }
      `}</style>
      <div
        className={cn(
          'flex items-end gap-[2px]',
          size === 'sm' ? 'h-3.5' : 'h-4',
        )}
      >
        <span
          className={`sound-bar-${cleanId} w-[2px] h-2.5 bg-gradient-to-t from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 rounded-full`}
          style={{
            animation: `soundWaveBar-${cleanId} 0.8s ease-in-out infinite`,
          }}
        />
        <span
          className={`sound-bar-${cleanId} w-[2px] h-3.5 bg-gradient-to-t from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 rounded-full`}
          style={{
            animation: `soundWaveBar-${cleanId} 1.1s ease-in-out infinite 0.15s`,
          }}
        />
        <span
          className={`sound-bar-${cleanId} w-[2px] h-4 bg-gradient-to-t from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 rounded-full`}
          style={{
            animation: `soundWaveBar-${cleanId} 0.9s ease-in-out infinite 0.3s`,
          }}
        />
        <span
          className={`sound-bar-${cleanId} w-[2px] h-3 bg-gradient-to-t from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 rounded-full`}
          style={{
            animation: `soundWaveBar-${cleanId} 1.25s ease-in-out infinite 0.1s`,
          }}
        />
        <span
          className={`sound-bar-${cleanId} w-[2px] h-2 bg-gradient-to-t from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 rounded-full`}
          style={{
            animation: `soundWaveBar-${cleanId} 0.75s ease-in-out infinite 0.25s`,
          }}
        />
      </div>
      {label && (
        <span className="text-[11px] font-semibold tracking-tight leading-none">
          {label}
        </span>
      )}
    </div>
  );
};
