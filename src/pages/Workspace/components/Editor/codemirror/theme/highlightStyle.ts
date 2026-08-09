import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import type { Theme } from '@mui/material/styles';

// Colors the tokens inside fenced code blocks (and the markdown syntax tree's
// own emphasis/heading marks, which lezer-markdown also tags) via the
// standard @lezer/highlight tag vocabulary every CM6 language grammar uses.
export const buildHighlightStyle = (theme: Theme): HighlightStyle => {
  const isDark = theme.palette.mode === 'dark';

  return HighlightStyle.define([
    { tag: tags.keyword, color: isDark ? '#c792ea' : '#8b5cf6' },
    { tag: tags.controlKeyword, color: isDark ? '#c792ea' : '#8b5cf6' },
    {
      tag: [tags.name, tags.deleted, tags.character],
      color: theme.palette.text.primary,
    },
    { tag: [tags.propertyName], color: isDark ? '#82aaff' : '#2563eb' },
    {
      tag: [tags.function(tags.variableName), tags.labelName],
      color: isDark ? '#82aaff' : '#2563eb',
    },
    {
      tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
      color: isDark ? '#f78c6c' : '#d97706',
    },
    {
      tag: [tags.definition(tags.name), tags.separator],
      color: theme.palette.text.primary,
    },
    {
      tag: [
        tags.typeName,
        tags.className,
        tags.number,
        tags.changed,
        tags.annotation,
        tags.modifier,
        tags.self,
        tags.namespace,
      ],
      color: isDark ? '#ffcb6b' : '#b45309',
    },
    {
      tag: [tags.operator, tags.operatorKeyword],
      color: isDark ? '#89ddff' : '#0891b2',
    },
    {
      tag: [tags.url, tags.escape, tags.regexp, tags.link],
      color: isDark ? '#89ddff' : '#0891b2',
    },
    {
      tag: [tags.meta, tags.comment],
      color: theme.palette.text.disabled,
      fontStyle: 'italic',
    },
    { tag: tags.strong, fontWeight: '700' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: tags.heading, fontWeight: '700', color: theme.palette.text.primary },
    {
      tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
      color: isDark ? '#f78c6c' : '#d97706',
    },
    {
      tag: [tags.processingInstruction, tags.string, tags.inserted],
      color: isDark ? '#c3e88d' : '#16a34a',
    },
    { tag: tags.invalid, color: theme.palette.error.main },
  ]);
};
