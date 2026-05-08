import { useRef, useState } from 'react'

export default function ImageUploader({ onImageReady, disabled }) {
  const fileRef  = useRef(null)
  const imgRef   = useRef(null)
  const [preview, setPreview]   = useState(null)
  const [dragging, setDragging] = useState(false)

  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
  }

  function handleFileChange(e) { processFile(e.target.files?.[0]); e.target.value = '' }

  function handleDrop(e) { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files?.[0]) }

  function handleImageLoad() {
    if (imgRef.current && onImageReady) onImageReady(imgRef.current, preview)
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div
        onClick={() => !preview && !disabled && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="relative flex flex-col items-center justify-center min-h-52 transition-all duration-200"
        style={{
          cursor: preview ? 'default' : disabled ? 'not-allowed' : 'pointer',
          borderRadius: '0.75rem',
          border: `2px dashed ${dragging ? 'rgba(34,204,255,0.7)' : preview ? 'rgba(0,176,232,0.3)' : 'rgba(0,100,160,0.4)'}`,
          background: dragging ? 'rgba(0,176,232,0.05)' : 'transparent',
          opacity: disabled && !preview ? 0.4 : 1,
        }}
      >
        {preview ? (
          <>
            <img
              ref={imgRef}
              src={preview}
              alt="Specimen"
              onLoad={handleImageLoad}
              className="w-full h-full object-contain"
              style={{ maxHeight: '240px', borderRadius: '0.6rem' }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(null) }}
              className="absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(248,113,113,0.5)', color: '#f87171' }}
            >
              ✕
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center select-none">
            <div
              className="rounded-full p-4"
              style={{ background: 'rgba(0,100,160,0.2)', border: '1px solid rgba(0,176,232,0.3)' }}
            >
              <svg className="h-8 w-8" style={{ color: '#22ccff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#b3efff' }}>Drop specimen image here</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(100,160,200,0.5)', fontFamily: 'Courier New' }}>
                OR CLICK TO BROWSE · PNG · JPG · WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={disabled} />
    </div>
  )
}
