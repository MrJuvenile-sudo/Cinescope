/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dns from 'node:dns'
import https from 'node:https'

// Configure a custom DNS resolver using Google and Cloudflare DNS to bypass local ISP DNS poisoning
const resolver = new dns.Resolver()
resolver.setServers(['8.8.8.8', '1.1.1.1'])

function customLookup(
  hostname: string,
  options: any,
  callback: (err: NodeJS.ErrnoException | null, address: any, family?: number) => void
) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (hostname === 'api.themoviedb.org') {
    resolver.resolve4(hostname, (err, addresses) => {
      if (err) return callback(err, '')
      if (options && options.all) {
        callback(null, addresses.map((a) => ({ address: a, family: 4 })))
      } else {
        callback(null, addresses[0], 4)
      }
    })
  } else {
    dns.lookup(hostname, options, callback)
  }
}

const tmdbAgent = new https.Agent({ lookup: customLookup })

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/tmdb-proxy': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-proxy/, ''),
        agent: tmdbAgent,
        secure: true,
      },
    },
  },
  preview: {
    proxy: {
      '/tmdb-proxy': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-proxy/, ''),
        agent: tmdbAgent,
        secure: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})

