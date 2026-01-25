import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logov1.png";

import MyEvents from "../sections/CDMyEvents";
import CreateEvent from "../sections/CDCreateEvent";
import AccountSettings from "../sections/CDAccountSettings";

import { companyEventAPI } from "../../services/api";
import { Menu } from "lucide-react";

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState("myEvents");
  const [events, setEvents] = useState([]);
  
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  //Fetch all events of the logged-in company
  const fetchEvents = async () => {
    try {
      setError("");
      const res = await companyEventAPI.getMyEvents();
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } 
  };

  //Handle event creation
  const handleCreate = async (formData) => {
    try {
      const res = await companyEventAPI.createEvent(formData);
      if (res.data.success) {
        await fetchEvents();
        setActivePage("myEvents");
        alert("Event created successfully!");
      } else {
        throw new Error(res.data.message || "Failed to create event");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to create event");
    }
  };

  // Handle event update
  const handleUpdate = async (id, formData) => {
    try {
      const res = await companyEventAPI.updateEvent(id, formData);
      setEvents(events.map(ev => ev.EventID === id ? { ...ev, ...res.data.event } : ev));
      alert("Event updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update event");
    }
  };

  // Handle event deletion
const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await companyEventAPI.deleteEvent(id);
      setEvents(events.filter(e => e.EventID !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "myEvents":
        return <MyEvents events={events} onDelete={handleDelete} onUpdate={handleUpdate} />;
      case "createEvent":
        return <CreateEvent onCreate={handleCreate} />;
      case "settings":
        return <AccountSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-teal-blue text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-3 p-2 hover:bg-blue/30 rounded-lg">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold">Company Dashboard</h1>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed top-0 left-0 z-40 h-screen w-64
        transition-transform duration-300 ease-in-out
        bg-teal-blue text-white p-6 flex flex-col
      `}>
        <a href="/" className="flex items-center mb-6 hover:opacity-80">
          <img src={logo} alt="Company Logo" className="h-10 mr-3 rounded-full" />
          <span className="text-lg font-bold">Back to Home</span>
        </a>

        <h1 className="text-xl font-bold mb-8">Company Dashboard</h1>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => { setActivePage("myEvents"); setIsSidebarOpen(false); }}
            className={`px-3 py-2 rounded-lg transition ${
              activePage === "myEvents"
                ? "bg-white text-teal-blue font-semibold shadow"
                : "hover:bg-blue/30"
            }`}
          >
            My Events
          </button>

          <button
            onClick={() => { setActivePage("createEvent"); setIsSidebarOpen(false); }}
            className={`px-3 py-2 rounded-lg transition ${
              activePage === "createEvent"
                ? "bg-white text-teal-blue font-semibold shadow"
                : "hover:bg-blue/30"
            }`}
          >
            Create New Event
          </button>

          <button
            onClick={() => { setActivePage("settings"); setIsSidebarOpen(false); }}
            className={`px-3 py-2 rounded-lg transition ${
              activePage === "settings"
                ? "bg-white text-teal-blue font-semibold shadow"
                : "hover:bg-blue/30"
            }`}
          >
            Account Settings
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen w-full bg-gray-100 pt-16 md:pt-0 p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={fetchEvents} className="ml-4 bg-red-500 text-white px-3 py-1 rounded">
              Retry
            </button>
          </div>
        )}

        {renderPage()}
      </div>
    </div>
  );
}
