import { useState, useEffect, useRef } from 'react'
import { useGame } from '@/context/GameContext'

const QUESTIONS = [
  { q: 'Which shark can detect one drop of blood in 100 litres of water from 400 m?', options: ['Bull Shark', 'Great White Shark', 'Hammerhead Shark', 'Tiger Shark'], answer: 1, fact: 'Up to two-thirds of the Great White\'s brain is dedicated to olfaction.', xp: 20 },
  { q: 'What is the largest fish on Earth?', options: ['Great White Shark', 'Mako Shark', 'Whale Shark', 'Tiger Shark'], answer: 2, fact: 'Whale Sharks reach 18 m and 20 tonnes, yet feed only on microscopic plankton.', xp: 20 },
  { q: 'Which shark swims in freshwater rivers?', options: ['Blue Shark', 'Nurse Shark', 'Lemon Shark', 'Bull Shark'], answer: 3, fact: 'Bull Sharks have specialised kidneys that regulate salt — they\'ve been found 3,700 km up the Amazon.', xp: 20 },
  { q: 'What is the Hammerhead\'s distinctive head shape called?', options: ['Rostrum', 'Cephalofoil', 'Ampullae', 'Spiracle'], answer: 1, fact: 'The cephalofoil spaces sensory organs wider, giving nearly 360° binocular vision.', xp: 25 },
  { q: 'Which organ do sharks use to detect bio-electric fields?', options: ['Lateral line', 'Pineal gland', 'Ampullae of Lorenzini', 'Olfactory bulb'], answer: 2, fact: 'The Ampullae of Lorenzini detect the faint electric fields produced by muscle contractions in prey.', xp: 30 },
  { q: 'Conservation status of the Oceanic Whitetip?', options: ['Least Concern', 'Vulnerable', 'Near Threatened', 'Critically Endangered'], answer: 3, fact: 'Oceanic Whitetip populations dropped >95% in 60 years due to finning and bycatch.', xp: 25 },
  { q: 'Approximate top speed of the Shortfin Mako?', options: ['20 km/h', '35 km/h', '56 km/h', '70 km/h'], answer: 3, fact: 'The Mako\'s crescent-shaped tail is built like a Formula 1 engine — pure thrust efficiency.', xp: 20 },
]

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const TIME_PER_Q    = 20

