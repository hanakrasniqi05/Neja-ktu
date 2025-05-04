import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-pin-b.png";

export default function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE] p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD] rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-full">
        
        <div className="p-10 bg-white/50 backdrop-blur-md">
          <h2 className="text-[#1E3A8A] text-3xl font-bold mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#60A5FA] text-white font-semibold rounded-full shadow-md hover:bg-[#3B82F6]"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-blue-800 text-sm">
            Don’t have an account?{" "}
            <Link to="/sign-up" className="underline text-[#2563EB]">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD]">
          <img
            src={logo}
            alt="Logo"
            className="w-3/4 h-auto"
          />
        </div>
      </div>
    </div>
  );
}
