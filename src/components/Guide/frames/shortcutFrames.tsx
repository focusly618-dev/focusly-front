import { useTranslation } from 'react-i18next';
import { ShortcutsFrame } from './calendarFrames';
import { KEYS } from '../platformKeys';

// The shortcut pages: real keys, labeled for this computer (⌘ or Ctrl).

export const CalendarKeysFrame = () => {
  const { t } = useTranslation();
  return (
    <ShortcutsFrame
      rows={[
        {
          keys: ['←', '→'],
          label: t('guide.keys.period', 'Previous / next period'),
        },
        { keys: ['T'], label: t('guide.keys.today', 'Back to today') },
        {
          keys: ['D', 'W', 'M'],
          label: t('guide.keys.views', 'Day, week or month view'),
        },
      ]}
    />
  );
};

export const EditorKeysFrame = () => {
  const { t } = useTranslation();
  const { mod, shift, alt } = KEYS;
  return (
    <ShortcutsFrame
      rows={[
        {
          keys: [mod, 'J'],
          label: t('guide.keys.lumina', 'Open Lumina, the assistant'),
        },
        {
          keys: [mod, 'K'],
          label: t('guide.keys.linkTask', 'Find and link a task'),
        },
        { keys: [mod, 'Z'], label: t('guide.keys.undo', 'Undo') },
        { keys: [shift, mod, 'Z'], label: t('guide.keys.redo', 'Redo') },
        {
          keys: [alt, '↑', '↓'],
          label: t('guide.keys.moveLine', 'Move the line up or down'),
        },
        {
          keys: [shift, alt, '↓'],
          label: t('guide.keys.copyLine', 'Duplicate the line'),
        },
      ]}
    />
  );
};
