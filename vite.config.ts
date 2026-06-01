import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? "/emms-everything-website/" : "/",
  server: {
    host: "0.0.0.0",
  },
}));
