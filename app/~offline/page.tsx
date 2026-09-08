export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center bg-background px-6 text-foreground">
      <div className="mx-auto w-full max-w-lg py-12">
        <p className="text-sm text-muted-foreground">Offline</p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          Connection unavailable
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Reconnect to load the latest goal and transaction data.
        </p>
      </div>
    </main>
  )
}
