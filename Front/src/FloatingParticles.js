import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingParticles = ({ darkMode }) => {
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => {
      const size = 2 + Math.random() * 3;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 5 + Math.random() * 10;
      const offsetX = (Math.random() - 0.5) * 20;

      return (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            backgroundColor: darkMode
              ? 'rgba(165,180,252,0.6)'
              : 'rgba(255,255,255,0.6)',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, offsetX, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        />
      );
    });
  }, [darkMode]);

  return <>{particles}</>;
};

export default React.memo(FloatingParticles);
