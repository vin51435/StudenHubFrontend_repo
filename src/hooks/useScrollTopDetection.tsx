import { useEffect, useRef } from 'react';

type ScrollInfo = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  element: HTMLElement;
};

const useScrollTopDetection = (selector: string, onTopReach: (info: ScrollInfo) => void) => {
  const observerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;

    observerRef.current = el;

    const handleScroll = () => {
      if (el.scrollTop <= 0) {
        const info: ScrollInfo = {
          scrollTop: el.scrollTop,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          element: el,
        };
        onTopReach(info);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [selector, onTopReach]);

  return observerRef;
};

export default useScrollTopDetection;
