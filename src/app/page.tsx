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

      {/* 857 / 407 columns at 1440, per the design; stacks below xl. */}
      <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_407px]">
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
