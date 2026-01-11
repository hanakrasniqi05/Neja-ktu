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
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-xl font-bold mb-4 md:mb-6">RSVPs</h2>
      
      {rsvps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <p className="text-gray-500 text-lg">No RSVPs found.</p>
          <p className="text-gray-400 text-sm mt-2">Users haven't RSVP'd to any events yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">User</th>
                <th className="py-3 px-4 text-left font-semibold">Event</th>
                <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Status</th>
                <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Date</th>
                <th className="py-3 px-4 text-left font-semibold md:hidden">Info</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.RSVP_ID} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{rsvp.UserName}</div>
                    <div className="text-sm text-gray-500 md:hidden">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rsvp.Status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        rsvp.Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rsvp.Status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{rsvp.EventTitle}</div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {new Date(rsvp.CreatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rsvp.Status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      rsvp.Status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rsvp.Status}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {new Date(rsvp.CreatedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 md:hidden">
                    <button 
                      className="text-blue hover:text-blue-700 text-sm font-medium"
                      onClick={() => {
                        // Show more details in a modal or expand row
                        alert(`User: ${rsvp.UserName}\nEvent: ${rsvp.EventTitle}\nStatus: ${rsvp.Status}\nDate: ${new Date(rsvp.CreatedAt).toLocaleString()}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Mobile Stats */}
      <div className="md:hidden mt-4 text-sm text-gray-600">
        <p>{rsvps.length} total RSVPs</p>
      </div>
    </div>
  );
}