import React, { useState } from "react";

export default function CreateEvent({ onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    rsvpLimit: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic validation
      if (!form.title || !form.startDateTime || !form.endDateTime) {
        throw new Error("Title, start date, and end date are required.");
      }

      const now = new Date();
      const start = new Date(form.startDateTime);
      const end = new Date(form.endDateTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format.");
      }
      if (start < now) {
        throw new Error("Start date cannot be in the past.");
      }
      if (end <= start) {
        throw new Error("End date must be after start date.");
      }
      if (form.rsvpLimit && Number(form.rsvpLimit) <= 0) {
        throw new Error("RSVP limit must be greater than 0.");
      }

      // Date formatting for MySQL
      const formatDateTime = (datetimeLocal) => {
        if (!datetimeLocal) return null;
        return datetimeLocal.replace('T', ' ') + ':00'; 
      };

      // Create the data object
      const eventData = {
        title: form.title,
        description: form.description,
        location: form.location,
        startDateTime: formatDateTime(form.startDateTime),
        endDateTime: formatDateTime(form.endDateTime),
        rsvpLimit: form.rsvpLimit || null,
        category: form.category || null
      };

      console.log('Sending event data:', eventData);

      // Send the data
      await onCreate(eventData);

      // Reset form
      setForm({
        title: "",
        description: "",
        location: "",
        startDateTime: "",
        endDateTime: "",
        rsvpLimit: "",
        category: "",
      });
      setImageFile(null);
      setPreview(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Create New Event</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            placeholder="Describe your event"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input
            type="text"
            name="location"
            placeholder="Where will the event take place?"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={form.startDateTime}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date & Time *</label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={form.endDateTime}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">RSVP Limit (Optional)</label>
          <input
            type="number"
            name="rsvpLimit"
            placeholder="Maximum number of attendees"
            value={form.rsvpLimit}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category (Optional)</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Select a category</option>
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-sky-600 text-white px-4 py-3 rounded font-semibold hover:bg-sky-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}