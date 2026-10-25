import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Discover } from './pages/Discover'
import { Search } from './pages/Search'
import { MovieDetails } from './pages/MovieDetails'
import { Watchlist } from './pages/Watchlist'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'

export const App: React.FC = () => {
  return (
    <WatchlistProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="discover" element={<Discover />} />
            <Route path="search" element={<Search />} />
            <Route path="movie/:movieId" element={<MovieDetails />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WatchlistProvider>
  )
}

export default App
