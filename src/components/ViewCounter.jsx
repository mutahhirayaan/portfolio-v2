import { Eye } from 'lucide-react';
import { useViewCount } from '../hooks/useViewCount';

const fmt = new Intl.NumberFormat('en-US');

export default function ViewCounter({ className = '' }) {
  const { loading, count } = useViewCount();
  if (!loading && count == null) return null;
  return (
    <p className={`chip ${className}`} aria-live="polite">
      <Eye size={14} aria-hidden="true" />
      {loading ? <span className="skeleton inline-block h-3 w-24 rounded" aria-label="Loading views" /> : <span>Portfolio Views: <strong className="text-fg">{fmt.format(count)}</strong></span>}
    </p>
  );
}
