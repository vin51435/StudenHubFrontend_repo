import React from 'react';

const FullHeightSVG = () => {
  return (
    <div style={{ height: '100vh' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 300" xmlns="http://www.w3.org/2000/svg">
        {/* Curved line from top to bottom */}
        <path
          d="M50 0 
             C 70 50, 70 100, 50 150
             C 30 200, 30 250, 50 300"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default FullHeightSVG;
