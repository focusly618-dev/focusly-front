/**
 * imageCompressor.ts
 *
 * Compresses an image File using the Canvas API before it is stored as base64.
 *
 * Strategy
 * ─────────
 * • Output format  : WebP (best compression/quality ratio, supported by all
 *                    modern browsers). Falls back to JPEG on the rare Safari
 *                    versions that lack WebP encode support.
 * • Max dimensions : Resized proportionally so the longest side never exceeds
 *                    `maxSidePx` (default 1920 px). Larger images are down-
 *                    scaled; smaller images are left untouched.
 * • Quality        : `quality` (0–1, default 0.82). WebP at 0.82 is visually
 *                    indistinguishable from the original at typical screen sizes
 *                    while being 60-80 % smaller than the raw PNG/JPEG base64.
 *
 * The returned string is a data-URL that BlockNote can use directly as the
 * image `src` — no extra processing needed on the front-end.
 */

import type { CompressImageOptions } from './images.types';

/**
 * Compresses `file` and resolves with a base64 data-URL.
 *
 * - For GIF or SVG files the original is returned untouched (animation /
 *   vector content cannot be meaningfully re-encoded via Canvas).
 * - Non-image files are rejected immediately.
 */
export async function compressImageToDataUrl(
  file: File,
  { maxSidePx = 1920, quality = 0.82 }: CompressImageOptions = {},
): Promise<string> {
  // ── Pass-through types ────────────────────────────────────────────────────
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return readFileAsDataUrl(file);
  }

  if (!file.type.startsWith('image/')) {
    throw new Error(
      `compressImageToDataUrl: "${file.type}" is not an image type.`,
    );
  }

  // ── Load into an HTMLImageElement ─────────────────────────────────────────
  const originalDataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(originalDataUrl);

  // ── Calculate target dimensions ───────────────────────────────────────────
  let { width, height } = img;
  if (width > maxSidePx || height > maxSidePx) {
    const ratio = Math.min(maxSidePx / width, maxSidePx / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // ── Draw onto canvas ──────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error('compressImageToDataUrl: could not get 2D context.');

  // Use a white background for transparent PNGs so JPEG fallback looks good
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // ── Encode ────────────────────────────────────────────────────────────────
  // Try WebP first; fall back to JPEG if the browser doesn't support WebP encode
  let dataUrl = canvas.toDataURL('image/webp', quality);
  if (!dataUrl.startsWith('data:image/webp')) {
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  // Safety-net: if compression made the file *larger* (can happen with tiny
  // images or already-compressed JPEGs), return the original.
  if (dataUrl.length >= originalDataUrl.length) {
    return originalDataUrl;
  }

  return dataUrl;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('FileReader did not return a string.'));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error('Could not load image for compression.'));
    img.src = src;
  });
}
