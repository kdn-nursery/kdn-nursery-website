import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center md:px-6">
      <h1 className="font-display text-4xl text-forest">Page not found</h1>
      <p className="mt-2 font-display text-2xl text-forest" lang="ta">
        பக்கம் காணப்படவில்லை
      </p>
      <p className="mt-4 text-muted-foreground">
        That address is not part of the nursery site.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-primary-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
