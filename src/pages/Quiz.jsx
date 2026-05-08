import { useState } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const QUESTIONS = [
  {
    q: 'Which shark can detect one drop of blood in 25 gallons of water?',
    options: ['Bull Shark', 'Great White Shark', 'Hammerhead Shark', 'Tiger Shark'],
    answer: 1,
    fact: 'Great Whites have an extraordinary olfactory system — up to two-thirds of their brain is devoted to smell.',
  },
  {
    q: 'What is the largest fish in the ocean?',
    options: ['Great White Shark', 'Mako Shark', 'Whale Shark', 'Tiger Shark'],
    answer: 2,
    fact: 'Whale Sharks can reach 18 m (60 ft) and weigh over 20 tonnes, yet feed only on plankton.',
  },
  {
    q: 'Which shark is known to swim in freshwater rivers?',
    options: ['Blue Shark', 'Nurse Shark', 'Lemon Shark', 'Bull Shark'],
    answer: 3,
    fact: 'Bull Sharks have specialised kidneys that allow them to regulate salt levels, enabling river travel.',
  },
  {
    q: 'The Hammerhead\'s unusual head shape is called a…',
    options: ['Rostrum', 'Cephalofoil', 'Ampullae', 'Spiracle'],
    answer: 1,
    fact: 'The cephalofoil spreads sensory organs wider, giving Hammerheads superior 360° vision and electrosense.',
  },
  {
    q: 'Which organ do sharks use to detect electrical fields?',
    options: ['Lateral line', 'Pineal gland', 'Ampullae of Lorenzini', 'Olfactory bulb'],
    answer: 2,
    fact: 'The Ampullae of Lorenzini can sense the faint bio-electric fields produced by muscle contractions in prey.',
  },
  {
    q: 'What is the conservation status of the Oceanic Whitetip?',
    options: ['Least Concern', 'Vulnerable', 'Near Threatened', 'Critically Endangered'],
    answer: 3,
    fact: 'Oceanic Whitetip populations crashed >95% in the 20th century due to finning and bycatch.',
  },
  {
    q: 'Mako sharks are fastest in the ocean — approximate top speed?',
    options: ['20 km/h', '35 km/h', '56 km/h', '80 km/h'],
    answer: 2,
    fact: 'Shortfin Mako sharks are the fastest sharks, capable of bursts up to 70 km/h thanks to their crescent tail.',
  },
]

export default function Quiz() {
  const [current,  setCurrent]  = useState(0)
  const [selected, setSelected] = useState(null)
  const [score,    setScore]    = useState(0)
  const [finished, setFinished] = useState(false)

  const q = QUESTIONS[current]

  function choose(idx) {
    if (selected !== null) return
    setSelected(idx)
    if (idx === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  const pct = Math.round((score / QUESTIONS.length) * 100)

  return (
    <SectionWrapper>
      <div className="text-center mb-10">
        <Badge variant="coral" className="mb-3">Shark Knowledge</Badge>
        <h1 className="section-title">Shark Quiz</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          How well do you know the ocean's apex predators?
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        {finished ? (
          <Card hover={false} className="text-center py-12 space-y-6">
            <p className="text-6xl">
              {pct >= 85 ? '🏆' : pct >= 57 ? '🦈' : '🐟'}
            </p>
            <div>
              <p className="font-display text-4xl font-black text-gradient-ocean">{score}/{QUESTIONS.length}</p>
              <p className="text-ocean-300 mt-1">
                {pct >= 85 ? 'Shark Expert!' : pct >= 57 ? 'Reef Ranger' : 'Keep studying!'}
              </p>
            </div>
            <div className="w-full bg-ocean-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-ocean-400 to-seafoam-400 h-3 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <button onClick={restart} className="btn-primary mx-auto">
              Try Again
            </button>
          </Card>
        ) : (
          <Card hover={false} className="space-y-5">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-ocean-400">
              <span>Question {current + 1} / {QUESTIONS.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="w-full bg-ocean-800 rounded-full h-1.5">
              <div
                className="bg-ocean-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(current / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <p className="text-white font-semibold text-lg leading-snug">{q.q}</p>

            {/* Options */}
            <ul className="space-y-2.5">
              {q.options.map((opt, idx) => {
                let style = 'border-ocean-700/50 text-ocean-200 hover:border-ocean-500'
                if (selected !== null) {
                  if (idx === q.answer)      style = 'border-seafoam-500 bg-seafoam-500/10 text-seafoam-400'
                  else if (idx === selected) style = 'border-coral-500 bg-coral-500/10 text-coral-400'
                  else                       style = 'border-ocean-800/40 text-ocean-600 opacity-50'
                }
                return (
                  <li key={idx}>
                    <button
                      onClick={() => choose(idx)}
                      disabled={selected !== null}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150 ${style} disabled:cursor-default`}
                    >
                      <span className="mr-2 text-xs font-bold opacity-50">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Fact reveal */}
            {selected !== null && (
              <div className="rounded-xl bg-ocean-800/60 border border-ocean-700/40 px-4 py-3">
                <p className="text-xs text-ocean-400 font-medium mb-1">Did you know?</p>
                <p className="text-ocean-200 text-sm leading-relaxed">{q.fact}</p>
              </div>
            )}

            {selected !== null && (
              <button onClick={next} className="btn-primary w-full justify-center">
                {current + 1 >= QUESTIONS.length ? 'See Results' : 'Next Question →'}
              </button>
            )}
          </Card>
        )}
      </div>
    </SectionWrapper>
  )
}
