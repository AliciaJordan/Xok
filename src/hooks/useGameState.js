import { useState, useCallback, useEffect } from 'react'

const INITIAL = {
  xp: 0,
  scansCompleted: 0,
  speciesDiscovered: [],
  quizCorrect: 0,
  quizTotal: 0,
  achievements: [],
}

export const XP_PER_LEVEL = 500

export const ACHIEVEMENTS = [
  { id: 'first_scan',   name: 'First Contact',         desc: 'Complete your first shark scan',     icon: '🎯', xp: 100  },
  { id: 'scan_5',       name: 'Junior Biologist',       desc: 'Complete 5 shark scans',             icon: '🔬', xp: 200  },
  { id: 'scan_10',      name: 'Field Researcher',       desc: 'Complete 10 shark scans',            icon: '📊', xp: 500  },
  { id: 'scan_25',      name: 'Marine Scientist',       desc: 'Complete 25 shark scans',            icon: '🧬', xp: 1000 },
  { id: 'species_3',    name: 'Taxonomist',             desc: 'Discover 3 different species',       icon: '🦈', xp: 300  },
  { id: 'species_7',    name: 'Marine Expert',          desc: 'Discover 7 different species',       icon: '🌊', xp: 700  },
  { id: 'species_all',  name: 'Master Ichthyologist',   desc: 'Discover all 15 shark species',     icon: '🏆', xp: 2000 },
  { id: 'quiz_perfect', name: 'Shark Genius',           desc: 'Get a perfect score on the quiz',   icon: '🧠', xp: 500  },
  { id: 'legendary',    name: 'Rare Discovery',         desc: 'Identify a Legendary-rarity shark', icon: '⭐', xp: 1000 },
  { id: 'epic',         name: 'Epic Encounter',         desc: 'Identify an Epic-rarity shark',     icon: '💫', xp: 500  },
]

function loadState() {
  try {
    const raw = localStorage.getItem('xok-v2')
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL
  } catch { return INITIAL }
}

export function useGameState() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    try { localStorage.setItem('xok-v2', JSON.stringify(state)) } catch {}
  }, [state])

  const recordScan = useCallback((species) => {
    setState((s) => {
      const isNew     = !s.speciesDiscovered.includes(species.id)
      const newScans  = s.scansCompleted + 1
      const newFound  = isNew ? [...s.speciesDiscovered, species.id] : s.speciesDiscovered
      const rarityXP  = { Common: 50, Uncommon: 100, Rare: 200, Epic: 500, Legendary: 1000 }
      let gained = isNew ? (rarityXP[species.rarity] ?? 50) : 25

      const unlocked = [...s.achievements]
      const unlock = (id, cond) => {
        if (cond && !unlocked.includes(id)) {
          const def = ACHIEVEMENTS.find((a) => a.id === id)
          if (def) { unlocked.push(id); gained += def.xp }
        }
      }
      unlock('first_scan',   newScans  >= 1)
      unlock('scan_5',       newScans  >= 5)
      unlock('scan_10',      newScans  >= 10)
      unlock('scan_25',      newScans  >= 25)
      unlock('species_3',    newFound.length >= 3)
      unlock('species_7',    newFound.length >= 7)
      unlock('species_all',  newFound.length >= 15)
      unlock('legendary',    species.rarity === 'Legendary')
      unlock('epic',         species.rarity === 'Epic' || species.rarity === 'Legendary')

      return { ...s, xp: s.xp + gained, scansCompleted: newScans, speciesDiscovered: newFound, achievements: unlocked }
    })
  }, [])

  const recordQuiz = useCallback((correct, total) => {
    setState((s) => {
      let gained   = correct * 20
      const unlocked = [...s.achievements]
      if (correct === total && !unlocked.includes('quiz_perfect')) {
        unlocked.push('quiz_perfect'); gained += 500
      }
      return { ...s, xp: s.xp + gained, quizCorrect: s.quizCorrect + correct, quizTotal: s.quizTotal + total, achievements: unlocked }
    })
  }, [])

  const level      = Math.floor(state.xp / XP_PER_LEVEL) + 1
  const xpInLevel  = state.xp % XP_PER_LEVEL
  return { ...state, level, xpInLevel, xpToNext: XP_PER_LEVEL, recordScan, recordQuiz }
}
