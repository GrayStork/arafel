// The network's worlds and where each one lives.
// Phase A serves every world as a path on one domain. Moving a world to its
// own subdomain is a change to `base` here; every link goes through worldHref.

export type WorldId = "architect" | "eidolon" | "rite-tec";

export interface World {
  id: WorldId;
  label: string; // the worlds switch: Day, Night, Rite
  name: string; // the world's name in links
  theme: string; // data-theme on <html>
  dot: string; // data-theme of the switch dot
  voice: string; // data-voice on <html>
  face: string; // file in /kit/img/faces
  base: string; // absolute URL or root-relative path
}

export const DOMAIN = "arafel.net";

export const WORLDS: World[] = [
  { id: "architect", label: "Day", name: "architect", theme: "axis-arch", dot: "axis", voice: "prism", face: "eidolon-axis-arch.webp", base: "/architect/" },
  { id: "eidolon", label: "Night", name: "eidolon", theme: "club", dot: "club", voice: "imperial", face: "eidolon-club.webp", base: "/eidolon/" },
  { id: "rite-tec", label: "Rite", name: "rite-tec", theme: "rite", dot: "rite", voice: "imperial", face: "eidolon-rite.webp", base: "/rite-tec/" },
];

export function world(id: WorldId): World {
  const w = WORLDS.find((w) => w.id === id);
  if (!w) throw new Error(`Unknown world: ${id}`);
  return w;
}

/** Link to a page inside a world, e.g. worldHref("architect", "blog/"). */
export function worldHref(id: WorldId, page = ""): string {
  return world(id).base + page.replace(/^\//, "");
}

/** The path shown after the domain, e.g. "/eidolon". */
export function worldPath(id: WorldId): string {
  return world(id).base.replace(/\/$/, "");
}
