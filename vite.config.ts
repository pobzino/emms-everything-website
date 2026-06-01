import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/emms-everything-website/" : "/",
  server: {
    host: "0.0.0.0",
  },
});
