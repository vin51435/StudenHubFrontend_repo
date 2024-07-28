import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const breakpoints = {
    'xsmall': 400,
    'small': 576,
    'medium': 768,
    'large': 992,
    'xlarge': 1200,
    'xxlarge': 1400,
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

  const isSmallerThan = (breakpoint) => size.width < breakpoints[breakpoint];

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