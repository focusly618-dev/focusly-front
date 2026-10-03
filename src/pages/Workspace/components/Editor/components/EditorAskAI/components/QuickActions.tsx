import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  AutoFixHigh,
  Spellcheck,
  UnfoldLess,
  UnfoldMore,
  Translate,
  LightbulbOutlined,
  BrushOutlined,
  Summarize,
  DriveFileRenameOutline,
  AddTask,
  FactCheckOutlined,
} from '@mui/icons-material';
import {
  DOCUMENT_ACTIONS,
  SELECTION_ACTIONS,
  TRANSLATE_LANGUAGES,
  type QuickActionId,
} from '../editorAssistant.utils';
import { ActionChip, ChipRow } from '../EditorAskAI.styles';

const ICONS: Record<QuickActionId, SvgIconComponent> = {
  improve: AutoFixHigh,
  fix: Spellcheck,
  shorter: UnfoldLess,
  longer: UnfoldMore,
  translate: Translate,
  explain: LightbulbOutlined,
  matchStyle: BrushOutlined,
  summarize: Summarize,
  continue: DriveFileRenameOutline,
  extractTasks: AddTask,
  proofread: FactCheckOutlined,
};

interface QuickActionsProps {
  hasSelection: boolean;
  disabled: boolean;
  onRun: (id: QuickActionId, options?: { language?: string }) => void;
}

export const QuickActions = ({
  hasSelection,
  disabled,
  onRun,
}: QuickActionsProps) => {
  const { t, i18n } = useTranslation();
  const [languageAnchor, setLanguageAnchor] = useState<HTMLElement | null>(
    null,
  );
  const actions = hasSelection ? SELECTION_ACTIONS : DOCUMENT_ACTIONS;

  const languageLabel = (code: string) => {
    try {
      const name = new Intl.DisplayNames([i18n.language], {
        type: 'language',
      }).of(code);
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
    } catch {
      return code;
    }
  };

  return (
    <>
      <ChipRow role="toolbar" aria-label={t('editorAI.actions.label')}>
        {actions.map((id) => {
          const Icon = ICONS[id];
          return (
            <ActionChip
              key={id}
              disabled={disabled}
              title={t(`editorAI.actions.${id}.hint`)}
              aria-haspopup={id === 'translate' ? 'menu' : undefined}
              onClick={(e) =>
                id === 'translate'
                  ? setLanguageAnchor(e.currentTarget)
                  : onRun(id)
              }
            >
              <Icon />
              {t(`editorAI.actions.${id}.label`)}
            </ActionChip>
          );
        })}
      </ChipRow>

      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={() => setLanguageAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {TRANSLATE_LANGUAGES.map((code) => (
          <MenuItem
            key={code}
            onClick={() => {
              setLanguageAnchor(null);
              onRun('translate', { language: code });
            }}
          >
            {languageLabel(code)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
