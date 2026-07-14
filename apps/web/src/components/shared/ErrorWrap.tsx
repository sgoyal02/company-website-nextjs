'use client';
import React from 'react';

class ErrorWrap extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
            <p className="mt-3 text-slate-500">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="mt-6 btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorWrap;
