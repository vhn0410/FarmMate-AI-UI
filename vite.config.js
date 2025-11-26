import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import fs from 'fs';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
      // https: {
      //   key: fs.readFileSync('./ssl/key.pem'),
      //   cert: fs.readFileSync('./ssl/cert.pem'),
      // },
      host: true, // important!
      port: 3005,
    },
    
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  
  }
})
