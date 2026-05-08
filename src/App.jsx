import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar          from '@/components/Navbar'
import Footer          from '@/components/Footer'
import Home            from '@/pages/Home'
import SharkClassifier from '@/pages/SharkClassifier'
import XokDex          from '@/pages/XokDex'
import Quiz            from '@/pages/Quiz'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/classifier" element={<SharkClassifier />} />
            <Route path="/xokdex"    element={<XokDex />} />
            <Route path="/quiz"      element={<Quiz />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
