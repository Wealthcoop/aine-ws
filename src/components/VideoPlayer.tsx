'use client'

import React, { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  duration?: string
  authorName?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  duration = '0:38',
  authorName = 'Justin Davis'
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400">
            Executive Video Briefing
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-xs text-slate-400 font-sans truncate max-w-xs hidden sm:inline">
            By {authorName}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
            HD 720p
          </span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Video Element */}
      <div className="relative aspect-video w-full bg-black group cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          className="h-full w-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Big Center Play Overlay Button (when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] transition group-hover:bg-slate-950/20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform transform group-hover:scale-110 hover:bg-sky-500"
              aria-label="Play video"
            >
              <Play className="h-7 w-7 fill-white translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Bottom Minimal Controls Bar on Hover */}
        <div
          className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-sky-400 transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="text-white hover:text-sky-400 transition"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <span className="text-xs text-slate-300 font-sans truncate max-w-sm">
              {title}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="text-white hover:text-sky-400 transition"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
