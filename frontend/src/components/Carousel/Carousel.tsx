import { useState, useEffect, useRef } from 'react';
import './Carousel.css';

interface CarouselProps {
  images: string[];
  interval?: number; // ms between auto slides
}

function Carousel({ images, interval = 3000 }: Readonly<CarouselProps>) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoSlide = () => {
    stopAutoSlide();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [images.length, interval]);

  const goTo = (index: number) => {
    setCurrent(index);
    startAutoSlide(); // reset timer on manual click
  };

  return (
    <div
      className="carousel"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div className="carousel-slide" key={src}>
            <img src={src} alt={`slide-${idx + 1}`} />
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {images.map((src, idx) => (
          <button
            key={src}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;