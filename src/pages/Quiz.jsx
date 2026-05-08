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
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [score,     setScore]     = useState(0)
  const [xpEarned,  setXpEarned]  = useState(0)
  const [finished,  setFinished]  = useState(false)
  const [timeLeft,  setTimeLeft]  = useState(TIME_PER_Q)
  const [streak,    setStreak]    = useState(0)
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
    const correct = idx === q.answer
    if (correct) {
      const bonus   = streak >= 2 ? Math.floor(q.xp * 0.5) : 0
      const gained  = q.xp + bonus
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

  const finalScore  = finished ? score : score + (selected === q?.answer ? 1 : 0)
  const pct         = Math.round((finalScore / QUESTIONS.length) * 100)
  const timePct     = (timeLeft / TIME_PER_Q) * 100
  const timerColor  = timeLeft <= 5 ? '#f87171' : timeLeft <= 10 ? '#fbbf24' : '#00ff88'

  if (finished) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 space-y-6">
        <div className="aero-panel p-8 text-center space-y-6 animate-fade-in-up">
          <div style={{ fontSize: '4rem' }}>
            {pct === 100 ? '🏆' : pct >= 71 ? '🦈' : pct >= 42 ? '🌊' : '🐡'}
          </div>
          <div>
            <p className="holo-label">MISSION COMPLETE</p>
            <p
              className="font-display text-5xl font-black mt-2"
              style={{
                background: 'linear-gradient(135deg, #fff, #22ccff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              {finalScore}/{QUESTIONS.length}
            </p>
            <p className="aero-subtitle mt-1">
              {pct === 100 ? 'SHARK GENIUS — PERFECT SCORE!' : pct >= 71 ? 'MARINE EXPERT' : pct >= 42 ? 'REEF RANGER' : 'KEEP DIVING'}
            </p>
          </div>

          {/* Score bar */}
          <div className="vista-progress-track h-4">
            <div className="vista-progress-fill" style={{ width: `${pct}%` }} />
          </div>

          {/* XP */}
          <div
            className="flex items-center justify-between rounded-xl px-5 py-3"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)' }}
          >
            <span className="terminal-text">XP EARNED THIS SESSION</span>
            <span className="terminal-text font-black text-xl">+{xpEarned}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={restart} className="btn-aqua flex-1 justify-center">
              ↺ PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-5">

      {/* Header HUD */}
      <div className="aero-panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="holo-label">QUESTION</p>
              <p className="font-display font-black text-xl text-white">{current + 1} / {QUESTIONS.length}</p>
            </div>
            <div>
              <p className="holo-label">SCORE</p>
              <p className="font-display font-black text-xl" style={{ color: '#22ccff' }}>{score}</p>
            </div>
            {streak >= 2 && (
              <div
                className="px-3 py-1 rounded-full"
                style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' }}
              >
                <p className="text-xs font-bold" style={{ color: '#fbbf24', fontFamily: 'Courier New', letterSpacing: '0.05em' }}>
                  🔥 {streak}× STREAK
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="holo-label">TIME</p>
            <p
              className="font-mono font-black text-2xl"
              style={{ color: timerColor, textShadow: `0 0 12px ${timerColor}80` }}
            >
              {String(timeLeft).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Time bar */}
        <div className="mt-3 vista-progress-track h-2">
          <div
            className="h-full rounded-full transition-all duration-1000 linear"
            style={{
              width: `${timePct}%`,
              background: `linear-gradient(90deg, ${timerColor}88, ${timerColor})`,
              boxShadow: `0 0 8px ${timerColor}60`,
            }}
          />
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
                background: i < current ? '#22ccff' : i === current ? '#00ff88' : 'rgba(0,100,160,0.3)',
                boxShadow:  i === current ? '0 0 8px #00ff88' : 'none',
              }}
            />
          ))}
        </div>

        <p
          className="font-display font-bold text-lg text-white leading-snug text-center"
          style={{ textShadow: '0 0 20px rgba(0,200,255,0.2)' }}
        >
          {q.q}
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          {q.options.map((opt, idx) => {
            const isAnswer   = idx === q.answer
            const isSelected = idx === selected
            const showResult = selected !== null

            let borderColor = 'rgba(0,100,180,0.3)'
            let bgColor     = 'rgba(0,15,40,0.7)'
            let textColor   = 'rgba(160,210,240,0.85)'
            let glowColor   = 'none'

            if (showResult) {
              if (isAnswer)         { borderColor = '#00ff88'; bgColor = 'rgba(0,255,136,0.08)'; textColor = '#00ff88'; glowColor = '0 0 15px rgba(0,255,136,0.25)' }
              else if (isSelected)  { borderColor = '#f87171'; bgColor = 'rgba(248,113,113,0.08)'; textColor = '#f87171'; glowColor = '0 0 15px rgba(248,113,113,0.2)' }
              else                  { textColor = 'rgba(100,140,180,0.35)' }
            }

            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={selected !== null}
                className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200 disabled:cursor-default"
                style={{ border: `1px solid ${borderColor}`, background: bgColor, boxShadow: glowColor, color: textColor }}
              >
                <span
                  className="flex-shrink-0 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    width: 28, height: 28,
                    background: showResult && isAnswer ? '#00ff8820' : 'rgba(0,60,120,0.5)',
                    border: `1px solid ${borderColor}`,
                    fontFamily: 'Courier New, monospace',
                    color: textColor,
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
            className="rounded-xl p-4 animate-fade-in-up"
            style={{ background: 'rgba(0,200,255,0.05)', border: '1px solid rgba(0,200,255,0.2)' }}
          >
            <p className="holo-label mb-1.5">◈ SPECIMEN FACT</p>
            <p className="text-aqua-200 text-sm leading-relaxed">{q.fact}</p>
            {streak >= 2 && selected === q.answer && (
              <p className="terminal-text mt-2" style={{ fontSize: '0.65rem' }}>
                🔥 STREAK BONUS: +{Math.floor(q.xp * 0.5)} XP
              </p>
            )}
          </div>
        )}

        {selected !== null && (
          <button onClick={next} className="btn-aqua w-full justify-center">
            {current + 1 >= QUESTIONS.length ? '◈ VIEW RESULTS' : 'NEXT QUESTION →'}
          </button>
        )}
      </div>
    </div>
  )
}
