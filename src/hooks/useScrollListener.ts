import { useEffect, useRef } from 'react';

export type ScrollInfo = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  element: HTMLElement;
};

interface UseScrollListenerOptions {
  selector: string;
  onTopReach?: (info: ScrollInfo) => void;
  onNotTop?: (info: ScrollInfo) => void;
  onBottomReach?: (info: ScrollInfo) => void;
  onScroll?: (info: ScrollInfo) => void;
  topThreshold?: number; // default 0
  bottomThreshold?: number; // default 0
}

const useScrollListener = ({
  selector,
  onTopReach,
  onNotTop,
  onBottomReach,
  onScroll,
  topThreshold = 0,
  bottomThreshold = 0,
}: UseScrollListenerOptions) => {
  const observerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;

    observerRef.current = el;

    const handleScroll = () => {
      const info: ScrollInfo = {
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        element: el,
      };

      onScroll?.(info);

      if (el.scrollTop <= topThreshold) {
        onTopReach?.(info);
      } else {
        onNotTop?.(info);
      }

      const bottomOffset = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (bottomOffset <= bottomThreshold) {
        onBottomReach?.(info);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [selector, onTopReach, onNotTop, onBottomReach, onScroll, topThreshold, bottomThreshold]);

  return observerRef;
};

export default useScrollListener;
