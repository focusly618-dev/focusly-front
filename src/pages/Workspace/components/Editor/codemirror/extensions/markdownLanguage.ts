import { markdown } from '@codemirror/lang-markdown';
import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { GFM } from '@lezer/markdown';
import { MathExtension } from './mathExtension';

// GFM adds tables, task lists ("- [ ]"), strikethrough, and autolinks on top
// of the base CommonMark grammar. `codeLanguages` lets a fenced block's
// info string (```js, ```py, ...) pull in the matching grammar for syntax
// highlighting, lazily loaded on first use. MathExtension adds $inline$ and
// standalone $$ block math, which neither CommonMark nor GFM define.
export const markdownExtension = markdown({
  // An interactive block's code is colored as the HTML it is
  codeLanguages: (info) =>
    LanguageDescription.matchLanguageName(
      languages,
      info === 'html-app' ? 'html' : info,
      true,
    ),
  extensions: [...GFM, MathExtension],
});
