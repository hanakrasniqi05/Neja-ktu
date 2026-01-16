import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logov1.png";

import MyEvents from "../sections/CDMyEvents";
import CreateEvent from "../sections/CDCreateEvent";
import AccountSettings from "../sections/CDAccountSettings";

import { companyEventAPI } from "../../services/api";

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState("myEvents");
  const [events, setEvents] = useState([]);
  
  const [error, setError] = useState("");

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
    console.log('Creating event with data:', formData);
    
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    const res = await companyEventAPI.createEvent(formData);
    console.log('API Response:', res.data);
    
    if (res.data.success) {
      // Refresh the events list
      await fetchEvents();
      
      setActivePage("myEvents");
      alert("Event created successfully!");
    } else {
      throw new Error(res.data.message || 'Failed to create event');
    }
  } catch (err) {
    console.error('Error creating event:', err);
    console.error('Full error:', err.response?.data || err.message);
    
    let errorMessage = 'Failed to create event';
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    alert(`Error: ${errorMessage}`);
  }
};

  // Handle event update
  const handleUpdate = async (id, formData) => {
    try {
      const res = await companyEventAPI.updateEvent(id, formData);
      setEvents(events.map(ev => ev.EventID === id ? res.data : ev));
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    }
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await companyEventAPI.deleteEvent(id);
      setEvents(events.filter(e => e.EventID !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
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
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={fetchEvents}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {activePage === "myEvents" && (
          <MyEvents 
            events={events} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate} 
          />
        )}
        {activePage === "createEvent" && <CreateEvent onCreate={handleCreate} />}
        {activePage === "settings" && <AccountSettings />}
      </main>
    </div>
  );
}
