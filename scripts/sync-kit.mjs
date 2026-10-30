// Copies the kit's images into public/kit so pages can reference /kit/img/...
// The stylesheet itself is imported by the layout and bundled by Astro.
import { cpSync, rmSync } from "node:fs";

rmSync("public/kit", { recursive: true, force: true });
cpSync("design-system/eidolon-v1/img", "public/kit/img", { recursive: true });
