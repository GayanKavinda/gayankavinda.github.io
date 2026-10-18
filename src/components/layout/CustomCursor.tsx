//src/components/common/CustomCursor.tsx
import { useEffect, useRef, useState } from 'react';

const HOVER_SELECTOR =
  'a, button, [role="button"], [role="link"], input, textarea, select, [data-cursor="pointer"], .cursor-pointer, [tabindex]:not([tabindex="-1"])';

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const isTouchDevice =
    typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches;

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (isTouchDevice) return;

    let rafId = 0;
    let lerpId = 0;
    let lastX = 0;
    let lastY = 0;

    // Ring trails with lerp for buttery feel
    let ringX = 0;
    let ringY = 0;
    let initialized = false;

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;

      // Dot follows instantly
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) translate(-50%, -50%)`;
        }
      });

      // Seed ring position on first move so it doesn't jump from 0,0
      if (!initialized) {
        ringX = e.clientX;
        ringY = e.clientY;
        initialized = true;
      }
    };

    // Ring trails with lerp
    const lerpRing = () => {
      ringX += (lastX - ringX) * 0.18;
      ringY += (lastY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      lerpId = requestAnimationFrame(lerpRing);
    };
    lerpRing();

    // Hover detection over interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(HOVER_SELECTOR)) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(lerpId);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div data-custom-cursor>
      <div
        ref={dotRef}
        className={`cursor-dot ${isClicking ? 'is-clicking' : ''}`}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? 'is-hovering' : ''}`}
      />
    </div>
  );
};

export default CustomCursor;