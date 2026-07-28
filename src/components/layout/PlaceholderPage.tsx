import Link from 'next/link';
import { Card } from '@/components/ui/Card';

/**
 * Every nav destination other than the dashboard resolves here.
 *
 * Only the dashboard is specified in the design, but leaving five dead links in
 * the primary navigation would be worse than an honest empty state - and it
 * lets the shell prove it is reusable across routes.
 */
export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h1 className="text-2xl font-semibold text-ink-strong">{title}</h1>

      <Card className="mt-4 flex min-h-80 flex-col items-center justify-center gap-3 p-10 text-center">
        <p className="text-md font-medium text-ink-title">Nothing to show here yet</p>
        <p className="max-w-md text-base text-ink-subtle">{description}</p>
        <Link
          href="/"
          className="mt-2 inline-flex h-10 items-center rounded-control bg-brand-accent/10 px-4 text-base font-medium text-brand-accent transition-colors hover:bg-brand-accent/20"
        >
          Back to dashboard
        </Link>
      </Card>
    </>
  );
}
