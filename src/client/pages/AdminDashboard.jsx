import React, { useState } from "react";
import Sidebar from "../sections/Sidebar";
import PendingRequests from "../sections/PendingRequests";
import AllCompanies from "../sections/AllCompanies";
import AcceptedCompanies from "../sections/AcceptedCompanies";
import DeniedCompanies from "../sections/DeniedCompanies";
import AllEvents from "../sections/AllEvents";
import AllUsers from "../sections/AllUsers";
import RSVPs from "../sections/RSVPs";
import AdminStatistics from "../sections/DashboardStats";
import { Menu } from "lucide-react";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("pending");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Render content based on current page
  const renderPage = () => {
    switch (currentPage) {
       case "dashboard":
        return <AdminStatistics />;
      case "pending":
        return <PendingRequests />;
      case "all":
        return <AllCompanies />;
      case "accepted":
        return <AcceptedCompanies />;
      case "denied":
        return <DeniedCompanies />;
      case "all-events":
        return <AllEvents />;
      case "all-users":
        return <AllUsers />;
      case "rsvps":
        return <RSVPs />;
     
      default:
        return <AdminStatistics />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="md:hidden bg-teal-blue text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-3 p-2 hover:bg-blue rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>
        <div className="text-sm font-medium">
          {currentPage.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
        </div>
      </div>

      {/* Sidebar - Fixed on both mobile and desktop */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed top-0 left-0 z-40 h-screen
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onMobileClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen w-full bg-gray-100 pt-16 md:pt-0">
        {renderPage()}
      </div>
    </div>
  );
}