import { useRef, useState, useEffect, useCallback } from 'react'

export default function CameraCapture({ onCapture, disabled }) {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const imgRef    = useRef(null)
  const streamRef = useRef(null)
  const [phase,   setPhase]   = useState('idle')
  const [preview, setPreview] = useState(null)
  const [camErr,  setCamErr]  = useState(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => stopStream(), [stopStream])

  async function startCamera() {
    setCamErr(null); setPreview(null); setPhase('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setPhase('live')
    } catch (err) {
      setCamErr(
        err.name === 'NotAllowedError'  ? 'Camera permission denied.' :
        err.name === 'NotFoundError'    ? 'No camera found.' :
        err.name === 'NotReadableError' ? 'Camera in use by another app.' :
        `Camera error: ${err.message}`
      )
      setPhase('error')
    }
  }

  function capture() {
    const video = videoRef.current; const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setPreview(dataUrl); stopStream(); setPhase('captured')
  }

  function handleCapturedLoad() {
    if (imgRef.current && onCapture) onCapture(imgRef.current, preview)
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div
        className="relative flex flex-col items-center justify-center min-h-52 overflow-hidden"
        style={{ borderRadius: '0.75rem', background: 'rgba(0,5,15,0.8)', border: '1px solid rgba(0,176,232,0.2)' }}
      >
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full p-4" style={{ background: 'rgba(0,100,160,0.2)', border: '1px solid rgba(0,176,232,0.3)' }}>
              <svg className="h-8 w-8" style={{ color: '#22ccff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#b3efff' }}>Camera capture</p>
          </div>
        )}

        {phase === 'requesting' && (
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid rgba(0,176,232,0.2)', borderTopColor: '#22ccff' }} />
            <p className="text-xs" style={{ color: 'rgba(100,200,255,0.6)', fontFamily: 'Courier New' }}>REQUESTING CAMERA...</p>
          </div>
        )}

        <video ref={videoRef} className={`w-full h-full object-cover ${phase === 'live' ? 'block' : 'hidden'}`} playsInline muted />
        {phase === 'live' && (
          <div className="absolute inset-0 pointer-events-none" style={{ border: '2px solid rgba(0,255,100,0.2)', borderRadius: '0.75rem' }} />
        )}

        {phase === 'captured' && preview && (
          <img ref={imgRef} src={preview} alt="Captured" onLoad={handleCapturedLoad} className="w-full h-full object-contain" style={{ maxHeight: '240px' }} />
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <p className="text-sm font-semibold" style={{ color: '#f87171' }}>{camErr}</p>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-2">
        {(phase === 'idle' || phase === 'error') && (
          <button onClick={startCamera} disabled={disabled} className="btn-aqua flex-1 justify-center disabled:opacity-40">
            ◉ Start Camera
          </button>
        )}
        {phase === 'live' && (
          <>
            <button onClick={stopStream} className="btn-aqua-outline flex-1 justify-center text-xs" style={{ padding: '0.5rem' }}>Cancel</button>
            <button onClick={capture}    className="btn-aqua flex-1 justify-center">◉ Capture</button>
          </>
        )}
        {phase === 'captured' && (
          <button onClick={() => { setPreview(null); setPhase('idle') }} className="btn-aqua-outline flex-1 justify-center text-xs">↺ Retake</button>
        )}
      </div>
    </div>
  )
}
