'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { ICONS } from '@/components/icons/registry';
import { SPRING } from '@/lib/motion';
import { NAV_ITEMS } from '@/lib/mock-data';
import { cn } from '@/lib/cn';


export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="border-line-soft bg-surface border-b">
      <div className="shell relative">
        <ul
          className={cn(
            'flex h-14 items-center gap-1 overflow-x-auto scroll-smooth md:h-[67px]',
            'xl:justify-between xl:gap-12 xl:overflow-visible',
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
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
                    'rounded-control relative flex h-[38px] items-center justify-center gap-2 px-5',
                    'text-base whitespace-nowrap transition-colors duration-150',
                    active
                      ? 'text-brand-accent font-semibold'
                      : 'text-ink-body hover:bg-surface-sunken font-normal',
                  )}
                >
                  {/* One pill shared across items, so it slides between tabs. */}
                  {active && (
                    <m.span
                      layoutId="nav-pill"
                      transition={SPRING}
                      className="bg-brand-accent/15 rounded-control absolute inset-0"
                    />
                  )}

                  <Icon className="relative size-6 shrink-0" />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Fade hints that the strip scrolls, on the breakpoints where it does. */}
        <div
          aria-hidden
          className="from-surface pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent xl:hidden"
        />
      </div>
    </nav>
  );
}
