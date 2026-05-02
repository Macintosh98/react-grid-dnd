import { defineConfig, esmExternalRequirePlugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "node:path";
import dts from "unplugin-dts/vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  base: "/", // for vercel dployee
  server: {
    port: 3000,
  },
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
    checker({
      typescript: {
        buildMode: true,
        tsconfigPath: "./tsconfig.app.json",
      },
      eslint: {
        useFlatConfig: true,
        watchPath: "./src/**/*.{js,jsx,ts,tsx}",
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
    }),
  ],
});
