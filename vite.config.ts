import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/emms-everything-website/",
  server: {
    host: "0.0.0.0",
  },
}));
