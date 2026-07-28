import Link from 'next/link';
import { ChevronRightSm } from '@/components/icons';

/** "View all >" affordance in the overview card headers. */
export function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-0.5 rounded-sm text-xs font-medium text-data-blue transition-opacity hover:opacity-70"
    >
      View all
      <span className="sr-only"> {label}</span>
      <ChevronRightSm className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
