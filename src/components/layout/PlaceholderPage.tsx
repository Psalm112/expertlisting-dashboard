import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h1 className="text-ink-strong text-2xl font-semibold">{title}</h1>

      <Card className="mt-4 flex min-h-80 flex-col items-center justify-center gap-3 p-10 text-center">
        <p className="text-md text-ink-title font-medium">Nothing to show here yet</p>
        <p className="text-ink-subtle max-w-md text-base">{description}</p>
        <Link
          href="/"
          className="rounded-control bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 mt-2 inline-flex h-10 items-center px-4 text-base font-medium transition-colors"
        >
          Back to dashboard
        </Link>
      </Card>
    </>
  );
}
