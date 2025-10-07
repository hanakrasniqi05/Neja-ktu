import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RsvpList({ eventId }) {
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rsvp/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRsvps(res.data);
      } catch (err) {
        console.error("Error fetching RSVPs:", err);
      }
    };
    fetchRsvps();
  }, [eventId]);

  return (
    <div className="max-h-64 overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-semibold">
            <th>#</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.length > 0 ? (
            rsvps.map((r, i) => (
              <tr key={r.UserID || i}>
                <td>{i + 1}</td>
                <td>{r.Name}</td>
                <td>{r.Surname}</td>
                <td>{r.Status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-2">
                No RSVPs yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
