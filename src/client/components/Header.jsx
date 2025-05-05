import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logov2.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

          <div className="hidden md:flex flex-grow justify-end px-8 space-x-10">
            <Link
              to="/"
              className="text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
            >
              Events
            </Link>
            <Link
              to="/about-us"
              className="text-gray-800 hover:text-dark-blue px-3 py-2 text-lg font-medium"
            >
              About Us
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to="/sign-up"
              className="hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
              style={{ backgroundColor: "#00B4D8" }}
            >
              Sign Up
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-dark-blue focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-8 space-y-2">
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 8 : 0,
                  }}
                  className="block h-1 w-full bg-blue rounded"
                ></motion.span>
                <motion.span
                  animate={{
                    opacity: isOpen ? 0 : 1,
                  }}
                  className="block h-1 w-full bg-blue rounded"
                ></motion.span>
                <motion.span
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -8 : 0,
                  }}
                  className="block h-1 w-full bg-blue rounded"
                ></motion.span>
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
                <Link
                  to="/sign-up"
                  className="text-white bg-blue hover:bg-blue-700 px-8 py-3 rounded-md text-lg font-medium text-center transition-colors w-2/5"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;