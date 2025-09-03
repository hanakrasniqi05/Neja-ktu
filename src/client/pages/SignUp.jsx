import React, { useState } from "react";
import logo from "../assets/logo-pin-b.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.agreedToTerms) {
      alert("You must agree to the Terms");
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      alert("Please enter both first name and last name");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "user",
      });

      localStorage.setItem("token", res.data.data.token);
      navigate("/login");
    } catch (error) {
  console.error("Signup error:", error);
  if (error.response) {
  
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
    alert(error.response.data?.message || "Registration failed");
  } else if (error.request) {

    console.error("No response received:", error.request);
    alert("No response from server. Please try again.");
  } else {

    console.error("Request setup error:", error.message);
    alert("Request error: " + error.message);
  }
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE] p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD] rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-full">
        <div className="p-10 bg-white/50 backdrop-blur-md">
          <h2 className="text-[#1E3A8A] text-3xl font-bold mb-8">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Work email *"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="phone"
              placeholder="Phone number *"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <label className="flex items-center text-blue-800 text-sm">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mr-2 accent-[#60A5FA]"
              />
               I agree to the
                <a href="#" className="underline mx-1 text-[#2563EB]">
                  Terms of Service
                </a>
                and 
                <a href="#" className="underline ml-1 text-[#2563EB]">
                  Privacy Policy
                </a>
            </label>
            <button
              type="submit"
              className="w-full py-2 bg-[#60A5FA] text-white font-semibold rounded-full shadow-md hover:bg-[#3B82F6]"
            >
              Sign Up
            </button>
          </form>
          <div className="my-6 text-center text-blue-800 text-sm">Or</div>
          <Link to="/company-signup">
            <button className="w-full flex items-center justify-center gap-2 border border-blue-200 py-2 rounded-full text-blue-800 hover:bg-[#93C5FD] hover:text-blue-900 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Sign Up as a Company
            </button>
          </Link>

          <p className="mt-6 text-center text-blue-800 text-sm">
            Already a member?{" "}
            <Link to="/login" className="underline text-[#2563EB]">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD]">
          <img src={logo} alt="Logo" className="w-3/4 h-auto" />
        </div>
      </div>
    </div>
  );
}
