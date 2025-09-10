import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logopin.png"; 
import { 
  Building2, Users, CalendarDays, AlertCircle, BarChart3, 
  CheckCircle2, XCircle, Clock 
} from "lucide-react";

export default function Sidebar({ currentPage, setCurrentPage }) {
 const menu = [
  {
    title: "Company Management",
    items: [
      { label: "Pending Requests", page: "pending", icon: <Clock size={18} /> },
      { label: "All Companies", page: "all", icon: <Building2 size={18} /> },
      { label: "Accepted Companies", page: "accepted", icon: <CheckCircle2 size={18} /> },
      { label: "Denied Companies", page: "denied", icon: <XCircle size={18} /> },
    ],
  },
  {
    title: "Event Management",
    items: [
      { label: "All Events", page: "all-events", icon: <CalendarDays size={18} /> },
    ],
  },
  {
    title: "User Management",
    items: [
      { label: "All Users", page: "all-users", icon: <Users size={18} /> },
      { label: "RSVPs", page: "rsvps", icon: <Users size={18} /> },
    ],
  },
  {
    title: "Dashboard",
    items: [
      { label: "Stats / Overview", page: "dashboard", icon: <BarChart3 size={18} /> },
    ],
  },
];


  return (
    <div className="w-70 bg-teal-blue text-white min-h-screen p-4">
      {/* Back to Home */}
      <Link
        to="/"
        className="flex items-center mb-6 hover:opacity-80 transition-opacity"
      >
        <img src={logo} alt="Company Logo" className="h-10 mr-3 rounded-full" />
        <span className="text-lg font-bold">Back to Home</span>
      </Link>

      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>

      <div className="space-y-6">
        {menu.map((section, i) => (
          <div key={i}>
            <p className="text-sm uppercase text-gray-300 mb-2">{section.title}</p>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li
                  key={j}
                  onClick={() => setCurrentPage(item.page)}
                  className={`flex items-center px-4 py-2 hover:opacity-80 transition-opacity ${
                    currentPage === item.page ? "bg-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
