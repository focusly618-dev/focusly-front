import { describe, it, expect } from 'vitest';
import { extractLuminaActionTags } from '@/utils/lumina/lumina';

// The task field "notes_encrypted" was renamed to "notes" (it was never
// encrypted). AI messages stored before the rename must still produce task
// suggestions with their notes when the conversation is reopened.
describe('Lumina action parsing — legacy "notes_encrypted"', () => {
  it('maps the old key from valid JSON to notes', () => {
    const { tags } = extractLuminaActionTags(
      '[ACTION: CREATE_TASK {"title": "Write", "notes_encrypted": "How to"}]',
    );
    expect(tags[0].payload.notes).toBe('How to');
    expect(tags[0].payload).not.toHaveProperty('notes_encrypted');
  });

  it('maps the old key in the malformed-JSON fallback', () => {
    const { tags } = extractLuminaActionTags(
      '[ACTION: CREATE_TASK {"title": "Write", "notes_encrypted": "Say "hi" first"}]',
    );
    expect(tags[0].payload.notes).toBe('Say "hi" first');
  });

  it('reads the new key', () => {
    const { tags } = extractLuminaActionTags(
      '[ACTION: CREATE_TASK {"title": "Write", "notes": "Steps"}]',
    );
    expect(tags[0].payload.notes).toBe('Steps');
  });
});
