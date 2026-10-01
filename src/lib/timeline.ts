/** Fração (0–1) da timeline já "desenhada", dado o ponto de ancoragem na viewport. */
export function timelineProgress(anchor: number, top: number, height: number): number {
  if (height <= 0) return anchor >= top ? 1 : 0;
  return Math.min(1, Math.max(0, (anchor - top) / height));
}