export default function Quiz() {
  const [current,  setCurrent]  = useState(0)
  const [selected, setSelected] = useState(null)
  const [score,    setScore]    = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q)
  const [streak,   setStreak]   = useState(0)
  const timerRef = useRef(null)
  const { recordQuiz } = useGame()

  const q = QUESTIONS[current]

  useEffect(() => {
    if (selected !== null || finished) return
    setTimeLeft(TIME_PER_Q)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); choose(-1); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [current, finished]) // eslint-disable-line

  function choose(idx) {
    if (selected !== null) return
    clearInterval(timerRef.current)
    setSelected(idx)
    if (idx === q.answer) {
      const bonus  = streak >= 2 ? Math.floor(q.xp * 0.5) : 0
      const gained = q.xp + bonus
      setScore((s) => s + 1)
      setXpEarned((x) => x + gained)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    if (current + 1 >= QUESTIONS.length) {
      recordQuiz(score + (selected === q.answer ? 1 : 0), QUESTIONS.length)
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
    }
  }

  function restart() {
    setCurrent(0); setSelected(null); setScore(0); setXpEarned(0)
    setFinished(false); setStreak(0); setTimeLeft(TIME_PER_Q)
  }

  const finalScore = finished ? score : score + (selected === q?.answer ? 1 : 0)
  const pct        = Math.round((finalScore / QUESTIONS.length) * 100)
  const timePct    = (timeLeft / TIME_PER_Q) * 100
  const timerColor = timeLeft <= 5 ? '#c03030' : timeLeft <= 10 ? '#d08020' : '#20a060'

  if (finished) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 space-y-6">
        <div className="aero-panel p-8 text-center space-y-6 animate-fade-in-up">
          <div style={{ fontSize: '4rem' }}>
            {pct === 100 ? '🏆' : pct >= 71 ? '🦈' : pct >= 42 ? '🌊' : '🐡'}
          </div>
          <div>
            <p className="holo-label">Mission Complete</p>
            <p
              className="font-display text-5xl font-black mt-2"
              style={{ color: '#0a3060' }}
            >
              {finalScore}/{QUESTIONS.length}
            </p>
            <p className="aero-subtitle mt-1">
              {pct === 100 ? 'Shark Genius — Perfect Score!' : pct >= 71 ? 'Marine Expert' : pct >= 42 ? 'Reef Ranger' : 'Keep Diving'}
            </p>
          </div>

          <div className="vista-progress-track h-4">
            <div className="vista-progress-fill" style={{ width: `${pct}%` }} />
          </div>

          <div
            className="flex items-center justify-between rounded-2xl px-5 py-3"
            style={{ background: 'rgba(220,248,235,0.8)', border: '1px solid rgba(34,165,90,0.3)' }}
          >
            <span style={{ color: '#1a7040', fontSize: '0.78rem', fontWeight: 600 }}>XP Earned This Session</span>
            <span style={{ color: '#18803a', fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Nunito, sans-serif' }}>+{xpEarned}</span>
          </div>

          <button onClick={restart} className="btn-aqua w-full justify-center">
            ↺ Play Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-5">

      {/* HUD */}
      <div className="aero-panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="holo-label">Question</p>
              <p className="font-display font-black text-xl" style={{ color: '#0a3060' }}>{current + 1} / {QUESTIONS.length}</p>
            </div>
            <div>
              <p className="holo-label">Score</p>
              <p className="font-display font-black text-xl" style={{ color: '#1878c8' }}>{score}</p>
            </div>
            {streak >= 2 && (
              <div
                className="px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,245,210,0.85)', border: '1px solid rgba(217,119,6,0.35)' }}
              >
                <p className="text-xs font-bold" style={{ color: '#b45309', letterSpacing: '0.05em' }}>
                  🔥 {streak}× Streak
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="holo-label">Time</p>
            <p
              className="font-mono font-black text-2xl"
              style={{ color: timerColor }}
            >
              {String(timeLeft).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Timer bar */}
        <div className="mt-3 vista-progress-track h-2">
          <div
            className="h-full rounded-full transition-all duration-1000 linear"
            style={{
              width: `${timePct}%`,
              background: `linear-gradient(90deg, ${timerColor}88, ${timerColor})`,
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.4)', borderRadius: 999 }} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="aero-panel p-6 space-y-5">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === current ? 20 : 8, height: 8,
                background: i < current ? '#1878c8' : i === current ? '#22a55a' : 'rgba(160,200,240,0.4)',
                boxShadow:  i === current ? '0 0 6px rgba(34,165,90,0.5)' : 'none',
              }}
            />
          ))}
        </div>

        <p
          className="font-display font-bold text-lg leading-snug text-center"
          style={{ color: '#0a3060' }}
        >
          {q.q}
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          {q.options.map((opt, idx) => {
            const isAnswer   = idx === q.answer
            const isSelected = idx === selected
            const showResult = selected !== null

            let bg     = 'rgba(255,255,255,0.75)'
            let border = 'rgba(160,210,240,0.5)'
            let color  = '#1a4060'

            if (showResult) {
              if (isAnswer)        { bg = 'rgba(220,250,235,0.9)'; border = 'rgba(34,165,90,0.55)'; color = '#18703a' }
              else if (isSelected) { bg = 'rgba(255,220,220,0.9)'; border = 'rgba(192,48,48,0.45)'; color = '#902020' }
              else                 { color = 'rgba(100,140,180,0.6)' }
            }

            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={selected !== null}
                className="w-full text-left rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-200 disabled:cursor-default"
                style={{
                  border: `1px solid ${border}`,
                  background: bg,
                  color,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                <span
                  className="flex-shrink-0 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    width: 28, height: 28,
                    background: showResult && isAnswer ? 'rgba(34,165,90,0.15)' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${border}`,
                    color,
                  }}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-sm font-semibold">{opt}</span>
                {showResult && isAnswer && <span className="ml-auto text-base">✓</span>}
                {showResult && isSelected && !isAnswer && <span className="ml-auto text-base">✗</span>}
              </button>
            )
          })}
        </div>

        {/* Fact reveal */}
        {selected !== null && (
          <div
            className="rounded-2xl p-4 animate-fade-in-up"
            style={{ background: 'rgba(220,242,255,0.8)', border: '1px solid rgba(160,210,240,0.5)' }}
          >
            <p className="holo-label mb-1.5">🌊 Ocean Fact</p>
            <p style={{ color: '#1a5080', fontSize: '0.85rem', lineHeight: 1.55 }}>{q.fact}</p>
            {streak >= 2 && selected === q.answer && (
              <p style={{ color: '#18803a', fontSize: '0.68rem', marginTop: '0.5rem', fontWeight: 600 }}>
                🔥 Streak Bonus: +{Math.floor(q.xp * 0.5)} XP
              </p>
            )}
          </div>
        )}

        {selected !== null && (
          <button onClick={next} className="btn-aqua w-full justify-center">
            {current + 1 >= QUESTIONS.length ? '🏆 View Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}
