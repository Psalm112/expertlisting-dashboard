import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LogoMark } from '@/components/LogoMark';
import { ICONS } from '@/components/icons/registry';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { QUICK_ACTIONS } from '@/lib/mock-data';
import { ProfileMenu } from './ProfileMenu';

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
                    {/* 40px touch target on phones, tightening to the design's
                        32px icon with 24px gaps once there is room. */}
                    <IconButton
                      label={action.label}
                      className="size-10 text-white/85 hover:text-white md:size-8"
                    >
                      <Icon className="size-7 md:size-8" />
                    </IconButton>
                  </Tooltip>
                </li>
              );
            })}
          </ul>

          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
