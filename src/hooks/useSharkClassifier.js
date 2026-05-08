import { useState, useCallback, useRef } from 'react'

export const MODEL_PATH = '/models/shark-classifier/model.json'

export const SHARK_CLASSES = [
  {
    id: 0, name: 'Great White Shark', latin: 'Carcharodon carcharias',
    status: 'Vulnerable', danger: 'High', depth: '0–1200 m', rarity: 'Rare',
    habitat: 'Temperate coastal & offshore waters worldwide',
    fact: 'Can detect a single drop of blood diluted in 100 L of water from over 400 m away.',
    xpReward: 200,
  },
  {
    id: 1, name: 'Hammerhead Shark', latin: 'Sphyrna lewini',
    status: 'Critically Endangered', danger: 'Medium', depth: '0–1000 m', rarity: 'Uncommon',
    habitat: 'Warm temperate and tropical oceans, coastal to offshore',
    fact: 'The wide-set eyes give Hammerheads nearly 360° binocular vision — they can see above and below simultaneously.',
    xpReward: 100,
  },
  {
    id: 2, name: 'Tiger Shark', latin: 'Galeocerdo cuvier',
    status: 'Near Threatened', danger: 'High', depth: '0–900 m', rarity: 'Uncommon',
    habitat: 'Tropical and subtropical coastal waters, harbour mouths',
    fact: 'Tiger Sharks are second only to Great Whites in documented attacks — and will eat almost anything, including license plates.',
    xpReward: 100,
  },
  {
    id: 3, name: 'Bull Shark', latin: 'Carcharhinus leucas',
    status: 'Near Threatened', danger: 'High', depth: '0–150 m', rarity: 'Common',
    habitat: 'Shallow, warm ocean waters; estuaries; freshwater rivers',
    fact: 'Bull Sharks can survive in fresh water. They have been found 3,700 km up the Amazon River.',
    xpReward: 50,
  },
  {
    id: 4, name: 'Whale Shark', latin: 'Rhincodon typus',
    status: 'Endangered', danger: 'Low', depth: '0–1928 m', rarity: 'Epic',
    habitat: 'Open warm oceans, tropical seas',
    fact: 'The world\'s largest fish — up to 18 m long — yet feeds only on tiny plankton filtered through its massive mouth.',
    xpReward: 500,
  },
  {
    id: 5, name: 'Blue Shark', latin: 'Prionace glauca',
    status: 'Near Threatened', danger: 'Low', depth: '0–1000 m', rarity: 'Common',
    habitat: 'Pelagic, temperate and tropical oceans worldwide',
    fact: 'Blue Sharks are among the fastest fish in the sea and migrate across entire ocean basins.',
    xpReward: 50,
  },
  {
    id: 6, name: 'Mako Shark', latin: 'Isurus oxyrinchus',
    status: 'Endangered', danger: 'Medium', depth: '0–500 m', rarity: 'Rare',
    habitat: 'Open ocean, temperate and tropical waters',
    fact: 'The Shortfin Mako is the fastest shark on Earth, capable of bursting up to 70 km/h with its crescent-shaped tail.',
    xpReward: 200,
  },
  {
    id: 7, name: 'Nurse Shark', latin: 'Ginglymostoma cirratum',
    status: 'Vulnerable', danger: 'Low', depth: '0–130 m', rarity: 'Common',
    habitat: 'Shallow tropical reefs, mangroves, sandy bottoms',
    fact: 'Nurse Sharks spend most of the day resting motionless on the sea floor — they can pump water over their gills without swimming.',
    xpReward: 50,
  },
  {
    id: 8, name: 'Blacktip Reef Shark', latin: 'Carcharhinus melanopterus',
    status: 'Near Threatened', danger: 'Low', depth: '0–80 m', rarity: 'Common',
    habitat: 'Tropical coral reefs and shallow lagoons in the Indo-Pacific',
    fact: 'Blacktip Reef Sharks are extremely shy — they flee at the approach of snorkelers despite their fearsome reputation.',
    xpReward: 50,
  },
  {
    id: 9, name: 'Oceanic Whitetip', latin: 'Carcharhinus longimanus',
    status: 'Critically Endangered', danger: 'High', depth: '0–1000 m', rarity: 'Epic',
    habitat: 'Open ocean, tropical and subtropical worldwide',
    fact: 'Once one of the most abundant large animals on Earth — now critically endangered due to finning. Populations fell >95% in 60 years.',
    xpReward: 500,
  },
  {
    id: 10, name: 'Lemon Shark', latin: 'Negaprion brevirostris',
    status: 'Vulnerable', danger: 'Low', depth: '0–92 m', rarity: 'Common',
    habitat: 'Subtropical shallow-water coastal environments',
    fact: 'Lemon Sharks are uniquely social — they form groups and exhibit learned social behaviours similar to primates.',
    xpReward: 50,
  },
  {
    id: 11, name: 'Thresher Shark', latin: 'Alopias vulpinus',
    status: 'Vulnerable', danger: 'Low', depth: '0–500 m', rarity: 'Rare',
    habitat: 'Pelagic, temperate and tropical open ocean',
    fact: 'Uses its enormous tail — up to half its body length — to whip and stun prey at speeds exceeding 30 mph.',
    xpReward: 200,
  },
  {
    id: 12, name: 'Sand Tiger Shark', latin: 'Carcharias taurus',
    status: 'Critically Endangered', danger: 'Low', depth: '0–191 m', rarity: 'Uncommon',
    habitat: 'Shallow coastal waters, reefs, sandy flats',
    fact: 'Despite their menacing appearance, Sand Tigers are docile. They swallow air to achieve neutral buoyancy.',
    xpReward: 100,
  },
  {
    id: 13, name: 'Caribbean Reef Shark', latin: 'Carcharhinus perezi',
    status: 'Endangered', danger: 'Low', depth: '0–30 m', rarity: 'Uncommon',
    habitat: 'Coral reefs of the western Atlantic and Caribbean Sea',
    fact: 'Caribbean Reef Sharks enter a trance-like state called "tonic immobility" when turned upside down by researchers.',
    xpReward: 100,
  },
  {
    id: 14, name: 'Zebra Shark', latin: 'Stegostoma tigrinum',
    status: 'Endangered', danger: 'Low', depth: '5–62 m', rarity: 'Legendary',
    habitat: 'Tropical Indo-Pacific coral reefs and sandy lagoons',
    fact: 'Juveniles have yellow-and-black stripes that shift to adult spots. In 2016 a female Zebra Shark reproduced asexually after 4 years without a mate.',
    xpReward: 1000,
  },
]

