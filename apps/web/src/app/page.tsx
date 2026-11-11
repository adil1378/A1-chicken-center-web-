import { ShieldCheck, Server, Sparkles, Layers } from "lucide-react";

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  return (
    <main className="min-h-screen bg-black-deep text-white-pure flex flex-col justify-between p-6 sm:p-12 lg:p-20">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-8 border-b border-black-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center font-bold text-lg tracking-wider text-white shadow-lg shadow-brand-950">
            A1
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              A1 CHICKEN CENTER
            </h1>
            <p className="text-xs sm:text-sm text-brand-500 font-medium tracking-wide">
              Freshness You Can Trust.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black-surface border border-brand-800/40 text-xs font-medium text-white-off">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span>Phase 1 of 8</span>
        </div>
      </header>

      {/* Hero / Phase 1 Status */}
      <section className="max-w-4xl mx-auto w-full my-auto py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-100 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Foundation & Architecture Initialized</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white-pure mb-6">
          A1 Chicken Center <br />
          <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 bg-clip-text text-transparent">
            Web Platform
          </span>
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-black-muted max-w-2xl mx-auto leading-relaxed mb-10">
          Clean architecture baseline connecting modern Next.js TypeScript frontend with
          high-performance FastAPI backend and Supabase PostgreSQL database.
        </p>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-5 rounded-xl bg-black-surface border border-black-border hover:border-brand-800/50 transition">
            <div className="flex items-center gap-2 text-brand-500 mb-2">
              <Layers className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black-muted">Frontend</span>
            </div>
            <p className="text-base font-bold text-white">Next.js App Router</p>
            <p className="text-xs text-black-muted mt-1">TypeScript 5, Tailwind CSS, Responsive Design Tokens</p>
          </div>

          <div className="p-5 rounded-xl bg-black-surface border border-black-border hover:border-brand-800/50 transition">
            <div className="flex items-center gap-2 text-brand-500 mb-2">
              <Server className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black-muted">Backend</span>
            </div>
            <p className="text-base font-bold text-white">FastAPI (Python 3.12+)</p>
            <p className="text-xs text-black-muted mt-1">Pydantic v2, CORS Configured, Baseline /health Ready</p>
          </div>

          <div className="p-5 rounded-xl bg-black-surface border border-black-border hover:border-brand-800/50 transition">
            <div className="flex items-center gap-2 text-brand-500 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black-muted">Database</span>
            </div>
            <p className="text-base font-bold text-white">Supabase PostgreSQL</p>
            <p className="text-xs text-black-muted mt-1">Versioned Migration Structure (`supabase/migrations/`)</p>
          </div>
        </div>

        {/* Backend Connectivity Note */}
        <div className="mt-8 inline-flex items-center gap-2 text-xs text-black-muted bg-black-surface/50 border border-black-border px-4 py-2 rounded-lg">
          <span>Backend Target:</span>
          <code className="text-brand-500 font-mono">{apiBaseUrl}/health</code>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-8 border-t border-black-border text-center sm:flex sm:items-center sm:justify-between text-xs text-black-muted">
        <p>&copy; 2026 A1 Chicken Center. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-medium">Phase 1: Foundation & Architecture Completed</p>
      </footer>
    </main>
  );
}
