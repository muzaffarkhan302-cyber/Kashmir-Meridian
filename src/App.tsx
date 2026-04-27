import { Routes, Route } from 'react-router'
import Home from './pages/Home.tsx'
import Builder from './pages/Builder.tsx'
import Itinerary from './pages/Itinerary.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/itinerary/:id" element={<Itinerary />} />
    </Routes>
  )
}
