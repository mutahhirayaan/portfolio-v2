import { useEffect, useState } from 'react';
import { getViewCount } from '../services/analyticsService';

export function useViewCount() {
  const [state, setState] = useState({ loading: true, count: null });
  useEffect(() => {
    let alive = true;
    getViewCount().then((count) => alive && setState({ loading: false, count }));
    return () => { alive = false; };
  }, []);
  return state;
}
