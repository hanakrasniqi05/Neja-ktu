import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logov1.png";

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState("myEvents");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company/events", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/company/events",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEvents([res.data, ...events]);
      setActivePage("myEvents");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/company/events/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEvents(events.map(ev => ev.EventID === id ? res.data : ev));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/company/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(events.filter(e => e.EventID !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen font-sans">
      <aside className="w-1/4 bg-sky-200 p-6 flex flex-col">
        <a href="/" className="flex items-center mb-6 hover:opacity-80">
          <img src={logo} alt="Company Logo" className="h-10 mr-3 rounded-full" />
          <span className="text-lg font-bold">Back to Home</span>
        </a>
        <h1 className="text-xl font-bold text-sky-900 mb-8">Company Dashboard</h1>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActivePage("myEvents")}
            className={`px-3 py-2 rounded ${
              activePage === "myEvents"
                ? "bg-white text-sky-800 font-semibold shadow"
                : "hover:bg-sky-300"
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setActivePage("createEvent")}
            className={`px-3 py-2 rounded ${
              activePage === "createEvent"
                ? "bg-white text-sky-800 font-semibold shadow"
                : "hover:bg-sky-300"
            }`}
          >
            Create New Event
          </button>
          <button
            onClick={() => setActivePage("settings")}
            className={`px-3 py-2 rounded ${
              activePage === "settings"
                ? "bg-white text-sky-800 font-semibold shadow"
                : "hover:bg-sky-300"
            }`}
          >
            Account Setting
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-10 bg-white">
        {activePage === "myEvents" && (
          <MyEvents events={events} onDelete={handleDelete} onUpdate={handleUpdate} />
        )}
        {activePage === "createEvent" && <CreateEvent onCreate={handleCreate} />}
        {activePage === "settings" && <AccountSettings />}
      </main>
    </div>
  );
}

// MyEvents
function MyEvents({ events, onDelete, onUpdate }) {
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
    if (editData.image instanceof File) formData.append("image", editData.image);
    onUpdate(editingId, formData);
    setEditingId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Events</h2>
      {events.map((ev) => (
        <div
          key={ev.EventID}
          className="flex border rounded-lg bg-gray-50 shadow-sm mb-6"
        >
          {/* Left side: Event details */}
          <div className="p-4 w-2/3">
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
                    setEditData({ ...editData, startDateTime: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
                <input
                  type="datetime-local"
                  value={editData.endDateTime}
                  onChange={(e) =>
                    setEditData({ ...editData, endDateTime: e.target.value })
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
                    setEditData({ ...editData, description: e.target.value })
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
                <h3 className="text-lg font-semibold">{ev.Title}</h3>
                {ev.Image && (
                  <img
                    src={
                      ev.Image.startsWith("http")
                        ? ev.Image
                        : `http://localhost:5000${ev.Image}`
                    }
                    alt={ev.Title}
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
                <p className="text-gray-600 mt-2">{ev.Description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(ev.StartDateTime).toLocaleString()} -{" "}
                  {new Date(ev.EndDateTime).toLocaleString()}
                </p>
                <p className="mt-2">
                  Location: <span className="font-semibold">{ev.Location}</span>
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => startEdit(ev)}
                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(ev.EventID)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right side: RSVP list */}
          <div className="p-4 w-1/3 bg-sky-200 rounded-r-lg overflow-y-auto">
            <h4 className="font-bold mb-2">Users who have RSVP:</h4>
            <RsvpList eventId={ev.EventID} />
          </div>
        </div>
      ))}
    </div>
  );
}

// RSVP List
function RsvpList({ eventId }) {
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

// CreateEvent 
function CreateEvent({ onCreate }) {
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
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Networking">Networking</option>
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

// AccountSettings 
function AccountSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Account Settings</h2>
      <p className="text-gray-600">Manage your account details here.</p>
    </div>
  );
}
