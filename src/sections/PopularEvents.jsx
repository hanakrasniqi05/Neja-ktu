import React, { useState, useEffect} from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard'; 

const PopularEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await axios.get('/api/events/popular');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);
  if (loading) return <div className="text-center py-4">Loading popular events...</div>;

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-10 text-center w-full text-black">Popular Now</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-4 w-max">
          {events.map(event => (
            <EventCard key={event.EventID} event={event} />
          ))}
          </div>
        </div>
    </div>
  );
};

export default PopularEvents;
