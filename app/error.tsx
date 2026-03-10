"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[App Error]", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Ein Fehler ist aufgetreten
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Entschuldigung, es gab ein technisches Problem. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt unter{" "}
          <a href="tel:+4920878012578" className="text-slate-900 font-medium underline underline-offset-2">
            0208 780 125 78
          </a>.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Erneut versuchen
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    </div>
  )
}
