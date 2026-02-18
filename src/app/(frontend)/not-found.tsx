import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section flex flex-col items-center text-center">
      <h1 className="h1">404</h1>
      <p className="body-lg mt-4 text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="text-button mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to Home
      </Link>
    </div>
  );
}
