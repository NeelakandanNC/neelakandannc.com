import { motion } from 'framer-motion';

/**
 * Word-by-word headline reveal — each word rises and fades in,
 * staggered. Pass plain text via `text`.
 */
export default function RevealText({
  text,
  className = '',
  delay = 0,
  stagger = 0.06,
  as = 'h2',
}) {
  const words = text.split(' ');
  const MotionTag = motion[as] || motion.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            variants={{
              hidden: { y: '110%' },
              visible: { y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
