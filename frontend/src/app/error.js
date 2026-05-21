'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to console/monitoring service
    console.error('Unhandled Application Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      {/* Cybernetic terminal container */}
      <div className="max-w-xl w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-2xl relative">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
          <span className="text-xs font-mono text-slate-500 ml-2">SYSTEM_FAILURE_DETECTION</span>
        </div>

        {/* Header Text */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent mb-4">
          Application Exception Occurred
        </h1>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 font-sans">
          The runtime caught an unhandled exception inside the component tree. The DevHire core has protected your current session state.
        </p>

        {/* Error Trace Display */}
        <div className="bg-slate-950/80 rounded-lg p-4 font-mono text-xs text-rose-400 border border-rose-500/20 mb-8 max-h-40 overflow-y-auto selection:bg-rose-500/20">
          <span className="text-slate-600 font-bold block mb-1">&gt; ERROR_LOG_DUMP:</span>
          {error?.message || 'Unknown runtime error occurred inside DevHire UI engine.'}
          {error?.digest && (
            <span className="text-slate-500 block mt-2">Digest: {error.digest}</span>
          )}
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-medium rounded-xl transition duration-300 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            Attempt Hot-Reload
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition duration-300 text-center"
          >
            Return to Safemode Home
          </Link>
        </div>
      </div>
    </div>
  );
}
