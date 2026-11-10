import { writeFileSync } from "node:fs";

const repo = process.env.GITHUB_REPOSITORY?.split("/").pop();
const base = process.env.VITE_BASE_PATH ||
  (repo && !repo.toLowerCase().endsWith(".github.io") ? `/${repo}/` : "/");

// GitHub Pages serves this file for deep-linked client-side routes.
// Store the original URL and return to the app's root; main.tsx restores it.
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Redirecting...</title></head><body><script>sessionStorage.setItem("redirect", location.href);location.replace(${JSON.stringify(base)});</script></body></html>`;
writeFileSync("dist/404.html", html);
