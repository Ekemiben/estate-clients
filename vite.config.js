// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server:{
//     proxy:{
//       '/server':{
//         // target:"http://localhost:5000",
//         target:"https://new-real-estate-7bkt.onrender.com",
      
//         secure:false,
//       }
//     }
//   },
//   plugins: [react()],
// })












import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: "https://new-real-estate-7bkt.onrender.com",
        changeOrigin: true,  // This can help with virtual hosted sites
        secure: false,
        // rewrite: (path) => path.replace(/^\/server/, ''), // Adjust the path if needed
      }
    }
  },
  plugins: [react()],
})

