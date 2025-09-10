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

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-3 text-left font-semibold">Profile</th>
            <th className="py-2 px-3 text-left font-semibold">Name</th>
            <th className="py-2 px-3 text-left font-semibold">Email</th>
            <th className="py-2 px-3 text-left font-semibold">Role</th>
            <th className="py-2 px-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
  {users.map((user) => (
    <tr key={user.id} className="border-b hover:bg-gray-50">
      <td className="py-2 px-3">
        <img
          src={user.profilePicture || "https://via.placeholder.com/48"}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-12 h-12 object-cover rounded-full"
        />
      </td>
      <td className="py-2 px-3 font-medium">
        {user.firstName} {user.lastName}
      </td>
      <td className="py-2 px-3">{user.email}</td>
      <td className="py-2 px-3 capitalize">{user.role}</td>
      <td className="py-2 px-3 flex gap-2">
        <button className="bg-teal-blue text-white px-3 py-1 rounded hover:bg-blue">
          Edit
        </button>
        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}
