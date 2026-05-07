import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  enableBlur?: boolean;
  depth?: number;
  stagger?: number;
}

const ScrollReveal = ({
  children,
  enableBlur = true,
  depth = 60,
  stagger = 0.05,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLSpanElement>(".word");

      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 40,
          rotateX: -90,
          z: -depth,
          filter: enableBlur ? "blur(12px)" : "none",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          z: 0,
          filter: "blur(0px)",
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 50%",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [enableBlur, depth, stagger]);

  return (
    <h2
      ref={containerRef}
      className="scroll-reveal perspective-1000"
    >
      <p className="scroll-reveal-text">{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
