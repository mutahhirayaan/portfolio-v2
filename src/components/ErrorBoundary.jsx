import { Component } from 'react';

/** Renders `fallback` (default: nothing) if a child throws, e.g. WebGL is unavailable. */
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { if (import.meta.env.DEV) console.warn('ErrorBoundary caught:', error); }
  render() { return this.state.failed ? this.props.fallback ?? null : this.props.children; }
}
