import ExploreBtn from '@/components/ExploreBtn';
import EventCard from '@/components/EventCard';
import { cacheLife } from 'next/cache';
import { IEvent } from '@/database/event.model';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  'use cache';
  cacheLife('minutes');
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section className={'-mt-[65px]'}>
      <div className={'container min-h-screen flex flex-col justify-center items-center'}>
        <h1 className="text-center">
          The Hub for Every Dev <br /> Event You Can&#39;t Miss
        </h1>
        <p className="text-center mt-8">Hackathons, Meetups, and Conferences, All in One Place</p>
        <ExploreBtn />
      </div>

      <div id={'events'} className="pb-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 ? (
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="list-none">No events found.</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Page;
