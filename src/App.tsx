import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Builder from './pages/Builder'
import Itinerary from './pages/Itinerary'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/itinerary/:id" element={<Itinerary />} />
    </Routes>
  )
}
