# arafel.net

Architect by day, Eidolon by night, and Rite Tec between them. A static site built with Astro in the Eidolon v1 visual language and deployed to GitHub Pages on every push to `main`.

```bash
npm ci
npm run dev     # http://localhost:4321
npm test
npm run build   # dist/
```

- `src/worlds.ts`: the worlds and where each one lives. Every cross-world link goes through it.
- `src/layouts`, `src/components`, `src/pages`: the site.
- `design-system/eidolon-v1/css/eidolon.css`: the one stylesheet, used as is.
- `design-system/eidolon-v1/img/`: faces and photographs, served at `/kit/img/`.
