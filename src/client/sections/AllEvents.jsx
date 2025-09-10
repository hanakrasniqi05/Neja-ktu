import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AllEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` }
});
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">All Events</h2>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-3 text-left font-semibold">Image</th>
            <th className="py-2 px-3 text-left font-semibold">Title</th>
            <th className="py-2 px-3 text-left font-semibold">Location</th>
            <th className="py-2 px-3 text-left font-semibold">Start Date</th>
            <th className="py-2 px-3 text-left font-semibold">End Date</th>
            <th className="py-2 px-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.EventID} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">
                <img
                  src={event.Image || "https://via.placeholder.com/48"}
                  alt={event.Title}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="py-2 px-3 font-medium">{event.Title}</td>
              <td className="py-2 px-3">{event.Location}</td>
              <td className="py-2 px-3">
                {new Date(event.StartDateTime).toLocaleString()}
              </td>
              <td className="py-2 px-3">
                {new Date(event.EndDateTime).toLocaleString()}
              </td>
              <td className="py-2 px-3 flex gap-2">
                <button className="bg-teal-blue text-white px-3 py-1 rounded hover:opacity-90">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
