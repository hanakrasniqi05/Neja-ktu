import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="p-4 md:p-6 w-full">
      <h2 className="text-xl font-bold mb-4 md:mb-6">All Users</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"></path>
          </svg>
          <p className="text-gray-500 text-lg">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Profile</th>
                <th className="py-3 px-4 text-left font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Role</th>
                <th className="py-3 px-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={user.profilePicture || "https://via.placeholder.com/48"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-500 md:hidden">{user.email}</div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'company' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors w-full md:w-auto"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Mobile Stats */}
      <div className="md:hidden mt-4 text-sm text-gray-600">
        <p>Showing {users.length} users</p>
      </div>
    </div>
  );
}