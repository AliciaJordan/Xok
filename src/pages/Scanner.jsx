import { useState, useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const PLACEHOLDER_RESULTS = [
  { name: 'Blue Tang',       confidence: 97, habitat: 'Coral Reef',  status: 'Least Concern' },
  { name: 'Clownfish',       confidence: 94, habitat: 'Anemone',     status: 'Least Concern' },
  { name: 'Manta Ray',       confidence: 88, habitat: 'Open Ocean',  status: 'Vulnerable'    },
]

export default function Scanner() {
  const [preview, setPreview]   = useState(null)
  const [scanning, setScanning] = useState(false)
  const [results, setResults]   = useState(null)
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResults(null)
  }

  function handleScan() {
    if (!preview) return
    setScanning(true)
    setResults(null)
    // Simulated async scan
    setTimeout(() => {
      setScanning(false)
      setResults(PLACEHOLDER_RESULTS)
    }, 2000)
  }

  function handleReset() {
    setPreview(null)
    setResults(null)
    setScanning(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <SectionWrapper>
      <div className="text-center mb-10">
        <Badge variant="seafoam" className="mb-3">AI-Powered</Badge>
        <h1 className="section-title">Marine Scanner</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          Upload a photo of a sea creature and let Xok identify it instantly.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Upload area */}
        <Card hover={false} className="flex flex-col gap-4">
          <div
            onClick={() => !preview && fileRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors min-h-64 cursor-pointer
              ${preview ? 'border-ocean-500/60 cursor-default' : 'border-ocean-700 hover:border-ocean-500'}`}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full rounded-xl object-cover max-h-80" />
            ) : (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <span className="text-5xl">🌊</span>
                <p className="text-ocean-300 text-sm">Click to upload a photo</p>
                <p className="text-ocean-600 text-xs">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          <div className="flex gap-3">
            {preview && (
              <button onClick={handleReset} className="btn-outline flex-1">
                Reset
              </button>
            )}
            <button
              onClick={preview ? handleScan : () => fileRef.current?.click()}
              disabled={scanning}
              className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <>
                  <span className="animate-spin inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  Scanning…
                </>
              ) : preview ? 'Identify Species' : 'Upload Photo'}
            </button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {!results && !scanning && (
            <Card hover={false} className="text-center py-12">
              <p className="text-4xl mb-3">🐠</p>
              <p className="text-ocean-400 text-sm">
                Upload a photo to see identification results here.
              </p>
            </Card>
          )}

          {scanning && (
            <Card hover={false} className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full border-4 border-ocean-700 border-t-ocean-400 animate-spin" />
              </div>
              <p className="text-ocean-300 text-sm">Analyzing marine life…</p>
            </Card>
          )}

          {results && (
            <>
              <p className="text-ocean-400 text-sm font-medium">
                Top matches found:
              </p>
              {results.map((r) => (
                <Card key={r.name} className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-ocean-800 flex items-center justify-center text-2xl">
                    🐟
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white">{r.name}</p>
                      <Badge variant="seafoam">{r.confidence}%</Badge>
                    </div>
                    <p className="text-xs text-ocean-400 mt-0.5">{r.habitat} · {r.status}</p>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
