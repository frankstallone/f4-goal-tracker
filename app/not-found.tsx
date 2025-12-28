import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Goal not found</h1>
        <p className="mt-3 text-sm text-slate-400">
          The goal you requested does not exist yet. Head back to the main
          dashboard to choose a different bucket.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
        >
          Return to goals
        </Link>
      </div>
    </main>
  )
}
