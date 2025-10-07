import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logov1.png";

import MyEvents from "../sections/CDMyEvents";
import CreateEvent from "../sections/CDCreateEvent";
import AccountSettings from "../sections/CDAccountSettings";


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
