import { describe, expect, it } from "vitest";
import { scopeIds } from "./svg";

const fog = '<svg><defs><filter id="fog"><feTurbulence/></filter></defs><g filter="url(#fog)"><path/></g></svg>';

describe("scopeIds", () => {
  it("suffixes every id and the references to it", () => {
    const out = scopeIds(fog, "3");
    expect(out).toContain('id="fog-3"');
    expect(out).toContain('filter="url(#fog-3)"');
    expect(out).not.toMatch(/#fog\)/);
  });

  it("gives two copies different ids", () => {
    const ids = (s: string) => [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids(scopeIds(fog, "a"))).not.toEqual(ids(scopeIds(fog, "b")));
  });

  it("leaves an svg without ids alone", () => {
    const plain = '<svg><path d="M0 0"/></svg>';
    expect(scopeIds(plain, "1")).toBe(plain);
  });

  it("does not touch an id that only shares a prefix", () => {
    const two = '<svg><filter id="a"/><filter id="ab"/><g filter="url(#ab)"/><g filter="url(#a)"/></svg>';
    const out = scopeIds(two, "x");
    expect(out).toContain('url(#ab-x)');
    expect(out).toContain('url(#a-x)');
  });
});
