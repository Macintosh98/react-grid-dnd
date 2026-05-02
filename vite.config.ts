import { defineConfig, esmExternalRequirePlugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "node:path";
import dts from "unplugin-dts/vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "lib/index.ts"),
      name: "ReactGridDnD",
      // the proper extensions will be added
      fileName: "react-grid-dnd",
      formats: ["es"],
    },
    rolldownOptions: {
      plugins: [
        esmExternalRequirePlugin({
          external: [/^react(-dom)?(\/.+)?$/],
        }),
      ],
    },
  },
  plugins: [
    react(),
    dts({ bundleTypes: true, tsconfigPath: "./tsconfig.app.json" }),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
