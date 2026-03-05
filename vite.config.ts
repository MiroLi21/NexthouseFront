import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env": process.env,
  },
  //  base: process.env.NODE_ENV === "production" ? "/medicinex" : "/",
  base: process.env.NODE_ENV === "production" ? "/" : "/",
  server: {
    port: 2002,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/Nexthouse/public/storage": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
});
