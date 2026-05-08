import { createContext, useContext } from 'react'
import { useGameState } from '@/hooks/useGameState'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const game = useGameState()
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}

export const useGame = () => useContext(GameContext)
