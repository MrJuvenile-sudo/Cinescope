import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] relative">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--primary)] focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-xl focus:outline-none focus-visible:outline-2 focus-visible:outline-white"
      >
        Skip to main content
      </a>

      {/* Pathname-based scroll to top */}
      <ScrollToTop />

      {/* Global Header */}
      <Header />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Sonner toast provider styled with Midnight Cinema tokens */}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border-strong)',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}
