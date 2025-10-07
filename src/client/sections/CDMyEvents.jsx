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
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-6">My Events</h2>

      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.EventID}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {/* Event Image */}
              <div className="h-40 w-full">
                <img
                  src={
                    ev.Image?.startsWith("http")
                      ? ev.Image
                      : `http://localhost:5000${ev.Image}`
                  }
                  alt={ev.Title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                {editingId === ev.EventID ? (
                  <div className="space-y-2">
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <input
                      type="datetime-local"
                      value={editData.startDateTime}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          startDateTime: e.target.value,
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
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
                      className="w-full border px-2 py-1 rounded"
                    />
                    <input
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      {new Date(ev.StartDateTime).toLocaleString()} -{" "}
                      {new Date(ev.EndDateTime).toLocaleString()}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {ev.Title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {ev.Description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">📍 Location:</span>{" "}
                        {ev.Location}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => startEdit(ev)}
                        className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(ev.EventID)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* RSVP List */}
              <div className="p-4 bg-sky-50 border-t">
                <h4 className="font-bold mb-2 text-sm">
                  Users who RSVP’d:
                </h4>
                <div className="max-h-32 overflow-y-auto">
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
