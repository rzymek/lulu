import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pegjs from "rollup-plugin-pegjs";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/lulu/',
  plugins: [react(), pegjs()]
})
