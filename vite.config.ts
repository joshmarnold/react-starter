import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.mp3"],
  resolve: {
    alias: {
      "components": path.resolve(__dirname, "src/components"),
      "hooks": path.resolve(__dirname, "src/hooks"),
      "store": path.resolve(__dirname, "src/store"),
      src: path.resolve(__dirname, "src"), // Add this line
    },
  },
});
