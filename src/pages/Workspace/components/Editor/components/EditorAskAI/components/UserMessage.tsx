import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { describeUserMessage } from '../editorAssistant.utils';
import { QuoteBlock, UserBubble } from '../EditorAskAI.styles';

export const UserMessage = ({ content }: { content: string }) => {
  const { t } = useTranslation();
  const { text, quote, scope } = describeUserMessage(content);

  return (
    <UserBubble>
      {text}
      {quote !== null && (
        <QuoteBlock>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontStyle: 'normal',
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            {scope === 'cursor'
              ? t('editorAI.quote.cursor')
              : t('editorAI.quote.selection')}
          </Box>
          {scope === 'cursor' ? `…${quote.slice(-160)}` : quote}
        </QuoteBlock>
      )}
    </UserBubble>
  );
};
