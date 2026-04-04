"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { images: string[]; title: string };

export function ListingImageCarousel({ images, title }: Props) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx]}
        alt={`${title} — imagen ${idx + 1}`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {total > 1 && (
        <>
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                aria-label={`Ir a imagen ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200 bg-white/90 shadow-sm",
                  i === idx ? "w-4" : "w-1.5 opacity-60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
