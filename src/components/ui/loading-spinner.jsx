import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  variant = 'default',
  children 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'text-primary',
    muted: 'text-muted-foreground',
    white: 'text-white',
    current: 'text-current'
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant],
          className
        )} 
      />
      {children && (
        <span className="ml-2 text-sm text-muted-foreground animate-pulse">
          {children}
        </span>
      )}
    </div>
  );
}

export function LoadingDots({ 
  size = 'md', 
  className,
  variant = 'default' 
}) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const variantClasses = {
    default: 'bg-primary',
    muted: 'bg-muted-foreground',
    white: 'bg-white',
    current: 'bg-current'
  };

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            sizeClasses[size],
            variantClasses[variant]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}

export function LoadingBar({ 
  progress, 
  className,
  animated = true 
}) {
  return (
    <div className={cn('w-full bg-secondary rounded-full h-2', className)}>
      <div
        className={cn(
          'h-2 bg-primary rounded-full transition-all duration-300 ease-out',
          animated && 'animate-pulse'
        )}
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  );
}

export function LoadingSkeleton({ 
  className,
  lines = 3,
  animated = true 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-muted rounded',
            animated && 'animate-pulse',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function LoadingCard({ 
  className,
  animated = true 
}) {
  return (
    <div className={cn('card p-6', className)}>
      <div className="space-y-4">
        <div className={cn('h-6 bg-muted rounded w-1/2', animated && 'animate-pulse')} />
        <div className="space-y-2">
          <div className={cn('h-4 bg-muted rounded', animated && 'animate-pulse')} />
          <div className={cn('h-4 bg-muted rounded w-5/6', animated && 'animate-pulse')} />
          <div className={cn('h-4 bg-muted rounded w-3/4', animated && 'animate-pulse')} />
        </div>
        <div className="flex space-x-2 pt-2">
          <div className={cn('h-8 bg-muted rounded w-20', animated && 'animate-pulse')} />
          <div className={cn('h-8 bg-muted rounded w-20', animated && 'animate-pulse')} />
        </div>
      </div>
    </div>
  );
}

export function LoadingOverlay({ 
  show, 
  children, 
  text = 'Loading...',
  className 
}) {
  if (!show) return children;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className={cn(
        'absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        'animate-fade-in',
        className
      )}>
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function PulseLoader({ 
  size = 'md', 
  className,
  variant = 'default' 
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'border-primary',
    muted: 'border-muted-foreground',
    white: 'border-white'
  };

  return (
    <div 
      className={cn(
        'rounded-full border-2 border-t-transparent animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}