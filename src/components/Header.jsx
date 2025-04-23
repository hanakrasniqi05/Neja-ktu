import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logov2.png'; 

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-500 shadow-md">
      <div className="px-6"> 
        <div className="flex justify-between items-center h-20"> 
          <div className="flex-shrink-0 m-4">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="N'eja ktu logo" 
                className="h-14" 
              />
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

          <div className="flex items-center">
            <Link 
              to="/sign-up" 
              className="hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
              style={{ backgroundColor: "#00B4D8" }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;