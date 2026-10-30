// Copies each table column heading onto its cells as data-label, so a table
// can stack into labelled blocks on a phone (see the Rite Tec page CSS).

const textOf = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(textOf).join("");

const childrenNamed = (node, name) =>
  (node.children ?? []).filter((c) => c.type === "element" && c.tagName === name);

function labelTable(table) {
  const head = childrenNamed(table, "thead")[0];
  const headRow = head && childrenNamed(head, "tr")[0];
  if (!headRow) return;
  const labels = childrenNamed(headRow, "th").map((th) => textOf(th).trim());
  for (const body of childrenNamed(table, "tbody")) {
    for (const row of childrenNamed(body, "tr")) {
      childrenNamed(row, "td").forEach((td, i) => {
        if (labels[i]) td.properties = { ...td.properties, dataLabel: labels[i] };
      });
    }
  }
}

function walk(node) {
  if (node.type === "element" && node.tagName === "table") labelTable(node);
  for (const child of node.children ?? []) walk(child);
}

export default function rehypeTableLabels() {
  return (tree) => walk(tree);
}
