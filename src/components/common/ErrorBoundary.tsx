
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  }

  handleReload = (): void => {
    window.location.reload();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <div className="p-6 border border-red-800 rounded-lg bg-card shadow-lg">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
          </div>
          
          <div className="bg-black/20 p-4 rounded mb-4 overflow-auto max-h-32">
            <p className="text-sm text-red-300 whitespace-pre-wrap">
              {this.state.error?.message || "Erreur inconnue"}
            </p>
          </div>
          
          <div className="flex gap-4 justify-end">
            <Button 
              variant="outline" 
              onClick={this.handleReset}
            >
              Réessayer
            </Button>
            <Button 
              variant="destructive" 
              onClick={this.handleReload}
            >
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
