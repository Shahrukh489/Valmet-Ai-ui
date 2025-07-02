import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function PageTransition({ 
  children, 
  className,
  type = 'fade',
  duration = 300,
  delay = 0 
}) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentLocation) {
      // Page is changing, start exit animation
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentLocation(location.pathname);
        setIsVisible(true);
      }, duration / 2);
    } else {
      // Initial load or same page
      setTimeout(() => setIsVisible(true), delay);
    }
  }, [location.pathname, currentLocation, duration, delay]);

  const getTransitionClasses = () => {
    const baseClasses = "transition-all ease-out";
    const durationClass = `duration-${duration}`;
    
    switch (type) {
      case 'slide-up':
        return cn(
          baseClasses,
          durationClass,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        );
      case 'slide-down':
        return cn(
          baseClasses,
          durationClass,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-8"
        );
      case 'slide-left':
        return cn(
          baseClasses,
          durationClass,
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-8"
        );
      case 'slide-right':
        return cn(
          baseClasses,
          durationClass,
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-8"
        );
      case 'scale':
        return cn(
          baseClasses,
          durationClass,
          isVisible 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        );
      case 'fade':
      default:
        return cn(
          baseClasses,
          durationClass,
          isVisible ? "opacity-100" : "opacity-0"
        );
    }
  };

  return (
    <div className={cn(getTransitionClasses(), className)}>
      {children}
    </div>
  );
}

export function StaggeredPageTransition({ 
  children, 
  className,
  staggerDelay = 100 
}) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  
  useEffect(() => {
    const childArray = React.Children.toArray(children);
    
    childArray.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * staggerDelay);
    });
  }, [children, staggerDelay]);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            visibleItems.has(index)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export function SlideInSection({ 
  children, 
  direction = 'up',
  className,
  threshold = 0.1,
  once = true 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, once]);

  const getDirectionClasses = () => {
    const baseClasses = "transition-all duration-700 ease-out";
    
    switch (direction) {
      case 'up':
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        );
      case 'down':
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-8"
        );
      case 'left':
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-8"
        );
      case 'right':
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-8"
        );
      default:
        return cn(
          baseClasses,
          isVisible ? "opacity-100" : "opacity-0"
        );
    }
  };

  return (
    <div
      ref={setRef}
      className={cn(getDirectionClasses(), className)}
    >
      {children}
    </div>
  );
}

export function FadeInOnMount({ 
  children, 
  delay = 0,
  duration = 300,
  className 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-opacity ease-out",
        `duration-${duration}`,
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}