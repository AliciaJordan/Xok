import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider }  from '@/context/GameContext'
import BubbleBackground  from '@/components/aero/BubbleBackground'
import LightRays         from '@/components/aero/LightRays'
import Navbar            from '@/components/Navbar'
import Footer            from '@/components/Footer'
import Home              from '@/pages/Home'
import SharkClassifier   from '@/pages/SharkClassifier'
import XokDex            from '@/pages/XokDex'
import Quiz              from '@/pages/Quiz'
import Achievements      from '@/pages/Achievements'

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative">
          <BubbleBackground />
          <LightRays />
          <Navbar />
          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/classifier"  element={<SharkClassifier />} />
              <Route path="/xokdex"      element={<XokDex />} />
              <Route path="/quiz"        element={<Quiz />} />
              <Route path="/achievements" element={<Achievements />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </GameProvider>
  )
}
