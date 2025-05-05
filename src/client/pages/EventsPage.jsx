import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import EventSample from '../components/EventSample.jsx';

const EventsPage = () => {
  return (
    <>
      <Header />
      <main className="flex flex-wrap justify-center gap-4 p-4 w-full box-border">
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
          <div className="w-[19%]"> <EventSample /> </div>
      </main>

      <Footer />
    </>
  );
};

export default EventsPage;