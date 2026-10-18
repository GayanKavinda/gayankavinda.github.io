import { useEffect, useId, useState, type CSSProperties, type RefObject } from 'react';
import { cn } from '@lib/utils';
import './animated-beam.css';

export interface AnimatedBeamProps {
  /** The positioned element both endpoints live inside. */
  containerRef: RefObject<HTMLElement | null>;
  /** The element the beam starts at. */
  fromRef: RefObject<HTMLElement | null>;
  /** The element the beam ends at. */
  toRef: RefObject<HTMLElement | null>;
  /** Bow of the curve in pixels. Negative bows the other way. 0 is a straight line. */
  curvature?: number;
  /** Send the pulse from `to` to `from` instead. */
  reverse?: boolean;
  /** Seconds for one pulse to cross. */
  duration?: number;
  /** Seconds before the first pulse. Stagger these across a diagram. */
  delay?: number;
  /** The dim track the pulse runs along. */
  pathColor?: string;
  /** Stroke width of the dim track underneath. */
  pathWidth?: number;
  /** Opacity of the dim track underneath. */
  pathOpacity?: number;
  /** Any CSS colour for the travelling pulse. */
  beamColor?: string;
  /** Length of the lit pulse in pixels. */
  beamLength?: number;
  /** Draw the track but hold the pulse still. */
  paused?: boolean;
  /** Merged last, so it wins. */
  className?: string;
}

interface Geometry {
  width: number;
  height: number;
  d: string;
  length: number;
}

/** Centre of `node` in `container` coordinates. */
function centreIn(container: DOMRect, node: DOMRect) {
  return {
    x: node.left - container.left + node.width / 2,
    y: node.top - container.top + node.height / 2,
  };
}

/**
 * A curved connector between two elements, with light pulsing along it.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 60,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = 'rgba(148, 163, 184, 0.25)',
  pathWidth = 1.75,
  pathOpacity = 1,
  beamColor = '#3B82F6',
  beamLength = 46,
  paused = false,
  className,
}: AnimatedBeamProps) {
  const id = useId();
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    const measure = () => {
      const box = container.getBoundingClientRect();
      const start = centreIn(box, from.getBoundingClientRect());
      const end = centreIn(box, to.getBoundingClientRect());

      // Bow perpendicular to the line, so the curve looks right whatever the
      // angle between the two nodes happens to be.
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const span = Math.hypot(dx, dy) || 1;
      const controlX = midX + (-dy / span) * curvature;
      const controlY = midY + (dx / span) * curvature;

      const d = `M ${start.x},${start.y} Q ${controlX},${controlY} ${end.x},${end.y}`;

      // Quadratic arc length, approximated well enough for a dash pattern.
      const chord = span;
      const legs =
        Math.hypot(controlX - start.x, controlY - start.y) +
        Math.hypot(end.x - controlX, end.y - controlY);

      setGeometry({
        width: box.width,
        height: box.height,
        d,
        length: (chord + legs) / 2,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(from);
    observer.observe(to);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  if (!geometry) return null;

  const total = Math.round(geometry.length);
  const lap = total + beamLength;
  const travel = reverse ? lap : -lap;

  return (
    <svg
      aria-hidden="true"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
      className={cn('pointer-events-none absolute left-0 top-0 w-full h-full', className)}
    >
      <path
        d={geometry.d}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id={`beam-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={beamColor} stopOpacity="0" />
          <stop offset="50%" stopColor={beamColor} stopOpacity="1" />
          <stop offset="100%" stopColor={beamColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={geometry.d}
        stroke={`url(#beam-${id})`}
        strokeWidth={pathWidth + 1.25}
        strokeLinecap="round"
        strokeDasharray={`${beamLength} ${total}`}
        strokeDashoffset={0}
        style={
          {
            '--beam-travel': travel,
            animation: `beam-dash ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
            animationPlayState: paused ? 'paused' : 'running',
          } as CSSProperties
        }
      />
    </svg>
  );
}

export default AnimatedBeam;
