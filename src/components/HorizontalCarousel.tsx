import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCarouselProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  scrollerClassName?: string;
  buttonClassName?: string;
  scrollerRef?: RefObject<HTMLDivElement | null>;
  scrollStep?: number;
}

function setExternalRef(
  ref: RefObject<HTMLDivElement | null> | undefined,
  node: HTMLDivElement | null
) {
  if (!ref) {
    return;
  }

  (ref as MutableRefObject<HTMLDivElement | null>).current = node;
}

export function HorizontalCarousel({
  children,
  className = '',
  contentClassName = '',
  scrollerClassName = '',
  buttonClassName = '',
  scrollerRef,
  scrollStep
}: HorizontalCarouselProps) {
  const localScrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncButtons = useCallback(() => {
    const node = localScrollerRef.current;
    if (!node) {
      return;
    }

    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 8);
    setCanScrollRight(maxScrollLeft - node.scrollLeft > 8);
  }, []);

  const handleScrollerRef = useCallback(
    (node: HTMLDivElement | null) => {
      localScrollerRef.current = node;
      setExternalRef(scrollerRef, node);
      syncButtons();
    },
    [scrollerRef, syncButtons]
  );

  const handleScroll = useCallback(
    (direction: -1 | 1) => {
      const node = localScrollerRef.current;
      if (!node) {
        return;
      }

      const amount = scrollStep ?? Math.max(node.clientWidth * 0.82, 240);
      node.scrollBy({
        left: direction * amount,
        behavior: 'smooth'
      });
    },
    [scrollStep]
  );

  useEffect(() => {
    const node = localScrollerRef.current;
    if (!node) {
      return;
    }

    const contentNode = node.firstElementChild;
    syncButtons();

    const handleResize = () => {
      syncButtons();
    };

    node.addEventListener('scroll', syncButtons, {
      passive: true
    });
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      syncButtons();
    });
    resizeObserver.observe(node);
    if (contentNode) {
      resizeObserver.observe(contentNode);
    }

    const rafId = window.requestAnimationFrame(syncButtons);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      node.removeEventListener('scroll', syncButtons);
    };
  }, [children, syncButtons]);

  const controlBaseClassName =
    "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0b0d16]/86 text-white backdrop-blur-md transition-all disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => handleScroll(-1)}
        disabled={!canScrollLeft}
        className={`${controlBaseClassName} left-0 hover:border-cyan-400/30 hover:text-cyan-300 ${buttonClassName}`}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={handleScrollerRef}
        className={`no-scrollbar overflow-x-auto scroll-smooth px-14 ${scrollerClassName}`}
      >
        <div className={contentClassName}>{children}</div>
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => handleScroll(1)}
        disabled={!canScrollRight}
        className={`${controlBaseClassName} right-0 hover:border-cyan-400/30 hover:text-cyan-300 ${buttonClassName}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
