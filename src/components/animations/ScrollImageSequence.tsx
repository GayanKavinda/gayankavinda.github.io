import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollImageSequenceProps {
  className?: string;
  opacity?: number;
}

const ScrollImageSequence = ({ className = "", opacity = 0.3 }: ScrollImageSequenceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use Vite's glob import to get all frames
  // The images are at src/assets/images/project_details/scroll-animate/ezgif-frame-001.jpg
  const imageModules = import.meta.glob('@assets/images/project_details/scroll-animate/*.jpg', { eager: true });
  
  // Sort and extract URLs
  const imageUrls = Object.keys(imageModules)
    .sort((a, b) => {
      const aMatch = a.match(/ezgif-frame-(\d+)/);
      const bMatch = b.match(/ezgif-frame-(\d+)/);
      const aNum = aMatch ? parseInt(aMatch[1]) : 0;
      const bNum = bMatch ? parseInt(bMatch[1]) : 0;
      return aNum - bNum;
    })
    .map((path) => (imageModules[path] as any).default || imageModules[path]);

  const { scrollYProgress } = useScroll();
  
  // Smooth the scroll progress for a more cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 40,
    restDelta: 0.001
  });

  // Map scroll progress (0-1) to image index (0 - count-1)
  const imageIndex = useTransform(smoothProgress, [0, 1], [0, imageUrls.length - 1]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          setIsLoaded(true);
        }
      };
      loadedImages[index] = img;
    });

    setImages(loadedImages);
  }, []);

  // Render to canvas
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (index: number) => {
      const floorIndex = Math.floor(index);
      const ceilIndex = Math.min(floorIndex + 1, images.length - 1);
      const mix = index - floorIndex;

      const img1 = images[floorIndex];
      const img2 = images[ceilIndex];
      
      if (!img1) return;

      // Handle responsive sizing (cover)
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      const imgRatio = img1.width / img1.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw first image
      ctx.globalAlpha = 1 - mix;
      ctx.drawImage(img1, offsetX, offsetY, drawWidth, drawHeight);

      // Draw second image (cross-fade)
      if (mix > 0 && img2) {
        ctx.globalAlpha = mix;
        ctx.drawImage(img2, offsetX, offsetY, drawWidth, drawHeight);
      }
      
      ctx.globalAlpha = 1.0;
    };

    // Subscribe to motion value changes
    const unsubscribe = imageIndex.on('change', (latest) => {
      render(latest);
    });

    // Initial render
    render(imageIndex.get());

    return () => unsubscribe();
  }, [isLoaded, images, imageIndex]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`} style={{ opacity }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ScrollImageSequence;
