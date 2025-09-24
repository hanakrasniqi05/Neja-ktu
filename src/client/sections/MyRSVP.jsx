import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyRSVP() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const res = await axios.get("/api/rsvp/mine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setRsvps(res.data || []);
      } catch (err) {
        setError("Could not load your RSVPs.");
      } finally {
        setLoading(false);
      }
    };
    fetchRSVPs();
  }, []);

  if (loading) return <p className="p-4">Loading your RSVPs...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 border-l border-gray-200 w-full md:w-1/2">
      <h2 className="text-2xl font-semibold mb-4">My RSVPs</h2>
      <h2 className="text-l font-normal mb-6">
        NOTE: Always go to events with a valid ID, that way the companies will be able to verify your identity
      </h2>

      {rsvps.length === 0 ? (
        <p>You haven’t RSVP’d to any events yet.</p>
      ) : (
        <ul className="space-y-6">
          {rsvps.map((rsvp) => {
            const startDate = new Date(rsvp.StartDateTime);
            const endDate = rsvp.EndDateTime ? new Date(rsvp.EndDateTime) : null;

            const dateString = endDate && startDate.toDateString() !== endDate.toDateString()
              ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : startDate.toLocaleDateString();

            const timeString = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <li
                key={rsvp.RsvpID}
                className="flex shadow-md rounded-2xl overflow-hidden bg-light-blue min-h-[200px]"
              >
                <div className="flex-1 p-6 border-r-2 border-dashed border-gray-300 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{rsvp.Title}</h3>
                    <div className="flex justify-between text-sm text-white mb-2">
                      <span>{dateString}</span>
                      {timeString && <span>{timeString}</span>}
                    </div>
                    <p className="text-white mb-3">
                      {rsvp.Description?.length > 120
                        ? rsvp.Description.slice(0, 120) + "..."
                        : rsvp.Description}
                    </p>
                  </div>
                  <a
                    href={`/events/${rsvp.EventID}`}
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium w-1/4 py-2 px-4 rounded-lg"
                  >
                    Go to Event Page
                  </a>
                </div>

                <div className="w-44 bg-gray-100 p-6 flex flex-col justify-center text-center">
                  <span className="font-semibold text-gray-800">{rsvp.Status}</span>
                  <span className="text-xs text-gray-500 mt-2">
                    RSVP’d on {new Date(rsvp.CreatedAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}