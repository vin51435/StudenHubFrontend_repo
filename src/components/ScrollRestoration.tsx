import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();
  const positions = useRef<Record<string, number>>({});
  const prevKey = useRef<string | null>(null);

  const getScrollContainers = () =>
    Array.from(document.querySelectorAll('[data-scroll-id]')) as HTMLElement[];

  // Save scroll positions before navigating away
  useEffect(() => {
    const saveScrollPositions = () => {
      if (prevKey.current) {
        const containers = getScrollContainers();
        containers.forEach((container) => {
          const scrollId = container.getAttribute('data-scroll-id');
          if (!scrollId) return;
          const keyId = `${prevKey.current}-${scrollId}`;
          positions.current[keyId] = container.scrollTop;
        });
      }
    };

    window.addEventListener('popstate', saveScrollPositions);

    return () => {
      window.removeEventListener('popstate', saveScrollPositions);
      saveScrollPositions(); // Also save on cleanup
    };
  }, [location]);

  // Restore scroll positions after navigation
  useEffect(() => {
    const containers = getScrollContainers();
    containers.forEach((container) => {
      const scrollId = container.getAttribute('data-scroll-id');
      if (!scrollId) return;

      const keyId = `${location.key}-${scrollId}`;
      const y = positions.current[keyId] ?? 0;

      requestAnimationFrame(() => {
        container.scrollTo(0, y);
        // console.log('restored', keyId, y);
      });
    });

    prevKey.current = location.key;
  }, [location]);

  return null;
};

export default ScrollRestoration;
