import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteTransitionState {
  isTransitioning: boolean;
  direction: 'forward' | 'backward' | null;
  from: string | null;
  to: string | null;
}

export const useRouteTransition = (duration: number = 300) => {
  const location = useLocation();
  const [state, setState] = useState<RouteTransitionState>({
    isTransitioning: false,
    direction: null,
    from: null,
    to: null
  });
  
  useEffect(() => {
    // Start transition
    setState(prev => ({
      isTransitioning: true,
      direction: 'forward', // Could be enhanced to detect actual direction
      from: prev.to || location.pathname,
      to: location.pathname
    }));
    
    // End transition after duration
    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false
      }));
    }, duration);
    
    return () => clearTimeout(timer);
  }, [location.pathname, duration]);
  
  return state;
};

// Hook for page transition animations
export const usePageTransition = () => {
  const { isTransitioning, direction } = useRouteTransition();
  
  const getTransitionClasses = (baseClasses: string = '') => {
    if (!isTransitioning) return baseClasses;
    
    const transitionClasses = direction === 'forward'
      ? 'animate-slide-in-right'
      : 'animate-slide-in-left';
      
    return `${baseClasses} ${transitionClasses}`;
  };
  
  return {
    isTransitioning,
    direction,
    getTransitionClasses
  };
};