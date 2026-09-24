import React from 'react';

interface FeedbackStarIconProps {
  className?: string;
}

export const FeedbackStarIcon: React.FC<FeedbackStarIconProps> = ({
  className = 'w-4 h-4 text-geovision-blue dark:text-white',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Speech Bubble outline with speech tail & top-right cutout */}
      <path d="M12 3H6A3 3 0 0 0 3 6v8a3 3 0 0 0 3 3h2v3.5L12 17h6a3 3 0 0 0 3-3v-2.5" />
      {/* Inner message horizontal text lines */}
      <path d="M8 8h5" />
      <path d="M8 12h8" />
      {/* Star badge on top-right corner */}
      <path d="m18 1.5 1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" />
    </svg>
  );
};

export default FeedbackStarIcon;
