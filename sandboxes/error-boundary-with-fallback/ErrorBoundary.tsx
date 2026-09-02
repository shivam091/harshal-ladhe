import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  // Receives the caught error and a reset function, returns the fallback UI to render in its place.
  fallback: (error: Error, reset: () => void) => ReactNode;
  // Optional side-channel for logging to an error-tracking service — runs after the error is caught.
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Catches render-time errors thrown anywhere in `children` and swaps that subtree for `fallback`
// instead of letting the crash propagate up and unmount the rest of the app. Must be a class
// component — React has no hook equivalent of getDerivedStateFromError/componentDidCatch.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  // Runs during the render phase — derive state from the thrown error only, no side effects here.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  // Runs after the render phase — safe place for side effects like logging.
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  // Clears the caught error so `children` mounts fresh on the next render.
  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }

    return this.props.children;
  }
}
