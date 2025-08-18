import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserSideBar = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');

    // First try to use local info
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsLoading(false);
    }

    // Then fetch data from server
    const fetchUserData = async () => {
      try {
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const freshUserData = response.data.data;
        setUserData(freshUserData);
        localStorage.setItem('userData', JSON.stringify(freshUserData));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If API fails shows local info
        if (!storedUserData) {
          setUserData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full md:w-1/3 p-8 my-8 mx-4 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full md:w-1/3 p-8 my-8 mx-4 bg-white rounded-lg shadow-xl border border-gray-200">
        <p className="text-center text-gray-600">Please log in to view your profile</p>
        <div className="mt-4 flex justify-center">
          <a 
            href="/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 p-8 my-8 mx-4 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200">
          {userData.profilePicture ? (
            <img 
              src={userData.profilePicture} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl text-blue-600">
              {userData.firstName?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome {userData.firstName || 'User'}!
        </h2>
        {/* User Info */}
        <div className="w-full space-y-4 px-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <p className="mt-1 text-lg text-gray-800">
              {userData.username || (userData.firstName + (userData.lastName ? ' ' + userData.lastName : ''))}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-800">{userData.email}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-3 w-full px-4">
          <button className="w-full px-6 py-2 bg-teal-blue text-white rounded-md hover:bg-blue transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSideBar;