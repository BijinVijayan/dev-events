'use client';

import { useState, ChangeEvent } from 'react';
import { Calendar, Clock, MapPin, Upload, CheckCircle, XCircle, X } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  overview: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string;
  organizer: string;
  tags: string;
  image: File | null;
}

interface SubmitStatus {
  type: 'success' | 'error' | '';
  message: string;
}

interface ApiErrorResponse {
  message?: string;
}

export default function EventForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    overview: '',
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: '',
    audience: '',
    agenda: '',
    organizer: '',
    tags: '',
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: '',
    message: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const closeAlert = (): void => {
    setSubmitStatus({ type: '', message: '' });
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('overview', formData.overview);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('mode', formData.mode);
      formDataToSend.append('audience', formData.audience);

      if (formData.agenda) {
        const agendaArray: string[] = formData.agenda.split('\n').filter((item) => item.trim());
        formDataToSend.append('agenda', JSON.stringify(agendaArray));
      }

      formDataToSend.append('organizer', formData.organizer);

      if (formData.tags) {
        const tagsArray: string[] = formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
        formDataToSend.append('tags', JSON.stringify(tagsArray));
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Event created successfully!',
        });
        setFormData({
          title: '',
          description: '',
          overview: '',
          venue: '',
          location: '',
          date: '',
          time: '',
          mode: '',
          audience: '',
          agenda: '',
          organizer: '',
          tags: '',
          image: null,
        });

        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 5000);
      } else {
        const error: ApiErrorResponse = await response.json();
        setSubmitStatus({
          type: 'error',
          message: error.message || 'Failed to create event',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-2xl flex items-center justify-center p-1 sm:p-4">
      {submitStatus.message && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div
            className={`flex items-start gap-3 p-4 rounded-lg shadow-2xl backdrop-blur-sm border min-w-80 max-w-lg ${
              submitStatus.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200'
                : 'bg-red-500/10 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {submitStatus.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-lg mb-1 ${
                  submitStatus.type === 'success' ? 'text-emerald-100' : 'text-red-100'
                }`}
              >
                {submitStatus.type === 'success' ? 'Success!' : 'Error'}
              </h3>
              <p className="text-sm opacity-90">{submitStatus.message}</p>
            </div>
            <button
              onClick={closeAlert}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full bg-dark-200 rounded-2xl shadow-2xl p-5 sm:p-8 space-y-6">
        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter event title"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Event Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Event Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Venue</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="Enter venue or online link"
              className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location details"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Event Type</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Select event type</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Target Audience</label>
          <input
            type="text"
            name="audience"
            value={formData.audience}
            onChange={handleInputChange}
            placeholder="e.g., Frontend developers, students"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Organizer</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            placeholder="Enter organizer name"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">
            Event Image / Banner
          </label>
          <label className="flex items-center justify-center w-full px-4 py-8 bg-slate-700 border border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-300">
              {formData.image ? formData.image.name : 'Upload event image or banner'}
            </span>
            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Add tags such as react, next, js"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Agenda</label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleInputChange}
            placeholder="Enter agenda items (one per line)"
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Event Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Briefly describe the event"
            rows={5}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-200 text-sm font-medium mb-2">Overview</label>
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            placeholder="Provide a detailed overview"
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving Event...' : 'Save Event'}
        </button>
      </div>
    </div>
  );
}
