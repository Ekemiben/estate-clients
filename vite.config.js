import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/server':{
        target:"http://localhost:5000",
        // target:"https://estate-api-9m5u.onrender.com/",
        
        secure:false,
      }
    }
  },
  plugins: [react()],
})
