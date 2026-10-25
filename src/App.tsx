import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { Layout } from './components/layout/Layout'

// Dynamic lazy imports for production bundle code-splitting
const Home = React.lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Discover = React.lazy(() => import('./pages/Discover').then((m) => ({ default: m.Discover })))
const Search = React.lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })))
const MovieDetails = React.lazy(() => import('./pages/MovieDetails').then((m) => ({ default: m.MovieDetails })))
const Mid = React.lazy(() => import('./pages/Mid').then((m) => ({ default: m.Mid })))
const Watchlist = React.lazy(() => import('./pages/Watchlist').then((m) => ({ default: m.Watchlist })))
const About = React.lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Contact = React.lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const NotFound = React.lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

export const App: React.FC = () => {
  return (
    <WatchlistProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="discover" element={<Discover />} />
            <Route path="mid" element={<Mid />} />
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
