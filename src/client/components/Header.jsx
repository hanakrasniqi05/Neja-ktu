import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import logo from "../assets/logov2.png";

export default function Header({ onOpenEditProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData && storedData !== "undefined" && storedData !== "null") {
      setUserData(JSON.parse(storedData));
    }
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token && token !== "undefined" && token !== "null");
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Determine dashboard URL based on role
  const getDashboardURL = () => {
    if (!userData) return "/";
    switch (userData.role) {
      case "admin": return "/admin-dashboard";
      case "company": return "/company-dashboard";
      case "user": return "/user-dashboard";
      default: return "/";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
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

          <div className="hidden md:flex flex-grow justify-end px-8 space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-dark-blue px-3 py-2 text-lg font-medium"
                  : "text-gray-800 hover:text-dark-blue px-3 py-2 text-lg"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive
                  ? "text-dark-blue px-3 py-2 text-lg font-medium"
                  : "text-gray-800 hover:text-dark-blue px-3 py-2 text-lg"
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                isActive
                  ? "text-dark-blue px-3 py-2 text-lg font-medium"
                  : "text-gray-800 hover:text-dark-blue px-3 py-2 text-lg"
              }
            >
              About Us
            </NavLink>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
                >
                  {userData?.firstName || "User"}
                  <ChevronDown
                    className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    size={18}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg"
                    >
                      <li>
                        <button
                          onClick={() => {
                            navigate(getDashboardURL());
                            setDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </button>
                      </li>
                      <li>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
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
                    <button
                      onClick={() => {
                        navigate(getDashboardURL());
                        setIsOpen(false);
                      }}
                      className="bg-blue text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors w-11/12 mx-3"
                      style={{ backgroundColor: "#00B4D8" }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="text-red-600 hover:text-dark-blue px-3 py-2 text-lg text-left"
                    >
                      Logout
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
}
