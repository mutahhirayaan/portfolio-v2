import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

export default function ThemeToggle() {
  const mode = useSelector((s) => s.theme.mode);
  const dispatch = useDispatch();
  const isDark = mode === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
