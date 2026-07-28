import { MetricPhotoCard } from '@/components/dashboard/MetricPhotoCard';
import { OverviewPanelCard } from '@/components/dashboard/OverviewPanelCard';
import { SalesOverviewCard } from '@/components/dashboard/SalesOverviewCard';
import { CURRENT_USER, METRIC_CARDS, OVERVIEW_PANELS } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-ink-strong">
        Welcome, {CURRENT_USER.greetingName}
      </h1>

      {/*
        857 / 407 columns, per the design. The split waits until 1360, which is
        the first width where the full 1284 content column fits, so the sales
        card lands on its designed 857 rather than being squeezed.
      */}
      <div className="mt-4 grid gap-5 min-[1360px]:grid-cols-[minmax(0,1fr)_407px]">
        <SalesOverviewCard />

        <div className="flex flex-col gap-5">
          {OVERVIEW_PANELS.map((panel) => (
            <OverviewPanelCard key={panel.id} panel={panel} />
          ))}
        </div>
      </div>

      <section className="mt-8" aria-label="Listing highlights">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METRIC_CARDS.map((card, index) => (
            <MetricPhotoCard key={card.id} card={card} priority={index === 0} />
          ))}
        </div>
      </section>
    </>
  );
}
