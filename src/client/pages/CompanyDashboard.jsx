import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logov1.png";

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState("myEvents");
  const [events, setEvents] = useState([]);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company/events", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(res.data);
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/company/events/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEvents(events.map(ev => ev.EventID === id ? res.data : ev));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/company/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(events.filter(e => e.EventID !== id));
    } catch (err) { console.error(err); }
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
          <button onClick={() => setActivePage("myEvents")} className={`px-3 py-2 rounded ${activePage==="myEvents"?"bg-white text-sky-800 font-semibold shadow":"hover:bg-sky-300"}`}>My Events</button>
          <button onClick={() => setActivePage("createEvent")} className={`px-3 py-2 rounded ${activePage==="createEvent"?"bg-white text-sky-800 font-semibold shadow":"hover:bg-sky-300"}`}>Create New Event</button>
          <button onClick={() => setActivePage("settings")} className={`px-3 py-2 rounded ${activePage==="settings"?"bg-white text-sky-800 font-semibold shadow":"hover:bg-sky-300"}`}>Account Setting</button>
        </nav>
      </aside>
      <main className="flex-1 p-10 bg-white">
        {activePage==="myEvents" && <MyEvents events={events} onDelete={handleDelete} onUpdate={handleUpdate} />}
        {activePage==="createEvent" && <CreateEvent onCreate={handleCreate} />}
        {activePage==="settings" && <AccountSettings />}
      </main>
    </div>
  );
}

// MyEvents 
function MyEvents({ events, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title:"", description:"", location:"", startDateTime:"", endDateTime:"", image:null });

  const startEdit = (ev) => {
    setEditingId(ev.EventID);
    setEditData({
      title: ev.Title,
      description: ev.Description || "",
      location: ev.Location || "",
      startDateTime: ev.StartDateTime.slice(0,16),
      endDateTime: ev.EndDateTime.slice(0,16),
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
      {events.map(ev => (
        <div key={ev.EventID} className="border rounded-lg bg-gray-50 shadow-sm p-4 mb-4 w-[420px]">
          {editingId===ev.EventID ? (
            <div className="space-y-2">
              <input value={editData.title} onChange={e=>setEditData({...editData,title:e.target.value})} className="w-full border px-2 py-1 rounded" />
              <input type="datetime-local" value={editData.startDateTime} onChange={e=>setEditData({...editData,startDateTime:e.target.value})} className="w-full border px-2 py-1 rounded" />
              <input type="datetime-local" value={editData.endDateTime} onChange={e=>setEditData({...editData,endDateTime:e.target.value})} className="w-full border px-2 py-1 rounded" />
              <input value={editData.location} onChange={e=>setEditData({...editData,location:e.target.value})} className="w-full border px-2 py-1 rounded" />
              <textarea value={editData.description} onChange={e=>setEditData({...editData,description:e.target.value})} className="w-full border px-2 py-1 rounded" />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Save</button>
                <button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold">{ev.Title}</h3>
              {ev.Image && <img src={ev.Image.startsWith("http")?ev.Image:`http://localhost:5000${ev.Image}`} alt={ev.Title} className="mt-2 w-full h-48 object-cover rounded" />}
              <p className="text-gray-600">{ev.Description}</p>
              <p className="text-sm text-gray-500">{new Date(ev.StartDateTime).toLocaleString()} - {new Date(ev.EndDateTime).toLocaleString()}</p>
              <p className="mt-2">Location: <span className="font-semibold">{ev.Location}</span></p>
              <div className="flex gap-4 mt-4">
                <button onClick={()=>startEdit(ev)} className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">Edit</button>
                <button onClick={()=>onDelete(ev.EventID)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// CreateEvent 
function CreateEvent({ onCreate }) {
  const [form, setForm] = useState({ title:"", description:"", location:"", startDateTime:"", endDateTime:"" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    if(file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if(!form.title || !form.startDateTime || !form.endDateTime) return;

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("location", form.location);
    data.append("startDateTime", form.startDateTime);
    data.append("endDateTime", form.endDateTime);
    if(imageFile) data.append("image", imageFile);

    onCreate(data);
    setForm({ title:"", description:"", location:"", startDateTime:"", endDateTime:"" });
    setImageFile(null); setPreview(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 shadow p-6 rounded-lg w-[420px] space-y-4">
        <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full border px-3 py-2 rounded" />
        <input type="datetime-local" value={form.startDateTime} onChange={e=>setForm({...form,startDateTime:e.target.value})} className="w-full border px-3 py-2 rounded" />
        <input type="datetime-local" value={form.endDateTime} onChange={e=>setForm({...form,endDateTime:e.target.value})} className="w-full border px-3 py-2 rounded" />
        <input type="text" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Location" className="w-full border px-3 py-2 rounded" />
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" />
        {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded mt-2" />}
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="w-full border px-3 py-2 rounded"></textarea>
        <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700">Upload</button>
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
