import { useState, useEffect, useCallback } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Badge from '@/components/ui/Badge'
import ModelStatusBanner from '@/components/classifier/ModelStatusBanner'
import ImageUploader from '@/components/classifier/ImageUploader'
import CameraCapture from '@/components/classifier/CameraCapture'
import PredictionPanel from '@/components/classifier/PredictionPanel'
import { useSharkClassifier } from '@/hooks/useSharkClassifier'

const TABS = [
  {
    id: 'upload',
    label: 'Upload Photo',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    id: 'camera',
    label: 'Camera',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function SharkClassifier() {
  const [activeTab, setActiveTab] = useState('upload')
  const { modelStatus, predictions, inferencing, loadError, loadModel, classify, reset } = useSharkClassifier()

  // Auto-load model on mount
  useEffect(() => {
    loadModel()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const canClassify = ['ready', 'demo'].includes(modelStatus)

  const handleImageReady = useCallback((imgEl) => {
    if (canClassify) classify(imgEl)
  }, [canClassify, classify])

  function switchTab(id) {
    setActiveTab(id)
    reset()
  }

  return (
    <SectionWrapper>
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="seafoam" className="mb-3">TensorFlow.js · AI-Powered</Badge>
        <h1 className="section-title">Shark Identifier</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          Upload a photo or use your camera — our neural network identifies shark species in seconds.
        </p>
      </div>

      {/* Model status */}
      <div className="mb-6 max-w-3xl mx-auto">
        <ModelStatusBanner status={modelStatus} />
        {loadError && modelStatus !== 'demo' && (
          <p className="text-coral-400 text-xs mt-2 px-1">{loadError}</p>
        )}
      </div>

      {/* Load model button (shown only when idle) */}
      {modelStatus === 'idle' && (
        <div className="flex justify-center mb-8">
          <button onClick={loadModel} className="btn-primary">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Load Model
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className="grid gap-8 lg:grid-cols-2 items-start max-w-5xl mx-auto">
        {/* Left — input panel */}
        <div className="flex flex-col gap-4">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-ocean-900/60 border border-ocean-700/40 p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-ocean-700 text-white shadow-sm'
                    : 'text-ocean-400 hover:text-ocean-200'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input component */}
          {activeTab === 'upload' ? (
            <ImageUploader
              onImageReady={handleImageReady}
              disabled={!canClassify || inferencing}
            />
          ) : (
            <CameraCapture
              onCapture={handleImageReady}
              disabled={!canClassify || inferencing}
            />
          )}

          {/* Tip */}
          {canClassify && !inferencing && !predictions && (
            <p className="text-ocean-600 text-xs text-center">
              {activeTab === 'upload'
                ? 'Tip: clear, well-lit dorsal-fin shots give the best accuracy.'
                : 'Tip: capture in good lighting with the shark centered in frame.'}
            </p>
          )}

          {/* Inferencing overlay hint */}
          {inferencing && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-ocean-900/60 border border-ocean-700/40 py-3">
              <span className="h-4 w-4 rounded-full border-2 border-ocean-700 border-t-ocean-400 animate-spin inline-block" />
              <span className="text-ocean-300 text-sm">Running neural network…</span>
            </div>
          )}
        </div>

        {/* Right — predictions */}
        <PredictionPanel predictions={predictions} inferencing={inferencing} />
      </div>

      {/* How it works */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-center text-lg font-semibold text-ocean-300 mb-6">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '01', title: 'Load model', body: 'A custom TensorFlow.js CNN trained on shark imagery loads directly in your browser — no server needed.' },
            { step: '02', title: 'Preprocess', body: 'Your image is resized to 224×224, normalised, and passed through the network as a float32 tensor.' },
            { step: '03', title: 'Classify',   body: 'Softmax probabilities are mapped to 15 shark species and ranked by confidence.' },
          ].map(({ step, title, body }) => (
            <div key={step} className="rounded-2xl bg-ocean-900/40 border border-ocean-800/50 p-5">
              <p className="font-display text-3xl font-black text-ocean-700 mb-2">{step}</p>
              <p className="font-semibold text-ocean-200 text-sm mb-1">{title}</p>
              <p className="text-ocean-500 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
