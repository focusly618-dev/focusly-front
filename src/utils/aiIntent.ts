/**
 * Extracts and formats user intent in natural Spanish,
 * modeled after Notion AI and AI SDK Elements Chain of Thought.
 */
export function extractUserIntent(rawText: string): string {
  if (!rawText) return 'procesar la solicitud';

  let text = rawText.trim();

  // If prompt has attached files wrapper
  if (text.includes('=== ATTACHED FILE:')) {
    text = text.split('=== ATTACHED FILE:')[0].trim();
  }
  if (text.startsWith('Uploaded:')) {
    return 'analizar los archivos adjuntos';
  }

  // Remove common greeting / filler prefixes
  text = text
    .replace(
      /^(hola|buenas tardes|buenos días|buenas noches|buenas|por favor|oye|lumina|hey|hola lumina)[,\s:]*/i,
      '',
    )
    .trim();

  const lower = text.toLowerCase();

  // Common verbs to infinitive for smooth grammatical sentence: "El usuario está queriendo [intent]..."
  if (/^crea(r)?\b/i.test(lower)) {
    text = text.replace(/^crea(r)?\b/i, 'crear');
  } else if (/^haz\b/i.test(lower) || /^hacer\b/i.test(lower)) {
    text = text.replace(/^(haz|hacer)\b/i, 'hacer');
  } else if (/^organiz(a|ar)\b/i.test(lower)) {
    text = text.replace(/^organiz(a|ar)\b/i, 'organizar');
  } else if (/^resum(e|ir)\b/i.test(lower)) {
    text = text.replace(/^resum(e|ir)\b/i, 'resumir');
  } else if (/^planific(a|ar)\b/i.test(lower)) {
    text = text.replace(/^planific(a|ar)\b/i, 'planificar');
  } else if (/^divid(e|ir)\b/i.test(lower)) {
    text = text.replace(/^divid(e|ir)\b/i, 'dividir');
  } else if (/^revis(a|ar)\b/i.test(lower)) {
    text = text.replace(/^revis(a|ar)\b/i, 'revisar');
  } else if (/^analiz(a|ar)\b/i.test(lower)) {
    text = text.replace(/^analiz(a|ar)\b/i, 'analizar');
  } else if (/^busc(a|ar)\b/i.test(lower)) {
    text = text.replace(/^busc(a|ar)\b/i, 'buscar');
  } else if (/^dame\b/i.test(lower)) {
    text = text.replace(/^dame\b/i, 'obtener');
  } else if (/^muestras?(me)?\b/i.test(lower)) {
    text = text.replace(/^muestras?(me)?\b/i, 'ver');
  } else if (/^gener(a|ar)\b/i.test(lower)) {
    text = text.replace(/^gener(a|ar)\b/i, 'generar');
  } else if (/^optimiz(a|ar)\b/i.test(lower)) {
    text = text.replace(/^optimiz(a|ar)\b/i, 'optimizar');
  } else if (/^program(a|ar)\b/i.test(lower)) {
    text = text.replace(/^program(a|ar)\b/i, 'programar');
  } else if (/^estructur(a|ar)\b/i.test(lower)) {
    text = text.replace(/^estructur(a|ar)\b/i, 'estructurar');
  } else if (
    /^(como|cómo|que|qué|cual|cuál|donde|dónde|por que|por qué)\b/i.test(lower)
  ) {
    const questionText = text.replace(/^\?+|\?+$/g, '').trim();
    text = `saber ${questionText.charAt(0).toLowerCase() + questionText.slice(1)}`;
  } else {
    text = text.charAt(0).toLowerCase() + text.slice(1);
  }

  // Cap max length to prevent overly long header text
  if (text.length > 70) {
    return text.slice(0, 67) + '...';
  }

  return text;
}
