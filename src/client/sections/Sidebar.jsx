import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logopin.png"; 
import { 
  Building2, Users, CalendarDays, BarChart3, 
  CheckCircle2, XCircle, Clock, X
} from "lucide-react";

  export default function Sidebar({ currentPage, setCurrentPage, onMobileClose }) {
   const menu = [
    {
      title: "Dashboard",
      items: [
        { label: "Stats / Overview", page: "dashboard", icon: <BarChart3 size={18} /> },
      ],
    },
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
    
  ];

  const handleItemClick = (page) => {
    setCurrentPage(page);
    if (onMobileClose) onMobileClose(); // Close sidebar on mobile after selection
  };

  return (
    <div className="w-64 bg-teal-blue text-white h-screen overflow-y-auto p-4 border-r border-blue/30">
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button 
          onClick={onMobileClose}
          className="p-2 hover:bg-blue rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className="flex items-center mb-6 hover:opacity-80 transition-opacity"
      >
        <img src={logo} alt="Company Logo" className="h-10 mr-3 rounded-full" />
        <span className="text-lg font-bold">Back to Home</span>
      </Link>

      <h2 className="text-xl font-bold mb-6 hidden md:block">Admin Dashboard</h2>

      <div className="space-y-6">
        {menu.map((section, i) => (
          <div key={i}>
            <p className="text-sm uppercase text-gray-300 mb-2">{section.title}</p>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li
                  key={j}
                  onClick={() => handleItemClick(item.page)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    currentPage === item.page 
                      ? "bg-blue text-white shadow-md" 
                      : "hover:bg-blue/50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Current Page Display for Mobile */}
      <div className="mt-8 pt-6 border-t border-blue/30 md:hidden">
        <p className="text-sm text-gray-300 mb-2">Current Page:</p>
        <p className="font-semibold text-lg">
          {currentPage.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </div>
    </div>
  );
}