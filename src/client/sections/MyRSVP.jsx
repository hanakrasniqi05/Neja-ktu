import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyRSVP() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const res = await axios.get("/api/rsvps/mine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setRsvps(res.data?.data || []); 
      } catch (err) {
        console.error(err);
        setError("Could not load your RSVPs.");
        setRsvps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRSVPs();
  }, []);

 const handleStatusChange = async (event_id, newStatus) => {
  try {
    await axios.put(
      "/api/rsvps",
      { event_id, status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (newStatus === "not attending") {
      setRsvps(prev => prev.filter(r => r.EventID !== event_id));
    } else {
      setRsvps(prev =>
        prev.map(r =>
          r.EventID === event_id ? { ...r, status: newStatus } : r
        )
      );
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Could not update RSVP");
  }
};

  if (loading) return <p className="p-4">Loading your RSVPs...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const now = new Date();
  const upcoming = rsvps.filter(r => {
    const start = new Date(r.StartDateTime);
    const end = r.EndDateTime ? new Date(r.EndDateTime) : start;
    return end >= now;
  });
  const past = rsvps.filter(r => {
    const end = r.EndDateTime ? new Date(r.EndDateTime) : new Date(r.StartDateTime);
    return end < now;
  });

  const renderCards = (list, isPast = false) =>
    list.length === 0 ? (
      <p className="text-gray-600">
        {isPast ? "No past events." : "No upcoming events."}
      </p>
    ) : (
      <ul className="space-y-6">
        {list.map(rsvp => {
          const startDate = new Date(rsvp.StartDateTime);
          const endDate = rsvp.EndDateTime ? new Date(rsvp.EndDateTime) : null;

          const dateString =
            endDate && startDate.toDateString() !== endDate.toDateString()
              ? `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`
              : startDate.toLocaleDateString();

          const timeString = startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <li
              key={rsvp.rsvp_id}
              className={`flex flex-col md:flex-row rounded-2xl shadow-md overflow-hidden
                ${isPast ? "bg-light-blue/50" : "bg-light-blue"}`}
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
                <select
                  value={rsvp.status}
                  onChange={e => handleStatusChange(rsvp.EventID, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                  disabled={isPast} // prevent changing past RSVPs
                >
                  <option value="attending">Attending</option>
                  <option value="interested">Interested</option>
                  <option value="not attending">Not Attending</option>
                </select>
                <span className="text-xs text-gray-500 mt-2">
                  RSVP’d on {new Date(rsvp.rsvp_date).toLocaleDateString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="w-full md:w-2/3 lg:w-1/2 p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200">
      <h2 className="text-2xl font-semibold mb-3">My RSVPs</h2>
      <p className="text-sm md:text-base text-gray-700 mb-6">
        NOTE: Always go to events with a valid ID so companies can verify your identity.
      </p>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        {renderCards(upcoming, false)}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Past Events</h3>
        {renderCards(past, true)}
      </div>
    </div>
  );
}