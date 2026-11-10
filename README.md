# Persona-style creative portfolio template

A reusable Vite + React + TypeScript portfolio with GSAP transitions, a Persona-inspired landing page, a Final Fantasy-inspired about layout, individual project pages, and photography/graphic-design archives.

**This is an anonymized software template.** It contains no original profile portraits, client photographs, personal contact details, or project artwork. All sample copy, projects, and illustrations are placeholders.

## Quick start

Requires Node.js 24 and npm.

```bash
npm ci
npm run dev
```

To check the production build: `npm run build`.

## Edit your content

- Name, intro, skills, portrait paths and contact links: `src/data/site.ts`
- Projects, categories and descriptions: `src/data/projects.ts`
- Optional gallery titles and captions: `src/data/galleries.ts`
- Photos for projects: `src/media/projects/<project-slug>/`
- Photo collections: `src/media/galleries/<gallery-slug>/`
- Portraits: replace the demo SVGs in `public/images/profile/` and update `src/data/site.ts`

Use JPG, PNG, WebP, or AVIF. Media files are discovered by Vite at build time. Each project slug must match its media folder.

## GitHub Pages

The deploy workflow runs for `main`. On GitHub Actions, the build automatically configures the base path for either a user site (`username.github.io`) or a project site (`username.github.io/repository/`). Routes are restored through a generated `404.html` file. Enable Pages with **GitHub Actions** as the source in repository settings.

If using a custom domain, set the `VITE_BASE_PATH` environment variable to `/` in the build environment.

## Safety before publishing

Review every image and link you add. Photos may expose a person, license plate, address, or EXIF location metadata. Use properly licensed assets, and do not copy the original portfolio's Git history or personal-media folders.

MIT-licensed template code. Images and artwork added by other people are not included in that license.
