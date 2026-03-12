import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Trip } from "@/schemas/trips";

type Photo = Trip["photos"][number];

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PhotoLightbox = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoLightboxProps): React.ReactNode => {
  const photo = photos[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, handlePrev, handleNext]);

  if (!photo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      aria-label="Close lightbox"
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-none bg-white/15 p-0 text-lg text-white transition-colors hover:bg-white/25"
          aria-label="Close lightbox"
        >
          ✕
        </button>

        <div className="relative overflow-hidden rounded-lg">
          <svg
            className="absolute top-0 left-0 z-10 h-1.5 w-full"
            viewBox="0 0 400 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,4 C40,1 80,7 120,3 C160,0 200,6 240,4 C280,2 340,7 400,4"
              fill="none"
              stroke="rgba(233, 30, 99, 0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <img
            src={photo.src}
            alt={photo.alt}
            className="block max-h-[80vh] max-w-[90vw] object-contain"
          />
        </div>

        {photo.caption && (
          <p className="mt-3 text-center font-serif text-sm text-white/80 italic">
            {photo.caption}
          </p>
        )}

        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -left-12 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/15 p-0 text-2xl text-white transition-colors hover:bg-white/25"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 -right-12 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/15 p-0 text-2xl text-white transition-colors hover:bg-white/25"
              aria-label="Next photo"
            >
              ›
            </button>

            <div className="mt-3 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(i)}
                  className={`size-2 cursor-pointer rounded-full border-none p-0 transition-opacity ${
                    i === currentIndex
                      ? "bg-[#e91e63] opacity-100"
                      : "bg-white/50 opacity-60"
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default PhotoLightbox;
