'use client';
import { createBooking } from '@/lib/actions/booking.actions';
import { useState } from 'react';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const response = await createBooking({ eventId, slug, email });

    if (response.success) {
      setSubmitted(true);
    } else if (response.error === 'already_booked') {
      setErrorMessage('You have already booked this event.');
    } else {
      setErrorMessage('Booking creation failed. Please try again later.');
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
