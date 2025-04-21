import { useState, useEffect } from 'react';

type Breakpoint = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

interface WindowSize {
  width: number;
  height: number;
  xsmall: boolean;
  small: boolean;
  medium: boolean;
  large: boolean;
  xlarge: boolean;
  xxlarge: boolean;
}

const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const breakpoints: Record<Breakpoint, number> = {
    xsmall: 400,
    small: 576,
    medium: 768,
    large: 992,
    xlarge: 1200,
    xxlarge: 1400,
  };

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isSmallerThan = (breakpoint: Breakpoint): boolean => size.width < breakpoints[breakpoint];

  return {
    ...size,
    xsmall: isSmallerThan('xsmall'),
    small: isSmallerThan('small'),
    medium: isSmallerThan('medium'),
    large: isSmallerThan('large'),
    xlarge: isSmallerThan('xlarge'),
    xxlarge: isSmallerThan('xxlarge'),
  };
};

export default useWindowSize;
