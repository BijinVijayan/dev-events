import { Suspense } from 'react';
import EventDetails from '@/components/EventDetails';

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = params.then((p) => p.slug);

  return (
    <main className="p-0 m-0">
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
};
export default EventDetailsPage;
