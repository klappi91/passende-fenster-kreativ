"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Maximize, Hand } from "lucide-react";

interface Viewer360Props {
  frames: string[];
  productName: string;
}

export default function Viewer360({ frames, productName }: Viewer360Props) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const frameAtStart = useRef(0);
  const autoRotateRef = useRef<number | null>(null);
  const preloadedImages = useRef<HTMLImageElement[]>([]);

  const totalFrames = frames.length;

  // Preload all frames
  useEffect(() => {
    let count = 0;
    preloadedImages.current = [];

    frames.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        count++;
        setLoaded(count);
        if (count === totalFrames) {
          setAllLoaded(true);
        }
      };
      img.onerror = () => {
        count++;
        setLoaded(count);
        if (count === totalFrames) {
          setAllLoaded(true);
        }
      };
      img.src = src;
      preloadedImages.current.push(img);
    });

    return () => {
      preloadedImages.current = [];
    };
  }, [frames, totalFrames]);

  // Auto-rotation
  useEffect(() => {
    if (!allLoaded || interacted) return;

    let lastTime = 0;
    const interval = 150;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
        lastTime = time;
      }
      autoRotateRef.current = requestAnimationFrame(animate);
    };

    autoRotateRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [allLoaded, interacted, totalFrames]);

  const stopAutoRotate = useCallback(() => {
    if (!interacted) setInteracted(true);
    if (autoRotateRef.current) {
      cancelAnimationFrame(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  }, [interacted]);

  // Pointer events
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      stopAutoRotate();
      isDragging.current = true;
      startX.current = e.clientX;
      frameAtStart.current = currentFrame;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [currentFrame, stopAutoRotate]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      const sensitivity = 20;
      const frameDelta = Math.round(dx / sensitivity);
      const newFrame =
        ((frameAtStart.current + frameDelta) % totalFrames + totalFrames) %
        totalFrames;
      setCurrentFrame(newFrame);
    },
    [totalFrames]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const progress = totalFrames > 0 ? Math.round((loaded / totalFrames) * 100) : 0;

  return (
    <section className="relative bg-[var(--brand-darker)] py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div
          ref={containerRef}
          className={`relative select-none overflow-hidden rounded-2xl ${
            isFullscreen ? "flex items-center justify-center bg-[var(--brand-darker)]" : ""
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: "none", cursor: isDragging.current ? "grabbing" : "grab" }}
        >
          {/* Loading bar */}
          {!allLoaded && (
            <div className="absolute top-0 left-0 right-0 z-30">
              <div className="h-1 w-full bg-white/10">
                <div
                  className="h-full bg-[var(--brand-primary)] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-center text-sm text-white/50">
                Laden... {progress}%
              </p>
            </div>
          )}

          {/* Current frame */}
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={frames[currentFrame]}
              alt={`${productName} — Ansicht ${currentFrame + 1} von ${totalFrames}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              unoptimized
            />
          </div>

          {/* Interaction hint */}
          {allLoaded && !interacted && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-black/50 px-5 py-2.5 backdrop-blur-sm">
                <Hand className="h-5 w-5 text-white" />
                <span className="text-sm font-medium text-white">
                  Ziehen zum Drehen
                </span>
              </div>
            </div>
          )}

          {/* Fullscreen button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="absolute right-4 bottom-4 z-20 rounded-lg bg-black/50 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
            aria-label={isFullscreen ? "Vollbild beenden" : "Vollbild"}
          >
            <Maximize className="h-5 w-5" />
          </button>

          {/* Frame indicator */}
          <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-black/50 px-3 py-1.5 text-xs text-white/60 backdrop-blur-sm">
            {currentFrame + 1} / {totalFrames}
          </div>
        </div>
      </div>
    </section>
  );
}
