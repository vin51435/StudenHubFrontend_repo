import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PropsWithChildren } from 'react';

const PageTransitionWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const [fadeKey, setFadeKey] = useState(location.pathname);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeKey(location.pathname);
    }, 50); // optional small delay
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div key={fadeKey} className="fade-in h-full dark:bg-[var(--primary-dark)]">
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
