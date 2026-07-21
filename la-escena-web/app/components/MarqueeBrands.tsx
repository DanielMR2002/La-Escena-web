'use client'

import { useEffect, useRef, useState } from "react";

const SECONDS_PER_CYCLE = 80;

export default function MarqueeBrands({ brands }: { brands: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const xRef = useRef(0);
  const setWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const hoveringRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const xAtDragStartRef = useRef(0);

  const items = [...brands, ...brands, ...brands];

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setWidthRef.current = trackRef.current.scrollWidth / 3;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [brands]);

  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const tick = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const setWidth = setWidthRef.current;
      if (setWidth > 0) {
        if (!draggingRef.current && !hoveringRef.current) {
          xRef.current -= (setWidth / SECONDS_PER_CYCLE) * dt;
        }
        xRef.current = (((xRef.current % setWidth) + setWidth) % setWidth) - setWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xRef.current}px)`;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const startDrag = (clientX: number) => {
    draggingRef.current = true;
    setIsDragging(true);
    pointerStartXRef.current = clientX;
    xAtDragStartRef.current = xRef.current;
  };

  const moveDrag = (clientX: number) => {
    if (!draggingRef.current) return;
    xRef.current = xAtDragStartRef.current + (clientX - pointerStartXRef.current);
  };

  const endDrag = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-muted to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-muted to-transparent z-10" />
      <div
        className={`overflow-hidden select-none py-6 sm:py-8 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ touchAction: "pan-y" }}
        onMouseEnter={() => {
          hoveringRef.current = true;
        }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={() => {
          hoveringRef.current = false;
          endDrag();
        }}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
      >
        <div ref={trackRef} className="flex w-max">
          {items.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="flex items-center shrink-0 whitespace-nowrap text-lg sm:text-xl font-medium text-foreground/70"
            >
              {brand}
              <span className="mx-6 sm:mx-8 text-foreground/30">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
