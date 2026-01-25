import React, { useState } from "react";
import RsvpList from "./CDRsvpList";

export default function MyEvents({ events, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    image: null,
  });

  const startEdit = (ev) => {
    setEditingId(ev.EventID);
    setEditData({
      title: ev.Title,
      description: ev.Description || "",
      location: ev.Location || "",
      startDateTime: ev.StartDateTime.slice(0, 16),
      endDateTime: ev.EndDateTime.slice(0, 16),
      image: ev.Image || null,
    });
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("description", editData.description);
    formData.append("location", editData.location);
    formData.append("startDateTime", editData.startDateTime);
    formData.append("endDateTime", editData.endDateTime);
    if (editData.image instanceof File) {
      formData.append("image", editData.image);
    }
    onUpdate(editingId, formData);
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">My Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-600 text-center py-8 sm:py-12 text-sm sm:text-base">No events created yet.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {events.map((ev) => (
            <div
              key={ev.EventID}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
            >
              {/* Event Image */}
              <div className="h-40 sm:h-48 w-full">
                <img
                  src={
                    ev.Image?.startsWith("http")
                      ? ev.Image
                      : `http://localhost:5000${ev.Image}`
                  }
                  alt={ev.Title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                {editingId === ev.EventID ? (
                  <div className="space-y-2 sm:space-y-3">
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Event title"
                    />
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="datetime-local"
                        value={editData.startDateTime}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            startDateTime: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                      <input
                        type="datetime-local"
                        value={editData.endDateTime}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            endDateTime: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <input
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Location"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y min-h-[80px]"
                      placeholder="Description"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                      {new Date(ev.StartDateTime).toLocaleString()} -{" "}
                      {new Date(ev.EndDateTime).toLocaleString()}
                    </p>

                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                      {ev.Title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-1">
                      {ev.Description}
                    </p>

                    <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                      <p className="truncate">
                        <span className="font-medium">📍 Location:</span>{" "}
                        {ev.Location}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => startEdit(ev)}
                        className="flex-1 bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition text-xs sm:text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(ev.EventID)}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-xs sm:text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* RSVP List */}
              <div className="p-3 sm:p-4 bg-sky-50 border-t">
                <h4 className="font-bold mb-2 text-xs sm:text-sm text-gray-700">
                  Users who RSVP'd:
                </h4>
                <div className="max-h-24 sm:max-h-32 overflow-y-auto">
                  <RsvpList eventId={ev.EventID} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}