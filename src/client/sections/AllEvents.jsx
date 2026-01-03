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
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-6">All Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.EventID}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {/* Event Image */}
              <div className="h-40 w-full">
                <img
                  src={event.Image || "https://via.placeholder.com/300x160"}
                  alt={event.Title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {new Date(event.StartDateTime).toLocaleString()} -{" "}
                  {new Date(event.EndDateTime).toLocaleString()}
                </p>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {event.Title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {event.Description}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">📍 Location:</span>{" "}
                    {event.Location}
                  </p>
                  <p>
                    <span className="font-medium">🏢 Company:</span>{" "}
                    {event.CompanyName}
                  </p>
                  <p>
                    <span className="font-medium">👥 RSVPs:</span>{" "}
                    {event.RSVPCount || 0}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/events/${event.EventID}`)}
                    className="bg-teal-blue text-white px-3 py-1 rounded hover:bg-blue"
                  >
                    Go to Event
                  </button>
                  <button
                    onClick={() => handleDelete(event.EventID)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
