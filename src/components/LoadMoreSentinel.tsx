import React, { useEffect, useRef, type RefObject } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadMoreSentinelProps {
  canLoadMore: boolean;
  className?: string;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  rootRef?: RefObject<Element | null>;
}

export function LoadMoreSentinel({
  canLoadMore,
  className = '',
  isLoadingMore,
  onLoadMore,
  rootMargin = '320px',
  rootRef
}: LoadMoreSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canLoadMore || isLoadingMore || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: rootRef?.current ?? null,
        rootMargin
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [canLoadMore, isLoadingMore, onLoadMore, rootMargin, rootRef]);

  if (!canLoadMore && !isLoadingMore) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      className={`flex items-center justify-center text-cyan-300/70 ${className}`}
    >
      {isLoadingMore && <Loader2 size={18} className="animate-spin" />}
    </div>
  );
}
