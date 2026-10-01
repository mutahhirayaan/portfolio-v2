import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useSeo } from '../hooks/useSeo';

export default function NotFound() {
  useSeo({ title: 'Page not found', path: '/404' });
  return (
    <PageTransition>
      <section className="container-x flex min-h-[80vh] flex-col items-center justify-center text-center">
        <p className="font-mono text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold sm:text-7xl">This page doesn't exist.</h1>
        <p className="mt-4 max-w-md text-muted">The link may be broken or the project may have moved.</p>
        <Link to="/" className="btn-primary mt-8">Back to home</Link>
      </section>
    </PageTransition>
  );
}
