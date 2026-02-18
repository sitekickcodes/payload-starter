"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container section flex flex-col items-center text-center">
      <h1 className="h2">Something went wrong</h1>
      <p className="body-lg mt-4 text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="text-button mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
