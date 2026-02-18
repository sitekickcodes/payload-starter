export default function Home() {
  return (
    <div className="container section flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-eyebrow text-muted-foreground">Welcome to</p>
      <h1 className="h1 mt-4">Sitekick Starter</h1>
      <p className="body-lg mt-6 max-w-lg text-muted-foreground">
        Your launchpad for building fast, beautiful websites. Clone it, customize it, ship it.
      </p>
      <div className="mt-10 flex gap-4">
        <a
          href="/admin"
          className="text-button inline-flex items-center rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open CMS
        </a>
        <a
          href="https://github.com/sitekickcodes/sitekick-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-button inline-flex items-center rounded-md border border-border px-6 py-3 transition-colors hover:bg-muted"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
