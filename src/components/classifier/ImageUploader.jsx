import { useRef, useState } from 'react'

export default function ImageUploader({ onImageReady, disabled }) {
  const fileRef  = useRef(null)
  const imgRef   = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)

  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function handleFileChange(e) {
    processFile(e.target.files?.[0])
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files?.[0])
  }

  function handleImageLoad() {
    if (imgRef.current && onImageReady) {
      onImageReady(imgRef.current, preview)
    }
  }

  function handleReset() {
    setPreview(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onClick={() => !preview && !disabled && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
          min-h-64 transition-all duration-200
          ${preview
            ? 'border-ocean-500/50 cursor-default'
            : dragging
              ? 'border-ocean-400 bg-ocean-400/5 scale-[1.01]'
              : disabled
                ? 'border-ocean-800 cursor-not-allowed opacity-50'
                : 'border-ocean-700 hover:border-ocean-500 hover:bg-ocean-800/20 cursor-pointer'
          }`}
      >
        {preview ? (
          <>
            <img
              ref={imgRef}
              src={preview}
              alt="Upload preview"
              onLoad={handleImageLoad}
              className="w-full h-full object-contain rounded-2xl max-h-72"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-ocean-950/60 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center select-none">
            <div className="rounded-full bg-ocean-800/60 p-4">
              <svg className="h-8 w-8 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-ocean-200 text-sm font-medium">Drop a shark photo here</p>
              <p className="text-ocean-500 text-xs mt-1">or click to browse · PNG, JPG, WEBP</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {preview && (
        <button
          onClick={handleReset}
          className="btn-outline w-full justify-center text-xs py-2"
          disabled={disabled}
        >
          Clear image
        </button>
      )}
    </div>
  )
}
