import { PlaceholderPage } from '@/components/layout/PlaceholderPage';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <PlaceholderPage
      title="Page not found"
      description="That link does not point anywhere in this build. Only the dashboard is covered by the supplied design."
    />
  );
}
