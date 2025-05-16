
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: true,
//     port: 8080,

//     // ✅ Add this proxy section to handle CORS
//     proxy: {
//       "/api/cricindia": {
//         target: "https://cric-india.com",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api\/cricindia/, ""),
//         secure: false,
//       },
//     },
//   },
//   plugins: [
//     react(),
//     mode === "development" && componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", 

  server: {
    host: true,
    port: 8080,
    proxy: {
      "/api/cricindia": {
        target: "https://cric-india.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cricindia/, ""),
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
