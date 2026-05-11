import { useState, useEffect } from 'react';

export function useImageLoader(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    setIsLoaded(false);
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setError(`Failed to load image: ${src}`);
    };
  }, [src]);

  return { isLoaded, error };
}
