import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: 'blur(10px)',
  },
  in: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    x: 20,
    filter: 'blur(10px)',
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export function AnimatedRoutes({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Alternative smooth fade with scale
export function FadeScaleTransition({ children }) {
  const location = useLocation();

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.645, 0.045, 0.355, 1.0],
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.645, 0.045, 0.355, 1.0],
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Sliding pages with parallax effect
export function SlideTransition({ children }) {
  const location = useLocation();

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -15 : 15,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? -15 : 15,
    })
  };

  return (
    <AnimatePresence mode="wait" custom={1}>
      <motion.div
        key={location.pathname}
        custom={1}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          rotateY: { duration: 0.4 }
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          perspective: 1200,
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Morphing liquid transition
export function LiquidTransition({ children }) {
  const location = useLocation();

  const variants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(20px) brightness(0.8)',
      borderRadius: '50%',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      borderRadius: '0%',
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(20px) brightness(1.2)',
      borderRadius: '50%',
      transition: {
        duration: 0.4,
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ 
          width: '100%', 
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Curtain reveal transition
export function CurtainTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
        animate={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          transition: {
            duration: 0.6,
            ease: [0.65, 0, 0.35, 1]
          }
        }}
        exit={{ 
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          transition: {
            duration: 0.4,
            ease: [0.65, 0, 0.35, 1]
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Glitch transition effect
export function GlitchTransition({ children }) {
  const location = useLocation();

  const glitchVariants = {
    initial: {
      opacity: 0,
      x: 0,
      scaleX: 1,
      scaleY: 1,
    },
    animate: {
      opacity: [0, 1, 1, 1],
      x: [0, -2, 2, -1, 1, 0],
      scaleX: [1, 1.01, 0.99, 1.01, 1],
      scaleY: [1, 0.99, 1.01, 0.99, 1],
      filter: [
        'hue-rotate(0deg) saturate(100%) brightness(100%)',
        'hue-rotate(90deg) saturate(150%) brightness(120%)',
        'hue-rotate(-90deg) saturate(80%) brightness(80%)',
        'hue-rotate(0deg) saturate(100%) brightness(100%)'
      ],
      transition: {
        duration: 0.6,
        times: [0, 0.2, 0.5, 1],
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: [1, 1, 0],
      scaleX: [1, 1.02, 0.98],
      scaleY: [1, 0.98, 1.02],
      filter: [
        'hue-rotate(0deg) saturate(100%) brightness(100%)',
        'hue-rotate(-180deg) saturate(200%) brightness(150%)',
        'hue-rotate(0deg) saturate(0%) brightness(0%)'
      ],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1]
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={glitchVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}