import EventForm from '@/components/EventForm';

const CreateEvent = () => {
  return (
    <div
      className={
        'min-h-screen flex flex-col items-center justify-center w-full font-schibsted-grotesk sm:py-5'
      }
    >
      <h2 className={'text-3xl sm:text-4xl lg:text-5xl mb-10'}>Create an Event</h2>
      <EventForm />
    </div>
  );
};

export default CreateEvent;
