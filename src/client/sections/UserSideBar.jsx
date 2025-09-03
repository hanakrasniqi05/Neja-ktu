import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditProfile from './EditProfile';

const UserSideBar = () => {
  // state ku ruajm user data
  const [userData, setUserData] = useState(null);
  // loading state - kur po marrim data prej backend
  const [isLoading, setIsLoading] = useState(true);

  // logout function - fshin token edhe userData prej localStorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.reload();
  };

  // funksioni qe mer user info prej backend
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    // nese nuk ka token - mos bo request
    if (!token || token === "undefined" || token === "null") {
      setIsLoading(false);
      return;
    }

    try {
      // marrim user data prej API
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const freshUserData = response.data.data;
      setUserData(freshUserData); // e vendosim ne state
      localStorage.setItem('userData', JSON.stringify(freshUserData)); // e ruajm ne localStorage
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect qe e kontrollon nese ka userData ne localStorage edhe merr fresh data prej API
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== "undefined" && storedUserData !== "null") {
      try {
        setUserData(JSON.parse(storedUserData)); // e vendos prej localStorage
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
      }
    }
    fetchUserData();
  }, []);

  // loading state UI - kur ende po marrim data
  if (isLoading) {
    return (
      <div className="w-full md:w-1/3 p-8 my-8 mx-4 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // nese user nuk eshte i loguar
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
        
        {/* Foto e profilit ose iniciali i emrit */}
        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200">
          {userData.profilePic ? (
            <img 
              src={userData.profilePic} 
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
        <div className="w-full space-y-4 px-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg text-gray-800">
              {userData.firstName} {userData.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-800">{userData.email}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-3 w-full px-4 bg-teal">
          <EditProfile user={userData} onSave={fetchUserData} />

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
