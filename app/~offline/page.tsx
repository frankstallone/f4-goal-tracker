export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Offline
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Connection unavailable</h1>
        <p className="mt-3 text-sm text-slate-300">
          Reconnect to load the latest goal and transaction data.
        </p>
      </div>
    </main>
  )
}
