import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(src)) return
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name)
    const destPath = resolve(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Ensures complete compatibility for nested static routes (home2, home3)
 * whether accessed as:
 * - /home2/ (serves home2/index.html with ../assets/ or ./assets/ fallback)
 * - /home2 (cleanUrl redirect/rewrite)
 * - /home2.html (direct flat file)
 * under any subpath deployment (e.g., /smart-map-phase2-D4/).
 */
function multiPageStaticRoutingPlugin(): Plugin {
  return {
    name: 'multi-page-static-routing',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist')
      const assetsDir = resolve(distDir, 'assets')
      const faviconFile = resolve(distDir, 'favicon.svg')

      for (const page of ['home2', 'home3', 'home4'] as const) {
        const pageDir = resolve(distDir, page)
        const pageIndexHtml = resolve(pageDir, 'index.html')
        const pageFlatHtml = resolve(distDir, `${page}.html`)

        // 1. Ensure dist/<page>/assets contains the bundle assets
        // This guarantees that requests for <base>/<page>/assets/... also succeed 100%
        const pageAssetsDir = resolve(pageDir, 'assets')
        if (fs.existsSync(assetsDir)) {
          copyDirSync(assetsDir, pageAssetsDir)
        }

        // 2. Ensure dist/<page>/favicon.svg exists
        if (fs.existsSync(faviconFile)) {
          fs.copyFileSync(faviconFile, resolve(pageDir, 'favicon.svg'))
        }

        // 3. Ensure dist/<page>/index.html exists and has ../assets/ and ../favicon.svg
        if (fs.existsSync(pageIndexHtml)) {
          let html = fs.readFileSync(pageIndexHtml, 'utf-8')
          // Normalize relative asset paths to parent directory
          html = html.replace(/(src|href)=["']\.\/assets\//g, '$1="../assets/')
          html = html.replace(/(src|href)=["']\.\/favicon\.svg["']/g, '$1="../favicon.svg"')
          fs.writeFileSync(pageIndexHtml, html, 'utf-8')

          // 4. Generate dist/<page>.html with ./assets/ and ./favicon.svg for flat file servers
          let flatHtml = html.replace(/(src|href)=["']\.\.\/assets\//g, '$1="./assets/')
          flatHtml = flatHtml.replace(/(src|href)=["']\.\.\/favicon\.svg["']/g, '$1="./favicon.svg"')
          fs.writeFileSync(pageFlatHtml, flatHtml, 'utf-8')
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), multiPageStaticRoutingPlugin()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home2: resolve(__dirname, 'home2/index.html'),
        home3: resolve(__dirname, 'home3/index.html'),
        home4: resolve(__dirname, 'home4/index.html'),
      },
    },
  },
})
