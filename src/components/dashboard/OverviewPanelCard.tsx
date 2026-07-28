import { CardListings, CardUsers } from '@/components/icons';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatBlock } from '@/components/ui/StatBlock';
import { ViewAllLink } from '@/components/ui/ViewAllLink';
import type { OverviewPanel } from '@/lib/types';

const HEADER_ICON = {
  listings: CardListings,
  users: CardUsers,
} as const;

/** Listings Overview / User Overview - same shell, different stat counts. */
export function OverviewPanelCard({ panel }: { panel: OverviewPanel }) {
  const Icon = HEADER_ICON[panel.icon];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-ink-title flex min-w-0 items-center gap-2.5 text-base font-medium">
          <Icon className="text-data-blue size-6 shrink-0" />
          <span className="truncate">{panel.title}</span>
        </h2>

        <ViewAllLink href={panel.href} label={panel.title} />
      </CardHeader>

      <CardBody>
        <dl className="grid grid-cols-3 gap-x-4 gap-y-3">
          {panel.stats.map((stat) => (
            <StatBlock key={stat.id} label={stat.label} value={stat.value} />
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}
