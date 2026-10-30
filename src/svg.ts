// Inline SVG from the kit reuses fixed filter ids. Two copies on one page
// would share a filter, so each instance gets its ids suffixed.

/** Suffix every id in `svg` and every url(#id) / href="#id" that points to it. */
export function scopeIds(svg: string, suffix: string): string {
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (ids.length === 0) return svg;
  const known = new Set(ids);
  return svg
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${id}-${suffix}"`)
    .replace(/url\(#([^)]+)\)/g, (m, id) => (known.has(id) ? `url(#${id}-${suffix})` : m))
    .replace(/href="#([^"]+)"/g, (m, id) => (known.has(id) ? `href="#${id}-${suffix}"` : m));
}

let counter = 0;

/** A suffix unique within one build, so unique within every page. */
export function nextSuffix(): string {
  counter += 1;
  return counter.toString(36);
}
