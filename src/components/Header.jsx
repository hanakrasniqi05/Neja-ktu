import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logov2.png'; 
const Header = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6"> 
        <div className="flex justify-between items-center h-20"> 
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="N'eja ktu logo" 
                className="h-16 mr-4" 
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-grow justify-center space-x-10"> 
            <Link 
              to="/" 
              className="text-gray-800 hover:text-blue-600 px-3 py-2 text-lg font-medium" 
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-gray-800 hover:text-blue-600 px-3 py-2 text-lg font-medium"
            >
              Events
            </Link>
            <Link 
              to="/about-us" 
              className="text-gray-800 hover:text-blue-600 px-3 py-2 text-lg font-medium"
            >
              About Us
            </Link>
          </div>

          <div className="flex items-center">
            <Link 
              to="/sign-up" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-lg font-medium transition-colors" // Increased padding and text
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