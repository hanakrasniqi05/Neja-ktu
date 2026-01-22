import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const filterPastEvents = (events) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return events.filter(event => {
    const eventDate = new Date(event.StartDateTime || event.EventDate);
    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    return eventDateOnly >= currentDate;
  });
};

const sortEventsByDate = (events) => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.StartDateTime || a.EventDate || 0);
    const dateB = new Date(b.StartDateTime || b.EventDate || 0);
    return dateB - dateA;
  });
};

const PopularEvents = () => {
  const [popularEvents, setPopularEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [popularRes, allRes] = await Promise.all([
          axios.get('/api/events/popular'),
          axios.get('/api/events') 
        ]);
        const upcomingPopular = sortEventsByDate(
          filterPastEvents(popularRes.data || [])
        );

        const upcomingAll = sortEventsByDate(
          filterPastEvents(allRes.data || [])
        );

        setPopularEvents(upcomingPopular);
        setAllEvents(upcomingAll);

      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-4">Loading popular events...</div>;
 
  const displayEvents = popularEvents.length > 0 ? popularEvents : allEvents;
  const isPopular = popularEvents.length > 0;

  if (displayEvents.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-10 text-center w-full text-very-dark-blue">{isPopular ? 'Popular Now' : 'All Events'}</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-4 w-max">
          {displayEvents.map(event => (
            <EventCard
              key={event.EventID || event.id}
              event={event}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularEvents;
