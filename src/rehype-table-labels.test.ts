import { describe, expect, it } from "vitest";
import rehypeTableLabels from "./rehype-table-labels.mjs";

const text = (value: string) => ({ type: "text", value });
const el = (tagName: string, children: any[] = []) => ({ type: "element", tagName, properties: {}, children });

function table(head: string[], rows: string[][]) {
  return el("table", [
    el("thead", [el("tr", head.map((h) => el("th", [text(h)])))]),
    el("tbody", rows.map((r) => el("tr", r.map((c) => el("td", [text(c)]))))),
  ]);
}

describe("rehypeTableLabels", () => {
  it("labels each cell with its column heading", () => {
    const tree = el("root", [table(["Term", "Origin"], [["Hit", "Popping"]])]);
    rehypeTableLabels()(tree);
    const tds = (tree as any).children[0].children[1].children[0].children;
    expect(tds.map((td: any) => td.properties.dataLabel)).toEqual(["Term", "Origin"]);
  });

  it("reads headings through inline markup", () => {
    const head = el("thead", [el("tr", [el("th", [el("strong", [text("Time")])])])]);
    const tree = el("root", [el("table", [head, el("tbody", [el("tr", [el("td", [text("Quick")])])])])]);
    rehypeTableLabels()(tree);
    expect((tree as any).children[0].children[1].children[0].children[0].properties.dataLabel).toBe("Time");
  });

  it("leaves cells unlabelled under an empty heading", () => {
    const tree = el("root", [table(["", ""], [["Rite", "Ritual"]])]);
    rehypeTableLabels()(tree);
    const td = (tree as any).children[0].children[1].children[0].children[0];
    expect(td.properties.dataLabel).toBeUndefined();
  });
});
