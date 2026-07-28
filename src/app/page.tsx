import { MetricPhotoCard } from '@/components/dashboard/MetricPhotoCard';
import { OverviewPanelCard } from '@/components/dashboard/OverviewPanelCard';
import { SalesOverviewCard } from '@/components/dashboard/SalesOverviewCard';
import { Reveal } from '@/components/ui/Reveal';
import { CURRENT_USER, METRIC_CARDS, OVERVIEW_PANELS } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <>
      <Reveal>
        <h1 className="text-ink-strong text-2xl font-semibold">
          Welcome, {CURRENT_USER.greetingName}
        </h1>
      </Reveal>

      {/*
        857 / 407 columns, per the design. The split waits until 1360, which is
        the first width where the full 1284 content column fits, so the sales
        card lands on its designed 857 rather than being squeezed.
      */}
      <Reveal delay={0.06} className="mt-4 grid gap-5 min-[1360px]:grid-cols-[minmax(0,1fr)_407px]">
        <SalesOverviewCard />
        <div className="flex flex-col gap-5 min-[1360px]:flex-col sm:max-[1359px]:flex-row">
          {OVERVIEW_PANELS.map((panel) => (
            <OverviewPanelCard key={panel.id} panel={panel} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.12} className="mt-8">
        <section aria-label="Listing highlights">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METRIC_CARDS.map((card, index) => (
              <MetricPhotoCard key={card.id} card={card} priority={index === 0} />
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}
