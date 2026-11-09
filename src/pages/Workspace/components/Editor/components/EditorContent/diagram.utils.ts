// What a Mermaid diagram's code starts with
const MERMAID_START =
  /^(?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|journey|mindmap|timeline|pie|gitGraph|quadrantChart)\b/;

/**
 * The model's reply to "convert into a diagram" as a ```mermaid block the
 * editor draws, or null when it isn't Mermaid. Accepts the code bare, in a
 * ```mermaid fence, in an unlabelled fence, or a fence inside other text.
 */
export const asMermaidBlock = (reply: string): string | null => {
  let code = reply.trim();
  const fence = /```[ \t]*([\w-]*)[ \t]*\n([\s\S]*?)\n[ \t]*```/.exec(code);
  if (fence) code = fence[2].trim();
  if (!MERMAID_START.test(code)) return null;
  return `\`\`\`mermaid\n${code}\n\`\`\``;
};

/** The request: turn a text drawing, a list of steps or a description into
 * Mermaid. */
export const diagramPrompt = (text: string): string =>
  `Convert the following into a Mermaid diagram. It may be a diagram drawn with text characters, a list of steps, or a description of a process or structure. Pick the fitting type (flowchart TD for flows and processes, sequenceDiagram for interactions between actors over time, classDiagram or erDiagram for structures). Keep its language and wording; keep node labels short, and put any label with parentheses, colons or quotes inside double quotes, e.g. A["Ingresar credenciales (usuario)"]. Return ONLY one fenced \`\`\`mermaid code block, with no explanation before or after it:\n\n${text}`;
