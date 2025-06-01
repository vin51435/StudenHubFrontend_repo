import React from 'react';

interface VoteIconProps extends React.ComponentPropsWithoutRef<'span'> {
  dir: 'up' | 'down';
  size?: string;
}
const VoteIcon: React.FC<VoteIconProps> = ({ dir, className, size = '1.15rem', ...props }) => (
  <span {...props}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`fill-current ${className}`}
      style={{ transform: dir === 'down' ? 'rotate(180deg)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" d="M12 2L4 14h5v8h6v-8h5L12 2z" />
    </svg>
  </span>
);

export default VoteIcon;
