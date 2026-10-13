// Widths cycled by index: placeholder lines with a natural, stable rhythm
// (a list of equal bars looks stamped).
const WIDTHS = ['72%', '56%', '84%', '64%', '48%', '78%'];

export const skeletonWidth = (i: number, shift = 0) =>
  WIDTHS[(i + shift) % WIDTHS.length];
