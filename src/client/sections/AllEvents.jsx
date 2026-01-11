import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` }
});
        const eventsData = res.data;
        const withRsvps = await Promise.all(
          eventsData.map(async (event) => {
            try {
              const rsvpRes = await axios.get(
                `http://localhost:5000/api/rsvp/event/${event.EventID}`
              );
              return { ...event, RSVPCount: rsvpRes.data.data.length };
            } catch (err) {
              console.error("Error fetching RSVPs for event:", event.EventID, err);
              return { ...event, RSVPCount: 0 };
            }
          })
        );

        setEvents(withRsvps);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event.EventID !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  return (
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-xl font-bold mb-4 md:mb-6">All Events</h2>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p className="text-gray-500 text-lg">No events found.</p>
          <p className="text-gray-400 text-sm mt-2">Create events to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {events.map((event) => (
            <div
              key={event.EventID}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow border border-gray-200"
            >
              {/* Event Image */}
              <div className="h-40 w-full relative">
                <img
                  src={event.Image || "https://via.placeholder.com/300x160"}
                  alt={event.Title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {event.RSVPCount || 0} RSVPs
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-2">
                  {new Date(event.StartDateTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                <h3 className="text-lg font-semibold text-gray-700 mb-2 line-clamp-2">
                  {event.Title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {event.Description}
                </p>

                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p className="flex items-start gap-2">
                    <span className="font-medium flex-shrink-0">📍</span>
                    <span className="line-clamp-2">{event.Location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium flex-shrink-0">🏢</span>
                    <span>{event.CompanyName}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => navigate(`/events/${event.EventID}`)}
                    className="flex-1 bg-teal-blue hover:bg-blue text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    View Event
                  </button>
                  <button
                    onClick={() => handleDelete(event.EventID)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
    )} 
      {/* Mobile Stats */}
      <div className="md:hidden mt-4 text-sm text-gray-600">
        <p>Showing {events.length} events</p>
      </div>
    </div>
  );
}