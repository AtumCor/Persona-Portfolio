# Updating your portfolio without editing React components

1. Change the text, contact details, and skills in `src/data/site.ts`.
2. Add or edit example projects in `src/data/projects.ts`. Each project has a `slug`.
3. Add project photos in `src/media/projects/<slug>/`, such as `01-cover.jpg`, `02-process.jpg`.
4. Add other photo collections to `src/media/galleries/<gallery-name>/`.
5. Optionally give galleries custom titles or captions in `src/data/galleries.ts`.
6. Replace placeholder SVG portraits in `public/images/profile/` and update the paths in `src/data/site.ts`.
7. Run `npm run build` before pushing changes.

No photography or personal contact details are provided in this template. Only upload media you have the right to publish. Remove EXIF GPS metadata and check for names or faces before sharing a public repository.
