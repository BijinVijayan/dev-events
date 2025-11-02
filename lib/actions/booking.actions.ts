'use server';

import Booking from '@/database/booking.model';

import connectDB from '@/lib/mongodb';

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectDB();

    await Booking.create({ eventId, slug, email });

    return { success: true };
  } catch (e) {
    console.error('create booking failed', e);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (e.code === 11000 && e.keyPattern && e.keyPattern.eventId && e.keyPattern.email) {
      // Duplicate key error on eventId + email uniqueness constraint
      return { success: false, error: 'already_booked' };
    }

    return { success: false, error: 'unknown_error' };
  }
};
