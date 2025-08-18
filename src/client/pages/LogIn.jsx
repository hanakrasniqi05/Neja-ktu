import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Login data:', formData); // Debug log to see sent data

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      const token = res.data.data.token;
      const userData = res.data.data; // Adjusted according to typical response structure

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      const userRole = userData.role;
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'company') {
        // Redirect if company is not verified
        if (userData.verified === false) {
          navigate('/pending-verification');
        } else {
          navigate('/company/dashboard');
        }
      } else navigate('/user-dashboard');

    } catch (error) {
      // Show specific message for unverified companies
      if (error.response?.data?.message === 'unverified account') {
        setError('Llogaria juaj është në pritje të verifikimit nga admini.');
      } else {
        setError(error.response?.data?.message || 'Login failed');
      }
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE] p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1E3A8A]">Login</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#60A5FA] text-white font-semibold rounded-full hover:bg-[#3B82F6]"
          >
            Login
          </button>
          <p className="text-center mt-4 text-sm text-gray-700">
          Don't have an account yet?{" "}
          <Link to="/sign-up" className="underline text-[#2563EB]">
          Sign up!
          </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