function softmax(arr) {
  const max  = Math.max(...arr)
  const exps = arr.map((x) => Math.exp(x - max))
  const sum  = exps.reduce((a, b) => a + b, 0)
  return exps.map((x) => x / sum)
}

function demoPredict() {
  const raw   = SHARK_CLASSES.map(() => Math.random() * 3 - 1)
  const probs = softmax(raw)
  return SHARK_CLASSES
    .map((cls, i) => ({ ...cls, confidence: +(probs[i] * 100).toFixed(1) }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

export function useSharkClassifier() {
  const modelRef = useRef(null)
  const [modelStatus, setModelStatus] = useState('idle')
  const [predictions, setPredictions] = useState(null)
  const [inferencing, setInferencing] = useState(false)
  const [loadError,   setLoadError]   = useState(null)

  const loadModel = useCallback(async () => {
    if (['loading', 'ready', 'demo'].includes(modelStatus)) return
    setModelStatus('loading')
    setLoadError(null)
    try {
      const tf    = (await import('@tensorflow/tfjs')).default ?? await import('@tensorflow/tfjs')
      const model = await tf.loadLayersModel(MODEL_PATH)
      modelRef.current = { tf, model, isDemo: false }
      setModelStatus('ready')
    } catch (err) {
      console.warn('[Xok] Model not found, demo mode:', err.message)
      const tf = (await import('@tensorflow/tfjs')).default ?? await import('@tensorflow/tfjs')
      modelRef.current = { tf, isDemo: true }
      setModelStatus('demo')
      setLoadError(`Model not found at ${MODEL_PATH} — running in demo mode.`)
    }
  }, [modelStatus])

  const classify = useCallback(async (imageEl) => {
    if (!modelRef.current) return
    setInferencing(true)
    setPredictions(null)
    try {
      const { tf, model, isDemo } = modelRef.current
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 2800))
        setPredictions(demoPredict())
        return
      }
      const tensor = tf.tidy(() =>
        tf.browser.fromPixels(imageEl).resizeBilinear([224, 224]).expandDims(0).toFloat().div(255)
      )
      const output = model.predict(tensor)
      const scores = Array.from(await output.data())
      tensor.dispose(); output.dispose()
      const probs   = softmax(scores)
      const results = SHARK_CLASSES
        .map((cls, i) => ({ ...cls, confidence: +(probs[i] * 100).toFixed(1) }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5)
      setPredictions(results)
    } catch (err) {
      console.error('[Xok] Inference error:', err)
      setLoadError('Inference failed: ' + err.message)
    } finally {
      setInferencing(false)
    }
  }, [])

  const reset = useCallback(() => { setPredictions(null) }, [])

  return { modelStatus, predictions, inferencing, loadError, loadModel, classify, reset }
}
