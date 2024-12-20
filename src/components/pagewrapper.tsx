import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

//this component controls the animated sections
export function PageWrapper({ children, className }: PageWrapperProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
