import { useState, useCallback, useRef } from 'react'

// ── Placeholder path: replace with your trained model ──────────────────────────
export const MODEL_PATH = '/models/shark-classifier/model.json'

// Class list must match your model's output index order exactly.
export const SHARK_CLASSES = [
  { id: 0,  name: 'Great White Shark',     latin: 'Carcharodon carcharias',    status: 'Vulnerable',             danger: 'High',   depth: '0–1200 m' },
  { id: 1,  name: 'Hammerhead Shark',      latin: 'Sphyrna lewini',             status: 'Critically Endangered',  danger: 'Medium', depth: '0–1000 m' },
  { id: 2,  name: 'Tiger Shark',           latin: 'Galeocerdo cuvier',          status: 'Near Threatened',        danger: 'High',   depth: '0–900 m'  },
  { id: 3,  name: 'Bull Shark',            latin: 'Carcharhinus leucas',        status: 'Near Threatened',        danger: 'High',   depth: '0–150 m'  },
  { id: 4,  name: 'Whale Shark',           latin: 'Rhincodon typus',            status: 'Endangered',             danger: 'Low',    depth: '0–1928 m' },
  { id: 5,  name: 'Blue Shark',            latin: 'Prionace glauca',            status: 'Near Threatened',        danger: 'Low',    depth: '0–1000 m' },
  { id: 6,  name: 'Mako Shark',            latin: 'Isurus oxyrinchus',          status: 'Endangered',             danger: 'Medium', depth: '0–500 m'  },
  { id: 7,  name: 'Nurse Shark',           latin: 'Ginglymostoma cirratum',     status: 'Vulnerable',             danger: 'Low',    depth: '0–130 m'  },
  { id: 8,  name: 'Blacktip Reef Shark',   latin: 'Carcharhinus melanopterus',  status: 'Near Threatened',        danger: 'Low',    depth: '0–80 m'   },
  { id: 9,  name: 'Oceanic Whitetip',      latin: 'Carcharhinus longimanus',    status: 'Critically Endangered',  danger: 'High',   depth: '0–1000 m' },
  { id: 10, name: 'Lemon Shark',           latin: 'Negaprion brevirostris',     status: 'Vulnerable',             danger: 'Low',    depth: '0–92 m'   },
  { id: 11, name: 'Thresher Shark',        latin: 'Alopias vulpinus',           status: 'Vulnerable',             danger: 'Low',    depth: '0–500 m'  },
  { id: 12, name: 'Sand Tiger Shark',      latin: 'Carcharias taurus',          status: 'Critically Endangered',  danger: 'Low',    depth: '0–191 m'  },
  { id: 13, name: 'Caribbean Reef Shark',  latin: 'Carcharhinus perezi',        status: 'Endangered',             danger: 'Low',    depth: '0–30 m'   },
  { id: 14, name: 'Zebra Shark',           latin: 'Stegostoma tigrinum',        status: 'Endangered',             danger: 'Low',    depth: '5–62 m'   },
]

function softmax(arr) {
  const max = Math.max(...arr)
  const exps = arr.map((x) => Math.exp(x - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((x) => x / sum)
}

function demoPredict() {
  // Seeded random so results look realistic; replace with real inference
  const raw = SHARK_CLASSES.map(() => Math.random() * 3 - 1)
  const probs = softmax(raw)
  return SHARK_CLASSES
    .map((cls, i) => ({ ...cls, confidence: +(probs[i] * 100).toFixed(1) }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useSharkClassifier() {
  const modelRef = useRef(null)
  const [modelStatus, setModelStatus] = useState('idle')  // idle|loading|ready|demo|error
  const [predictions, setPredictions] = useState(null)
  const [inferencing, setInferencing] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const loadModel = useCallback(async () => {
    if (['loading', 'ready', 'demo'].includes(modelStatus)) return
    setModelStatus('loading')
    setLoadError(null)

    try {
      // Dynamic import keeps TF.js out of the initial bundle
      const tf = (await import('@tensorflow/tfjs')).default ?? await import('@tensorflow/tfjs')
      const model = await tf.loadLayersModel(MODEL_PATH)
      modelRef.current = { tf, model, isDemo: false }
      setModelStatus('ready')
    } catch (err) {
      // Model not deployed yet — fall back to demo mode gracefully
      console.warn('[SharkClassifier] Model not found, entering demo mode:', err.message)
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
        await new Promise((r) => setTimeout(r, 1400))
        setPredictions(demoPredict())
        return
      }

      // Real inference: resize to 224×224, normalise to [0,1]
      const tensor = tf.tidy(() =>
        tf.browser
          .fromPixels(imageEl)
          .resizeBilinear([224, 224])
          .expandDims(0)
          .toFloat()
          .div(255)
      )
      const output = model.predict(tensor)
      const scores = Array.from(await output.data())
      tensor.dispose()
      output.dispose()

      const probs = softmax(scores)
      const results = SHARK_CLASSES
        .map((cls, i) => ({ ...cls, confidence: +(probs[i] * 100).toFixed(1) }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5)

      setPredictions(results)
    } catch (err) {
      console.error('[SharkClassifier] Inference error:', err)
      setLoadError('Inference failed: ' + err.message)
    } finally {
      setInferencing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setPredictions(null)
  }, [])

  return { modelStatus, predictions, inferencing, loadError, loadModel, classify, reset }
}
