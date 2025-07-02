import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FadeScaleTransition, 
  SlideTransition, 
  LiquidTransition, 
  CurtainTransition,
  GlitchTransition 
} from './animated-routes';

const TransitionContext = createContext();

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
};

export function TransitionProvider({ children }) {
  const [transitionType, setTransitionType] = useState(() => {
    return localStorage.getItem('pageTransitionType') || 'fadeScale';
  });

  useEffect(() => {
    localStorage.setItem('pageTransitionType', transitionType);
  }, [transitionType]);

  const value = {
    transitionType,
    setTransitionType
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function DynamicTransition({ children }) {
  const { transitionType } = useTransition();

  switch (transitionType) {
    case 'slide':
      return <SlideTransition>{children}</SlideTransition>;
    case 'liquid':
      return <LiquidTransition>{children}</LiquidTransition>;
    case 'curtain':
      return <CurtainTransition>{children}</CurtainTransition>;
    case 'glitch':
      return <GlitchTransition>{children}</GlitchTransition>;
    case 'fadeScale':
    default:
      return <FadeScaleTransition>{children}</FadeScaleTransition>;
  }
}