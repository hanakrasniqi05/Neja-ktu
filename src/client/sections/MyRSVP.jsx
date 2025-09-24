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
    <div className="w-full md:w-2/3 lg:w-1/2 p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200">
      <h2 className="text-2xl font-semibold mb-3">My RSVPs</h2>
      <p className="text-sm md:text-base text-gray-700 mb-6">
        NOTE: Always go to events with a valid ID so companies can verify your identity.
      </p>

      {rsvps.length === 0 ? (
        <p>You haven’t RSVP’d to any events yet.</p>
      ) : (
        <ul className="space-y-6">
          {rsvps.map((rsvp) => {
            const startDate = new Date(rsvp.StartDateTime);
            const endDate = rsvp.EndDateTime ? new Date(rsvp.EndDateTime) : null;

            const dateString = endDate && startDate.toDateString() !== endDate.toDateString()
              ? `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`
              : startDate.toLocaleDateString();

            const timeString = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <li
                key={rsvp.RsvpID}
                className="flex flex-col md:flex-row bg-light-blue rounded-2xl shadow-md overflow-hidden"
              >
                <div className="flex-1 p-6 flex flex-col justify-between md:border-r-2 md:border-dashed md:border-gray-300">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white break-words">
                      {rsvp.Title}
                    </h3>
                    <div className="flex flex-wrap justify-between text-sm text-white mb-2">
                      <span>{dateString}</span>
                      {timeString && <span>{timeString}</span>}
                    </div>
                    <p className="text-white mb-3 break-words">
                      {rsvp.Description?.length > 120
                        ? rsvp.Description.slice(0, 120) + "..."
                        : rsvp.Description}
                    </p>
                  </div>
                  <a
                    href={`/events/${rsvp.EventID}`}
                    className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium w-full md:w-1/3 py-2 px-4 rounded-lg text-center mt-4 md:mt-0"
                  >
                    Go to Event Page
                  </a>
                </div>

                <div className="w-full md:w-44 bg-gray-100 p-6 flex flex-col justify-center text-center">
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