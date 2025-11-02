'use client';

import { useState, useEffect } from 'react';
import { IEvent } from '@/database/event.model';
import Image from 'next/image';
import Link from 'next/link';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
const ITEMS_PER_PAGE = 10;

function Admin() {
  return (
    <div className={'relative'}>
      <button
        onClick={() =>
          fetch('/api/admin/logout', { method: 'POST' }).then(() => (location.href = '/'))
        }
        className="absolute top-0 right-1 text-sm text-red-400 border border-slate-800 hover:bg-dark-200 transition duration-300 py-2 rounded-lg px-5 cursor-pointer"
      >
        Logout
      </button>
      <div className="flex-col flex sm:flex-row space-y-5 items-center justify-between my-16">
        <h3 className="text3xl sm:text-4xl lg:text-5xl">Event Management</h3>
        <div className="bg-green-700 text-white text-sm rounded-lg font-semibold py-3 px-4 cursor-pointer max-sm:w-fit">
          <Link href={'/admin/create-event'}>Add New Event</Link>
        </div>
      </div>
      <EventsList />
    </div>
  );
}

export default Admin;

function EventsList() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch events
  useEffect(() => {
    fetch(`${BASE_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedRows = events.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const confirmDelete = (slug: string) => {
    setSelectedSlug(slug);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSlug) return;
    try {
      const res = await fetch(`/api/events/${selectedSlug}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.slug !== selectedSlug));
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch {
      alert('Error deleting event.');
    } finally {
      setDialogOpen(false);
      setSelectedSlug(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-auto">
      <table
        className="border border-slate-700 w-full bg-[#182028] text-white rounded-xl overflow-hidden"
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr className="bg-slate-800 text-sm">
            <th className="p-2">Events</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-6">
                No events found.
              </td>
            </tr>
          )}
          {paginatedRows.map((event, idx) => (
            <tr key={idx}>
              <td className="border-t border-slate-700 flex flex-col sm:flex-row items-center gap-4 p-3">
                <Image
                  src={event.image}
                  alt="icon"
                  width={50}
                  height={50}
                  className="bg-cover h-[50px] w-auto"
                />
                <span className="text-sm">{event.title}</span>
              </td>
              <td className="p-3 border border-slate-700 text-sm truncate">{event.location}</td>
              <td className="p-3 border border-slate-700 text-sm min-w-[100px]">{event.date}</td>
              <td className="p-3 border border-slate-700 text-sm">{event.time}</td>
              <td className="p-3 border border-slate-700 text-sm min-w-[110px]">
                <Link href="#edit" className="text-cyan-400 mr-4">
                  Edit
                </Link>
                <button
                  onClick={() => confirmDelete(event.slug)}
                  className="text-red-400 hover:text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-8 flex items-center gap-4 justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-5 py-2 rounded-lg text-white ${
            page === 1 ? 'bg-[#2a3b4d] cursor-not-allowed' : 'bg-[#314c6a]'
          }`}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-5 py-2 rounded-lg text-white ${
            page === totalPages || totalPages === 0
              ? 'bg-[#2a3b4d] cursor-not-allowed'
              : 'bg-[#314c6a]'
          }`}
        >
          Next
        </button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Delete Event?"
        description="This will permanently remove the event from your list."
        onConfirm={handleDelete}
      />
    </div>
  );
}
