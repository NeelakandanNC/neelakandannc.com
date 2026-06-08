import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Translates children on the Y axis as the element scrolls through
 * the viewport. `speed` > 0 moves up, < 0 moves down.
 */
export default function Parallax({ children, speed = 40, className = '', ...rest }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
