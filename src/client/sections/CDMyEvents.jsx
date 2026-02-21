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
    rsvpLimit: "",
    category: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const startEdit = (ev) => {
    setEditingId(ev.EventID);
    
    // Convert date to proper format for datetime-local input
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      // Return date in format: YYYY-MM-DDTHH:MM
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Find the event category
    let eventCategory = "";
    if (ev.Category) {
      eventCategory = ev.Category;
    } else if (ev.category) {
      eventCategory = ev.category;
    }

    setEditData({
      title: ev.Title,
      description: ev.Description || "",
      location: ev.Location || "",
      startDateTime: formatDateForInput(ev.StartDateTime),
      endDateTime: formatDateForInput(ev.EndDateTime),
      rsvpLimit: ev.RsvpLimit || "",
      category: eventCategory
    });
    
    // Save the existing image URL
    setCurrentImage(ev.Image);
    setImageFile(null); 
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("description", editData.description);
    formData.append("location", editData.location);
    
    // Add seconds to date for MySQL format
    const startDateTime = `${editData.startDateTime.replace("T", " ")}:00`;
    const endDateTime = `${editData.endDateTime.replace("T", " ")}:00`;
    
    formData.append("startDateTime", startDateTime);
    formData.append("endDateTime", endDateTime);
    
    // Send category even if it's empty
    formData.append("category", editData.category || "");
    
    // Add RsvpLimit if it has a value
    if (editData.rsvpLimit) {
      formData.append("rsvpLimit", editData.rsvpLimit);
    }
    
    // Only send image if a new file is selected - otherwise keep existing one
    if (imageFile) {
      formData.append("image", imageFile);
      console.log('Will send new image:', imageFile.name);
    } else {
      console.log('No new image - keeping existing image');
    }
    
    // Debug: show what is being sent
    console.log("Sending update with:");
    for (let [key, value] of formData.entries()) {
      console.log(key + ":", key === 'image' ? value.name : value);
    }
    onUpdate(editingId, formData);
    setEditingId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an image
      if (!file.type.match('image.*')) {
        alert('Ju lutem zgjidhni një skedar imazhi (jpg, png, gif, etc.)');
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-event.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return imagePath;
  };

  const cancelEdit = () => {
    setEditingId(null);
    setImageFile(null);
    setCurrentImage(null);
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
                  src={getImageUrl(ev.Image)}
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
                      required
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
                        required
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
                        required
                      />
                    </div>
                    <input
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="Location"
                      required
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
                      required
                    />
                    
                    {/* Input for RsvpLimit */}
                    <input
                      type="number"
                      value={editData.rsvpLimit}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          rsvpLimit: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      placeholder="RSVP Limit (optional)"
                      min="1"
                    />
                    
                    {/* Input for category */}
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">Select Category (optional)</option>
                      <option value="Art">Art</option>
                      <option value="Business">Business</option>
                      <option value="Culture">Culture</option>
                      <option value="Education">Education</option>
                      <option value="Food">Food</option>
                      <option value="Health">Health</option>
                      <option value="Music">Music</option>
                      <option value="Sports">Sports</option>
                      <option value="Tech">Tech</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    {/* Input for image */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Update Event Image (Optional)
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {imageFile ? 
                              `New image selected: ${imageFile.name}` : 
                              "Leave empty to keep current image"
                            }
                          </p>
                        </div>
                        {currentImage && currentImage !== "null" && (
                          <div className="w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getImageUrl(currentImage)}
                              alt="Current"
                              className="w-full h-full object-cover"
                            />
                            <div className="text-[10px] text-center text-gray-500 truncate p-1">
                              Current
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
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
                      {ev.RsvpLimit && (
                        <p>
                          <span className="font-medium">👥 RSVP Limit:</span>{" "}
                          {ev.RsvpLimit}
                        </p>
                      )}
                      {ev.Category && (
                        <p>
                          <span className="font-medium">🏷️ Category:</span>{" "}
                          {ev.Category}
                        </p>
                      )}
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