import React, { useState } from "react";

export default function EditProfile({ user, onSave }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || ""
  });
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    if (e.target.profilePic.files[0]) {
      formData.append("profilePic", e.target.profilePic.files[0]);
    }

    const res=await fetch("http://localhost:5000/api/users/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile updated!");
      setOpen(false);
      onSave && onSave();
    } else {
      alert(data.message || "Update failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        alert("Account deleted. You will be logged out.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-teal-blue w-full text-white rounded-lg shadow-md"
      >
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm">Profile Picture</label>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handlePicChange}
                  className="w-full"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-full"
                  />
                )}
              </div>

             <div className="pt-2 border-t">
              <p
                onClick={handleDelete}
                className="mt-2 cursor-pointer text-red-600 underline hover:text-red-700"
              >
                Delete Account
              </p>
            </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
