import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RSVPs() {
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/rsvps", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRsvps(res.data);
      } catch (error) {
        console.error("Error fetching RSVPs:", error);
      }
    };

    fetchRsvps();
  }, []);

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">RSVPs</h2>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-3 text-left font-semibold">User</th>
            <th className="py-2 px-3 text-left font-semibold">Event</th>
            <th className="py-2 px-3 text-left font-semibold">Status</th>
            <th className="py-2 px-3 text-left font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((rsvp) => (
            <tr key={rsvp.RSVP_ID} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">{rsvp.UserName}</td>
              <td className="py-2 px-3">{rsvp.EventTitle}</td>
              <td className="py-2 px-3 capitalize">{rsvp.Status}</td>
              <td className="py-2 px-3">
                {new Date(rsvp.CreatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
