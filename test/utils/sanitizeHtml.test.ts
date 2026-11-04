import { describe, expect, it } from 'vitest';
import { safeHref, sanitizeHtml } from '@/utils/sanitizeHtml';
import { formatDescriptionToHtml } from '@/utils/formatDescription';

/** Parses the output the way the page will, to check what would run. */
const parse = (html: string) => {
  const box = document.createElement('div');
  box.innerHTML = html;
  return box;
};

const hasActiveContent = (html: string) => {
  const box = parse(html);
  const handlers = [...box.querySelectorAll('*')].some((el) =>
    [...el.attributes].some((a) => a.name.toLowerCase().startsWith('on')),
  );
  const scriptish = box.querySelector(
    'script, iframe, object, embed, svg, math, form, input',
  );
  const badLinks = [...box.querySelectorAll('[href], [src]')].some((el) =>
    /^\s*(javascript|data|vbscript):/i.test(
      el.getAttribute('href') ?? el.getAttribute('src') ?? '',
    ),
  );
  return handlers || Boolean(scriptish) || badLinks;
};

// What an attacker could put in a Google Calendar invite's description
const ATTACKS = [
  '<p>Reunión</p><img src=x onerror="alert(1)">',
  'Hola <img src=x onerror=alert(1)>',
  '<p>hi</p><script>alert(1)</script>',
  '<div><iframe src="https://evil.example"></iframe></div>',
  '<p><a href="javascript:alert(1)">abrir</a></p>',
  '<p><a href=" JaVaScRiPt:alert(1)">abrir</a></p>',
  '<p><svg onload=alert(1)></svg></p>',
  '<p><a href="data:text/html,<script>alert(1)</script>">x</a></p>',
  '<ul><li onclick="alert(1)">x</li></ul>',
  'Ver [aquí](javascript:alert(1))',
  '<p><form action="https://evil.example"><input name="password"></form></p>',
];

describe('sanitizeHtml', () => {
  it.each(ATTACKS)('neutralizes %s', (attack) => {
    expect(hasActiveContent(sanitizeHtml(attack))).toBe(false);
  });

  it("keeps a Google Calendar description's formatting and opens links safely", () => {
    const html = sanitizeHtml(
      '<b>Agenda</b><br><ul><li>Revisar logo</li></ul><a href="https://meet.example/abc">Unirse</a>',
    );
    const box = parse(html);
    expect(box.querySelector('b')?.textContent).toBe('Agenda');
    expect(box.querySelectorAll('li')).toHaveLength(1);
    const link = box.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://meet.example/abc');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('keeps mailto and in-app links', () => {
    const box = parse(
      sanitizeHtml('<a href="mailto:a@b.com">m</a><a href="/tasks">t</a>'),
    );
    expect(
      [...box.querySelectorAll('a')].map((a) => a.getAttribute('href')),
    ).toEqual(['mailto:a@b.com', '/tasks']);
  });

  it("keeps only the formatter's spacer style, never arbitrary CSS", () => {
    const box = parse(
      sanitizeHtml(
        '<div style="height: 6px;"></div><div style="position:fixed;inset:0;background:red">fake</div>',
      ),
    );
    const [spacer, overlay] = box.querySelectorAll('div');
    expect(spacer.getAttribute('style')).toBe('height: 6px;');
    expect(overlay.hasAttribute('style')).toBe(false);
  });
});

describe('formatDescriptionToHtml', () => {
  it.each(ATTACKS)('never renders active content: %s', (attack) => {
    expect(hasActiveContent(formatDescriptionToHtml(attack))).toBe(false);
  });

  it('still formats markdown', () => {
    const box = parse(
      formatDescriptionToHtml('**Importante**\n- uno\n- dos\n==ojo=='),
    );
    expect(box.querySelector('strong')?.textContent).toBe('Importante');
    expect(box.querySelectorAll('li')).toHaveLength(2);
    expect(box.querySelector('mark')?.textContent).toBe('ojo');
  });

  it('still renders HTML descriptions with highlights', () => {
    const box = parse(formatDescriptionToHtml('<p>Texto ==clave==</p>'));
    expect(box.querySelector('p mark')?.textContent).toBe('clave');
  });
});

describe('safeHref', () => {
  it.each([
    ['https://focusly.app/x?a=1&b=2', 'https://focusly.app/x?a=1&amp;b=2'],
    ['/tasks', '/tasks'],
    ['mailto:a@b.com', 'mailto:a@b.com'],
    [
      'https://x.com/"onmouseover="alert(1)',
      'https://x.com/&quot;onmouseover=&quot;alert(1)',
    ],
  ])('allows %s', (url, expected) => {
    expect(safeHref(url)).toBe(expected);
  });

  it.each([
    'javascript:alert(1)',
    ' JAVASCRIPT:alert(1)',
    'data:text/html,x',
    '//evil.example',
    'vbscript:x',
  ])('refuses %s', (url) => {
    expect(safeHref(url)).toBeNull();
  });

  it('keeps an already escaped ampersand as it is', () => {
    expect(safeHref('https://a.com/?x=1&amp;y=2')).toBe(
      'https://a.com/?x=1&amp;y=2',
    );
  });
});
