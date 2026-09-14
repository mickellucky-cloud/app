import React from 'react';
import { motion } from 'motion/react';

interface AnimatedP2PIconProps {
  className?: string;
  size?: number;
}

export const AnimatedP2PIcon: React.FC<AnimatedP2PIconProps> = ({
  className = '',
  size = 24,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Subtle pulsing background glow wave */}
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-400/25 dark:bg-emerald-500/20 blur-[3px]"
        animate={{
          scale: [0.9, 1.25, 0.9],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 overflow-visible"
      >
        {/* Left User Profile */}
        <motion.g
          animate={{
            x: [0, 0.8, 0],
            y: [0, -0.6, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Left Avatar Head */}
          <circle
            cx="6.5"
            cy="7"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Avatar Body */}
          <path
            d="M3 17.5C3 14.5 4.5 13 6.5 13C8.5 13 10 14.5 10 17.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Right User Profile */}
        <motion.g
          animate={{
            x: [0, -0.8, 0],
            y: [0, 0.6, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        >
          {/* Right Avatar Head */}
          <circle
            cx="17.5"
            cy="7"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Avatar Body */}
          <path
            d="M14 17.5C14 14.5 15.5 13 17.5 13C19.5 13 21 14.5 21 17.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Top Transfer Arrow: Left to Right */}
        <motion.g
          animate={{
            x: [-1.2, 1.2, -1.2],
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Arrow line */}
          <path
            d="M9 7.5H15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Arrow tip pointing right */}
          <path
            d="M13.5 5.8L15.2 7.5L13.5 9.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Bottom Transfer Arrow: Right to Left */}
        <motion.g
          animate={{
            x: [1.2, -1.2, 1.2],
            opacity: [0.65, 1, 0.65],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.9,
          }}
        >
          {/* Arrow line */}
          <path
            d="M15 15.5H9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Arrow tip pointing left */}
          <path
            d="M10.5 13.8L8.8 15.5L10.5 17.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Floating animated exchange transaction token particle */}
        <motion.circle
          cx="12"
          cy="11.5"
          r="1.2"
          className="fill-emerald-500 dark:fill-emerald-300"
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.4, 1, 0.4],
            y: [-1, 1, -1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
};
