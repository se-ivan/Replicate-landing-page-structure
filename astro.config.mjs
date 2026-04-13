import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(process.cwd(), "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [figmaAssetResolver(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
      },
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
  },
});
