'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ICONS } from '@/components/icons/registry';
import { NAV_ITEMS } from '@/lib/mock-data';
import { cn } from '@/lib/cn';

/**
 * The six section tabs.
 *
 * The design only specifies 1440, where the row is spread edge to edge. Below
 * `xl` the tabs become a horizontally scrollable strip rather than collapsing
 * into a drawer: six destinations stay one tap away, keyboard order is
 * unchanged, and there is no menu state to manage.
 */
export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="border-b border-line-soft bg-surface">
      <div className="shell relative">
        <ul
          className={cn(
            'flex h-14 items-center gap-1 overflow-x-auto scroll-smooth md:h-[67px]',
            'xl:justify-between xl:gap-12 xl:overflow-visible',
            // hide the scrollbar without hiding the overflow
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname === item.href;

            return (
              <li key={item.id} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-[38px] items-center justify-center gap-2 rounded-control px-5',
                    'text-base whitespace-nowrap transition-colors duration-150',
                    active
                      ? 'bg-brand-accent/15 font-semibold text-brand-accent'
                      : 'font-normal text-ink-body hover:bg-surface-sunken',
                  )}
                >
                  <Icon className="size-6 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Fade hints that the strip scrolls, on the breakpoints where it does. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent xl:hidden"
        />
      </div>
    </nav>
  );
}
