/**
 * Helper to determine if a value is a real custom user emoji (e.g. 🚀, 💻, 🎯) vs folder style/placeholder
 */
export const isCustomEmoji = (emoji?: string | null): boolean => {
  if (!emoji) return false;
  const trimmed = emoji.trim();
  if (
    !trimmed ||
    trimmed === 'filled' ||
    trimmed === 'outlined' ||
    trimmed === '📁'
  ) {
    return false;
  }
  return true;
};
