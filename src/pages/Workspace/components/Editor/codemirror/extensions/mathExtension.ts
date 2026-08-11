import type {
  BlockParser,
  InlineParser,
  MarkdownConfig,
} from '@lezer/markdown';

// Math isn't part of CommonMark/GFM, so both levels need a hand-rolled parser:
// block ($$ alone on its own line, opening and closing) and inline ($...$,
// no space touching either delimiter so "$5 and $10" doesn't misfire).
const isDollarFence = (text: string, pos: number): boolean =>
  text.slice(pos).trim() === '$$';

const mathBlockParser: BlockParser = {
  name: 'MathBlock',
  parse(cx, line) {
    if (!isDollarFence(line.text, line.pos)) return false;

    const start = cx.lineStart + line.pos;
    const children = [
      cx.elt('CodeMark', start, cx.lineStart + line.text.length),
    ];
    let textFrom = -1;
    let textTo = -1;
    let closed = false;

    while (cx.nextLine()) {
      if (isDollarFence(line.text, line.pos)) {
        if (textFrom >= 0) children.push(cx.elt('CodeText', textFrom, textTo));
        children.push(
          cx.elt(
            'CodeMark',
            cx.lineStart + line.pos,
            cx.lineStart + line.text.length,
          ),
        );
        closed = true;
        cx.nextLine();
        break;
      }
      const lineFrom = cx.lineStart + line.pos;
      const lineTo = cx.lineStart + line.text.length;
      if (textFrom < 0) textFrom = lineFrom;
      textTo = lineTo;
    }

    if (!closed && textFrom >= 0)
      children.push(cx.elt('CodeText', textFrom, textTo));

    const end = children[children.length - 1].to;
    cx.addElement(cx.elt('MathBlock', start, end, children));
    return true;
  },
};

const DOLLAR = 36;
const SPACE = 32;
const TAB = 9;
const NEWLINE = 10;

const inlineMathParser: InlineParser = {
  name: 'InlineMath',
  parse(cx, next, start) {
    if (next !== DOLLAR) return -1;
    // A second immediate `$` is a block-math fence, not inline math — leave
    // it alone rather than guessing at $$...$$ used mid-paragraph.
    const afterOpen = cx.char(start + 1);
    if (afterOpen === DOLLAR || afterOpen === SPACE || afterOpen === TAB)
      return -1;

    for (let pos = start + 1; pos < cx.end; pos++) {
      const ch = cx.char(pos);
      if (ch === NEWLINE) return -1;
      if (ch !== DOLLAR) continue;
      const before = cx.char(pos - 1);
      if (before === SPACE || before === TAB) continue; // not a valid close, keep scanning
      return cx.addElement(
        cx.elt('InlineMath', start, pos + 1, [
          cx.elt('CodeMark', start, start + 1),
          cx.elt('CodeMark', pos, pos + 1),
        ]),
      );
    }
    return -1;
  },
};

export const MathExtension: MarkdownConfig = {
  defineNodes: [{ name: 'MathBlock', block: true }, 'InlineMath'],
  parseBlock: [mathBlockParser],
  parseInline: [inlineMathParser],
};
