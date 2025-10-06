import React, { Suspense, ComponentType } from "react";
import { motion } from "framer-motion";

// Loading component for lazy loaded routes
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="text-gray-600">Loading...</p>
    </motion.div>
  </div>
);

// Higher-order component for lazy loading with error boundary
const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(() => import(`../pages/${Component.name}`));

  return (props: P) => (
    <Suspense
      fallback={fallback ? React.createElement(fallback) : <LoadingSpinner />}
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default withLazyLoading;
export { LoadingSpinner };
