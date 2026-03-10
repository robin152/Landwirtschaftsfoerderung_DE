"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  /** Optional fallback UI. If not provided, the default German-language fallback is used. */
  fallback?: ReactNode
  /** If true, renders an inline fallback instead of a full-screen one */
  inline?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error.message)
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback from parent
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Inline fallback for section-level error boundaries
      if (this.props.inline) {
        return (
          <div className="w-full py-12 px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Dieser Bereich konnte nicht geladen werden.
              </p>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        )
      }

      // Full-screen fallback (default)
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-3">
              Ein Fehler ist aufgetreten
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Entschuldigung, es gab ein technisches Problem. Bitte laden Sie die Seite neu oder kontaktieren Sie uns direkt.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  this.handleReset()
                  window.location.reload()
                }}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Seite neu laden
              </button>
              <button
                onClick={this.handleReset}
                className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
