import React, { useState, useEffect } from "react";

export default function EditEvent({ event, onUpdate, onCancel }) {
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

  // Fill the form with the event data
  useEffect(() => {
    if (event) {
      // Convert date from MySQL format to datetime-local format
      const formatForInput = (mysqlDate) => {
        if (!mysqlDate) return "";
        return mysqlDate.replace(" ", "T").substring(0, 16);
      };

      setForm({
        title: event.Title || "",
        description: event.Description || "",
        location: event.Location || "",
        startDateTime: formatForInput(event.StartDateTime),
        endDateTime: formatForInput(event.EndDateTime),
        rsvpLimit: event.RsvpLimit || "",
        category: event.Category || "",
      });

      // Set preview if event has image
      if (event.Image && event.Image !== "null") {
        setPreview(event.Image.startsWith("http") ? event.Image : 
          `${window.location.origin}${event.Image}`);
      }
    }
  }, [event]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      // Reset to original image if no new file
      if (event.Image && event.Image !== "null") {
        setPreview(event.Image.startsWith("http") ? event.Image : 
          `${window.location.origin}${event.Image}`);
      } else {
        setPreview(null);
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!form.title || !form.startDateTime || !form.endDateTime) {
        throw new Error("Title, start date, and end date are required.");
      }

      const start = new Date(form.startDateTime);
      const end = new Date(form.endDateTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format.");
      }
      if (end <= start) {
        throw new Error("End date must be after start date.");
      }
      if (form.rsvpLimit && Number(form.rsvpLimit) <= 0) {
        throw new Error("RSVP limit must be greater than 0.");
      }

      // Format date for MySQL
      const formatDateTime = (datetimeLocal) => {
        if (!datetimeLocal) return null;
        return datetimeLocal.replace('T', ' ') + ':00';
      };

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("startDateTime", formatDateTime(form.startDateTime));
      formData.append("endDateTime", formatDateTime(form.endDateTime));
      formData.append("category", form.category || "");
      
      if (form.rsvpLimit) {
        formData.append("rsvpLimit", form.rsvpLimit);
      }
      
      // Add image ONLY if there is a new file
      if (imageFile) {
        formData.append("image", imageFile);
        console.log('Will update with new image:', imageFile.name);
      } else {
        console.log('No new image - keeping existing image');
      }

      console.log('Updating event with FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(key + ":", key === 'image' ? value.name : value);
      }
      
      await onUpdate(event.EventID, formData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-sky-800">Edit Event</h2>
      
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

        // Add image input
        <div>
          <label className="block text-sm font-medium mb-1">Event Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            {imageFile ? `New image selected: ${imageFile.name}` : "Leave empty to keep current image"}
          </p>
          
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-xs h-48 object-cover rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
}