import { ChatBubble } from '@/components/icons';

/**
 * Floating support entry point.
 *
 * The Figma frame parks this mid-canvas, which is an artefact of a static
 * mockup - here it is pinned to the bottom-right of the viewport, which is what
 * a floating action button is for.
 */
export function ChatButton() {
  return (
    <button
      type="button"
      aria-label="Open support chat"
      className="fixed right-5 bottom-5 z-50 grid size-[58px] place-items-center rounded-full border border-white/20 bg-surface-invert text-white shadow-lg transition hover:scale-105 hover:bg-black active:scale-95 md:right-8 md:bottom-8"
    >
      <ChatBubble className="size-6" />
    </button>
  );
}
