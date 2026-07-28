import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ICONS } from '@/components/icons/registry';
import { CURRENT_USER, QUICK_ACTIONS } from '@/lib/mock-data';

/**
 * The dark green bar: wordmark, icon-only quick actions, and the user avatar.
 *
 * Below `lg` the quick actions collapse to the two most useful ones so the bar
 * does not crowd out the wordmark on a phone.
 */
export function Masthead() {
  return (
    <div className="bg-brand">
      {/* 82px is the design height; trimmed on phones so the sticky chrome does
          not eat a fifth of a small viewport. */}
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-[82px]">
        <Link href="/" className="shrink-0 rounded-sm" aria-label="Expert Listing home">
          <Logo className="h-[26px] w-auto text-white transition-opacity hover:opacity-90" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-4 sm:gap-6">
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = ICONS[action.icon];

              return (
                <li
                  key={action.id}
                  // Keep the first two on small screens; reveal the rest as space allows.
                  className={index > 1 ? 'hidden lg:block' : undefined}
                >
                  <button
                    type="button"
                    aria-label={action.label}
                    title={action.label}
                    // The prototype swaps these to a filled variant on hover over
                    // 300ms. Those variants are remote components with no local
                    // geometry, so the artwork cannot be exported; this keeps the
                    // timing and the intent without inventing a second icon set.
                    className="block rounded-md text-white/80 transition duration-300 hover:scale-110 hover:text-white active:scale-95"
                  >
                    <Icon className="size-8" />
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label={`Account menu for ${CURRENT_USER.greetingName}`}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/50 bg-white text-[1.4375rem]/[1.875rem] font-medium text-brand ring-white/0 transition duration-300 ring-inset hover:ring-4 hover:ring-white/30 active:scale-95"
          >
            {CURRENT_USER.initial}
          </button>
        </div>
      </div>
    </div>
  );
}
