import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repo = process.env.GITHUB_REPOSITORY?.split("/").pop();
const base = process.env.VITE_BASE_PATH ||
  (repo && !repo.toLowerCase().endsWith(".github.io") ? `/${repo}/` : "/");

export default defineConfig({
  base,
  plugins: [react()],
  build: { cssMinify: false },
});
