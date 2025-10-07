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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.startDateTime || !form.endDateTime) {
      setError("Title, start date, and end date are required.");
      return;
    }

    const now = new Date();
    const start = new Date(form.startDateTime);
    const end = new Date(form.endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Invalid date format.");
      return;
    }
    if (start < now) {
      setError("Start date cannot be in the past.");
      return;
    }
    if (end <= start) {
      setError("End date must be after start date.");
      return;
    }
    if (form.rsvpLimit && Number(form.rsvpLimit) <= 0) {
      setError("RSVP limit must be greater than 0.");
      return;
    }
    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("location", form.location);
    data.append("startDateTime", form.startDateTime);
    data.append("endDateTime", form.endDateTime);
    data.append("rsvpLimit", form.rsvpLimit);
    data.append("category", form.category);
    if (imageFile) data.append("image", imageFile);

    onCreate(data);

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
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Create New Event</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        ></textarea>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <input
          type="datetime-local"
          name="startDateTime"
          value={form.startDateTime}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="datetime-local"
          name="endDateTime"
          value={form.endDateTime}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <input
          type="number"
          name="rsvpLimit"
          placeholder="RSVP Limit"
          value={form.rsvpLimit}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">Select category</option>
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

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-48 h-32 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
