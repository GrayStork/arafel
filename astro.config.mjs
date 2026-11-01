import { defineConfig } from "astro/config";
import rehypeTableLabels from "./src/rehype-table-labels.mjs";

// The components gallery exists on the dev server only; it never ships with the site.
const devGallery = {
  name: "dev-gallery",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command === "dev") injectRoute({ pattern: "/components", entrypoint: "./src/dev/components.astro" });
    },
  },
};

export default defineConfig({
  site: "https://arafel.net",
  output: "static",
  trailingSlash: "ignore",
  markdown: { rehypePlugins: [rehypeTableLabels] },
  integrations: [devGallery],
});
