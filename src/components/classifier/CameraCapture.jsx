import { useRef, useState, useEffect, useCallback } from 'react'

export default function CameraCapture({ onCapture, disabled }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const imgRef     = useRef(null)
  const streamRef  = useRef(null)

  const [phase, setPhase]   = useState('idle')   // idle|requesting|live|captured|error
  const [preview, setPreview] = useState(null)
  const [camError, setCamError] = useState(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => stopStream(), [stopStream])

  async function startCamera() {
    setCamError(null)
    setPreview(null)
    setPhase('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setPhase('live')
    } catch (err) {
      const msg =
        err.name === 'NotAllowedError'  ? 'Camera permission denied. Allow camera access and try again.' :
        err.name === 'NotFoundError'    ? 'No camera found on this device.' :
        err.name === 'NotReadableError' ? 'Camera is in use by another app.' :
        `Camera error: ${err.message}`
      setCamError(msg)
      setPhase('error')
    }
  }

  function capture() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setPreview(dataUrl)
    stopStream()
    setPhase('captured')
  }

  function handleCapturedLoad() {
    if (imgRef.current && onCapture) {
      onCapture(imgRef.current, preview)
    }
  }

  function retake() {
    setPreview(null)
    setPhase('idle')
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Viewfinder */}
      <div className="relative overflow-hidden rounded-2xl bg-ocean-950 border border-ocean-700/40 min-h-64 flex items-center justify-center">

        {/* Idle */}
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-ocean-800/60 p-4">
              <svg className="h-8 w-8 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-ocean-200 text-sm font-medium">Use your camera</p>
              <p className="text-ocean-500 text-xs mt-1">Point at a shark and capture</p>
            </div>
          </div>
        )}

        {/* Requesting permission */}
        {phase === 'requesting' && (
          <div className="flex flex-col items-center gap-3 p-8">
            <span className="h-8 w-8 rounded-full border-2 border-ocean-700 border-t-ocean-400 animate-spin" />
            <p className="text-ocean-400 text-sm">Requesting camera…</p>
          </div>
        )}

        {/* Live video */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${phase === 'live' ? 'block' : 'hidden'}`}
          playsInline
          muted
        />
        {phase === 'live' && (
          <div className="absolute inset-0 pointer-events-none border-2 border-ocean-400/30 rounded-2xl" />
        )}

        {/* Captured preview */}
        {phase === 'captured' && preview && (
          <img
            ref={imgRef}
            src={preview}
            alt="Captured"
            onLoad={handleCapturedLoad}
            className="w-full h-full object-contain max-h-72"
          />
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <svg className="h-8 w-8 text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-coral-400 text-sm">{camError}</p>
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {phase === 'idle' || phase === 'error' ? (
          <button
            onClick={startCamera}
            disabled={disabled}
            className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Camera
          </button>
        ) : phase === 'live' ? (
          <>
            <button onClick={stopStream} className="btn-outline flex-1 justify-center text-sm py-2" >
              Cancel
            </button>
            <button onClick={capture} className="btn-primary flex-1 justify-center">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              Capture
            </button>
          </>
        ) : phase === 'captured' ? (
          <button onClick={retake} className="btn-outline flex-1 justify-center text-sm py-2">
            Retake
          </button>
        ) : null}
      </div>
    </div>
  )
}
