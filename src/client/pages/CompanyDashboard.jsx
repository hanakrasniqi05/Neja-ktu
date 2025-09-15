import React, { useState } from "react";
import logo from "../assets/logov1.png";

export default function CompanyDashboard() {
  const [activePage, setActivePage] = useState("myEvents");

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-1/4 bg-sky-200 p-6 flex flex-col">
        {/* Back to Home */}
       <a
  href="/"
  className="flex items-center mb-6 hover:opacity-80 transition-opacity"
>
  <img src={logo} alt="Company Logo" className="h-10 mr-3 rounded-full" />
  <span className="text-lg font-bold">Back to Home</span>
</a>


        <h1 className="text-xl font-bold text-sky-900 mb-8">Company Dashboard</h1>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActivePage("myEvents")}
            className={`text-left px-3 py-2 rounded ${
              activePage === "myEvents"
                ? "bg-white text-sky-800 font-semibold shadow"
                : "hover:bg-sky-300"
            }`}
          >
            My Events
          </button>

          <button
            onClick={() => setActivePage("createEvent")}
            className={`text-left px-3 py-2 rounded ${
              activePage === "createEvent"
                ? "bg-white text-sky-800 font-semibold shadow"
                : "hover:bg-sky-300"
            }`}
          >
            Create New Event
          </button>

          <button
            onClick={() => setActivePage("settings")}
            className={`text-left px-3 py-2 rounded ${
              activePage === "settings"
                ? "bg-white text-sky-800 font-semibold shadow"
                : "hover:bg-sky-300"
            }`}
          >
            Account Setting
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 bg-white">
        {activePage === "myEvents" && <MyEvents />}
        {activePage === "createEvent" && <CreateEvent />}
        {activePage === "settings" && <AccountSettings />}
      </main>
    </div>
  );
}

// My Events Page
function MyEvents() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Events: (Filtered By Date)</h2>
      <div className="border rounded-lg w-72 h-40 bg-gray-50 shadow-sm"></div>
      <p className="mt-3">
        RSVP Count: <span className="font-semibold">20</span>
      </p>
      <div className="flex gap-4 mt-4">
        <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
          Edit
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  );
}

// Create Event Page
function CreateEvent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Create New Event</h2>
      <form className="bg-gray-50 shadow p-6 rounded-lg w-[420px] space-y-4">
        <div>
          <label className="block font-medium mb-1">Add Title</label>
          <input
            type="text"
            placeholder="Event title"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Add Date/Time</label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Add Description</label>
          <textarea
            rows="3"
            placeholder="Write description here..."
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

// Account Settings Page
function AccountSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Account Settings</h2>
      <p className="text-gray-600">Here you can manage your account details.</p>
    </div>
  );
}
