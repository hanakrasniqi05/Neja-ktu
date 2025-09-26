import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditProfile from './EditProfile';

const UserSideBar = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.reload();
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.data.success || !response.data.data) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      let freshUserData = response.data.data;

      // Check if profilePicture exists with any case
      const profilePicKey = Object.keys(freshUserData).find(key => 
        key.toLowerCase() === 'profilepicture' || 
        key.toLowerCase() === 'profilepic'
      );

      if (profilePicKey) {
        const profilePicPath = freshUserData[profilePicKey];
        if (profilePicPath) {
          const cleanPath = profilePicPath.replace(/^\/+/, '');
          freshUserData.profilePic = `http://localhost:5000/${cleanPath}?t=${Date.now()}`;
        }
      } else {
        freshUserData.profilePic = null;
      }

      setUserData(freshUserData);
      localStorage.setItem('userData', JSON.stringify(freshUserData));
    } catch {
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== 'undefined' && storedUserData !== 'null') {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.profilePicture) {
          const cleanPath = parsedData.profilePicture.replace(/^\/+/, '');
          parsedData.profilePic = `http://localhost:5000/${cleanPath}?t=${Date.now()}`;
        }
        setUserData(parsedData);
      } catch {
        localStorage.removeItem('userData');
      }
    }
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
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 p-8 my-8 mx-4 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex flex-col items-center space-y-6">
        {/* Profile picture */}
        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200">
          {userData.profilePic ? (
            <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-blue-600">
              {userData.firstName?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Welcome {userData.firstName || 'User'}!</h2>

        <div className="w-full space-y-4 px-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg text-gray-800">{userData.firstName} {userData.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-800">{userData.email}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-full px-4">
          <EditProfile user={userData} onSave={fetchUserData} />
          <button onClick={handleLogout} className="w-full px-6 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500 transition-colors font-medium">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSideBar;
