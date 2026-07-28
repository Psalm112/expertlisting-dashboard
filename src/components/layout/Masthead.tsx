import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LogoMark } from '@/components/LogoMark';
import { ICONS } from '@/components/icons/registry';
import { Tooltip } from '@/components/ui/Tooltip';
import { CURRENT_USER, QUICK_ACTIONS } from '@/lib/mock-data';

/**
 * The dark green bar: wordmark, icon-only quick actions, and the user avatar.
 *
 * All five quick actions stay visible at every width. Below `sm` the wordmark
 * collapses to just the glyph, which frees the ~150px needed to keep them.
 */
export function Masthead() {
  return (
    <div className="bg-brand">
      {/* 82px is the design height; trimmed on phones so the sticky chrome does
          not eat a fifth of a small viewport. */}
      <div className="shell flex h-16 items-center justify-between gap-2 md:h-[82px] md:gap-4">
        <Link href="/" className="shrink-0 rounded-sm text-white" aria-label="Expert Listing home">
          <LogoMark className="h-6 w-auto transition-opacity hover:opacity-90 sm:hidden" />
          <Logo className="hidden h-[26px] w-auto transition-opacity hover:opacity-90 sm:block" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <ul className="flex items-center gap-0.5 md:gap-6">
            {QUICK_ACTIONS.map((action) => {
              const Icon = ICONS[action.icon];

              return (
                <li key={action.id}>
                  <Tooltip label={action.label}>
                    <button
                      type="button"
                      aria-label={action.label}
                      // 40px touch target on phones, tightening to the design's
                      // 32px icon with 24px gaps once there is room for it.
                      className="grid size-10 place-items-center rounded-full text-white/85 transition duration-300 hover:text-white active:scale-95 md:size-8"
                    >
                      <Icon className="size-7 md:size-8" />
                    </button>
                  </Tooltip>
                </li>
              );
            })}
          </ul>

          <ProfileButton />
        </div>
      </div>
    </div>
  );
}

/**
 * Avatar with the hover card the prototype shows: name over email, on a light
 * panel anchored to the avatar's right edge so it never runs off screen.
 */
function ProfileButton() {
  return (
    <div className="group/profile relative">
      <button
        type="button"
        aria-label={`Account menu for ${CURRENT_USER.name}`}
        className="text-brand grid size-10 shrink-0 place-items-center rounded-full border border-white/50 bg-white text-[1.4375rem]/[1.875rem] font-medium transition duration-300 ring-inset hover:ring-4 hover:ring-white/30 active:scale-95"
      >
        {CURRENT_USER.initial}
      </button>

      <div
        role="tooltip"
        className="rounded-panel bg-surface-sunken pointer-events-none absolute top-full right-0 z-50 mt-2.5 px-4 py-3 text-right opacity-0 shadow-xl transition-opacity duration-200 group-focus-within/profile:opacity-100 group-hover/profile:opacity-100"
      >
        <p className="text-md text-ink-strong font-semibold whitespace-nowrap">
          {CURRENT_USER.name}
        </p>
        <p className="text-ink-subtle mt-0.5 text-sm whitespace-nowrap">{CURRENT_USER.email}</p>
      </div>
    </div>
  );
}
