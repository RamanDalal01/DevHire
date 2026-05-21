import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-teal-500/5 to-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-lg w-full text-center">
        {/* Neon 404 Header */}
        <div className="relative inline-block mb-8">
          <h1 className="text-9xl font-extrabold tracking-widest text-[#0F172A] relative select-none">
            404
            {/* Glossy Overlay text */}
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent opacity-90 font-mono tracking-widest text-8xl md:text-9xl flex items-center justify-center animate-pulse">
              404
            </span>
          </h1>
        </div>

        {/* Terminal Header */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl text-left font-mono">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-slate-500 ml-2">devhire_shell --v1.0</span>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-teal-400 font-bold">$ ping -c 1 devhire.co/route</p>
            <p className="text-slate-400">PING devhire.co/route (127.0.0.1) 56(84) bytes of data.</p>
            <p className="text-rose-400 font-bold">--- HOST RESOLUTION ERROR ---</p>
            <p className="text-slate-400">
              The endpoint directory requested does not exist or has been refactored in production.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-medium rounded-lg text-center transition duration-300 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20"
              >
                cd /home
              </Link>
              <Link
                href="/jobs"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 font-medium rounded-lg text-center transition duration-300"
              >
                cd /jobs_board
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
