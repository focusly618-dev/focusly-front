// A document's content is markdown. The editor before it (BlockNote) saved
// block JSON, and "[]" was its empty document: documents created empty back
// then still have it, so both mean "nothing written yet".

/** What a new document starts with. */
export const EMPTY_DOCUMENT = '';

export const isEmptyDocument = (content?: string | null) => {
  const text = (content ?? '').trim();
  return text === '' || text === '[]';
};
