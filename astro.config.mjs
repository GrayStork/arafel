import { defineConfig } from "astro/config";
import rehypeTableLabels from "./src/rehype-table-labels.mjs";

export default defineConfig({
  site: "https://arafel.net",
  output: "static",
  trailingSlash: "ignore",
  markdown: { rehypePlugins: [rehypeTableLabels] },
});
