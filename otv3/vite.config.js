import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path"

function aH(a=0,b=0,c=0){
  console.log("AH --------------- Ah ",a,b,c);
  return 0;
}
const aaH = aH;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "/otv3Config": fileURLToPath(new URL('./otv3.config.json', import.meta.url)),
      "/aH": aaH,
      "@yss-libs": path.resolve(__dirname,'src/assets/ySS_calibration/libs')
    }
  }
})
