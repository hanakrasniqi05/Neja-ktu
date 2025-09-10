import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logov2.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("userData");
      if (storedData && storedData !== "undefined" && storedData !== "null") {
        setUserData(JSON.parse(storedData));
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserData(null);
    }

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token && token !== "undefined" && token !== "null");
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Determine dashboard URL based on role
  const getDashboardURL = () => {
    if (!userData) return "/";
    switch (userData.role) {
      case "admin":
        return "/admin-dashboard";
      case "company":
        return "/company-dashboard";
      case "user":
        return "/user-dashboard";
      default:
        return "/";
    }
  };

  const getDashboardLabel = () => {
    if (!userData) return "Dashboard";
    switch (userData.role) {
      case "admin":
        return "Admin Dashboard";
      case "company":
        return "Company Dashboard";
      case "user":
        return "User Dashboard";
      default:
        return "Dashboard";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-blue-500 shadow-md">
      <div className="px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 m-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="N'eja ktu logo" className="h-14" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex flex-grow justify-end px-8 space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-dark-blue px-3 py-2 text-lg font-medium"
                  : "text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-large"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive
                  ? "text-dark-blue px-3 py-2 text-lg font-medium"
                  : "text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-large"
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                isActive
                  ? "text-dark-blue px-3 py-2 text-lg font-medium"
                  : "text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-large"
              }
            >
              About Us
            </NavLink>

            {/* Logged-in dashboard button */}
            {isLoggedIn ? (
              <>
                <span className="text-gray-800">
                  Welcome, {userData?.firstName || "User"}
                </span>
                <button
                  onClick={() => navigate(getDashboardURL())}
                  className="bg-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: "#00B4D8" }}
                >
                  {getDashboardLabel()}
                </button>
              </>
            ) : (
              <Link
                to="/sign-up"
                className="hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                style={{ backgroundColor: "#00B4D8" }}
              >
                Sign Up
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-dark-blue focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-8 space-y-2">
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                  className="block h-1 w-full bg-blue rounded"
                />
                <motion.span
                  animate={{ opacity: isOpen ? 0 : 1 }}
                  className="block h-1 w-full bg-blue rounded"
                />
                <motion.span
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                  className="block h-1 w-full bg-blue rounded"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 pb-4 pt-2">
                <Link
                  to="/"
                  className="text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  className="text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/about-us"
                  className="text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>

                {isLoggedIn ? (
                  <>
                    <span className="text-gray-800 px-3 py-2 text-lg">
                      Welcome, {userData?.firstName || "User"}
                    </span>
                    <button
                      onClick={() => {
                        navigate(getDashboardURL());
                        setIsOpen(false);
                      }}
                      className="bg-blue text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors w-11/12 mx-3"
                      style={{ backgroundColor: "#00B4D8" }}
                    >
                      {getDashboardLabel()}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/sign-up"
                    className="text-white bg-blue hover:bg-blue-700 px-6 py-3 rounded text-center text-lg font-medium w-11/12 mx-3 transition-colors"
                    style={{ backgroundColor: "#00B4D8" }}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
