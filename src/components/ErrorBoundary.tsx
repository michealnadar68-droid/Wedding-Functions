import React from 'react';
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Elysian Crash-Guard] Handled component exception:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5E0D5] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mx-auto text-[#C5A059] border border-[#C5A059]/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-widest block">
                Elysian Wedlock Safety Guard
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                {this.props.fallbackTitle || 'Session Recovered Safely'}
              </h2>
              <p className="text-xs text-[#666666] leading-relaxed">
                {this.props.fallbackMessage || 
                  'Our high-concurrency crash guard isolated this component to protect your active session, saved favorites, and live reservations.'}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] text-[11px] text-stone-600 font-mono text-left max-h-24 overflow-y-auto">
                {this.state.error.message || 'Unexpected state interruption caught cleanly.'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Restore View</span>
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border border-[#E5E0D5] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


