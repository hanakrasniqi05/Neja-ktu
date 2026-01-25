import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RsvpList({ eventId }) {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        console.log(`📱 Frontend: Fetching RSVPs for event ${eventId}`);
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("token");
        console.log("Token exists:", !!token);
        
        // Make API call
        const response = await axios.get(`http://localhost:5000/api/rsvps/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
        
        // Check response structure
        if (response.data.success) {
          console.log(`Received ${response.data.data.length} RSVPs`);
          setRsvps(response.data.data || []);
        } else {
          console.log("API returned success: false");
          setRsvps([]);
          setError(response.data.message || "Failed to load RSVPs");
        }
      } catch (err) {
        console.error("Error fetching RSVPs:", err);
        
        if (err.response?.status === 404) {
          setError("API endpoint not found. Check server routes.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load RSVPs. Check console for details.");
        }
        setRsvps([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      console.log(`Component mounted for event: ${eventId}`);
      fetchRsvps();
    } else {
      setError("No event ID provided");
      setLoading(false);
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Loading attendees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700 text-sm font-medium">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto">
      {/* Header with count */}
      <div className="sticky top-0 bg-white border-b px-4 py-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">
            Attendees ({rsvps.length})
          </span>
          <span className="text-xs text-gray-500">
            {rsvps.length} {rsvps.length === 1 ? 'person' : 'people'} registered
          </span>
        </div>
      </div>

      {/* RSVP List */}
      <div className="divide-y divide-gray-100">
        {rsvps.length > 0 ? (
          rsvps.map((r, i) => (
            <div 
              key={r.rsvp_id || i} 
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-700 font-medium text-sm">
                      {r.user_name?.charAt(0) || r.FirstName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {r.user_name || `${r.FirstName || ''} ${r.LastName || ''}`.trim() || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {r.user_email || r.Email || "No email"}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  r.status === 'attending' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : r.status === 'interested'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {r.status || 'unknown'}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                RSVP'd on {new Date(r.rsvp_date).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">👥</div>
            <p className="text-gray-500 text-sm">No RSVPs for this event yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Share your event to get attendees!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}