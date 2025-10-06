// Performance optimization utilities
import { memo, useMemo, useCallback, useRef } from "react";

// Debounce utility for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memo wrapper with display name for debugging
export const memoWithDisplayName = <P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) => {
  const MemoizedComponent = memo(Component);
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }
  return MemoizedComponent;
};

// Stable callback hook to prevent unnecessary re-renders
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
};

// Stable value hook for object/array props
export const useStableValue = <T>(value: T): T => {
  const ref = useRef(value);
  if (!Object.is(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
};

// Memoized selector for complex calculations
export const useMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  dependencies: React.DependencyList
): R => {
  return useMemo(() => selector, dependencies) as R;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLElement | null>(null);
  const observer = useMemo(() => {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);
  }, [callback, options]);

  const observe = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        observer.observe(element);
        targetRef.current = element;
      }
    },
    [observer]
  );

  const unobserve = useCallback(() => {
    if (targetRef.current) {
      observer.unobserve(targetRef.current);
    }
  }, [observer]);

  return { observe, unobserve };
};

// Virtual scrolling utilities
export const getVisibleRange = (
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number
) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems - 1
  );

  return { startIndex, endIndex };
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV === "development") {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

// Bundle size optimization helpers
export const lazyImport = <T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> => {
  return importFn().then((module) => module.default);
};

// Memory leak prevention
export const useCleanup = (cleanupFn: () => void) => {
  const cleanupRef = useRef(cleanupFn);
  cleanupRef.current = cleanupFn;

  // Cleanup on unmount
  useMemo(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);
};
