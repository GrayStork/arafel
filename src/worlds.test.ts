import { describe, expect, it } from "vitest";
import { WORLDS, world, worldHref } from "./worlds";

describe("worlds", () => {
  it("links to a world's home", () => {
    expect(worldHref("rite-tec")).toBe("/rite-tec/");
  });

  it("joins a page without doubling the slash", () => {
    expect(worldHref("architect", "/blog/")).toBe("/architect/blog/");
  });

  it("keeps Rite palettes inside Rite Tec", () => {
    const outside = WORLDS.filter((w) => w.id !== "rite-tec");
    expect(outside.every((w) => !w.theme.startsWith("rite"))).toBe(true);
  });

  it("rejects an unknown world", () => {
    expect(() => world("nowhere" as never)).toThrow();
  });
});
