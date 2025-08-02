import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logo from "../assets/logo-pin-b.png";

function CompanySignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessRegistrationNumber: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.businessRegistrationNumber) 
      newErrors.businessRegistrationNumber = 'Business registration number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      await axios.post('/api/companies/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        description: formData.description
      });

      alert('Company registration submitted for verification!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F2FE] p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD] rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-full">
        <div className="p-10 bg-white/50 backdrop-blur-md">
          <h2 className="text-[#1E3A8A] text-3xl font-bold mb-8">Company Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Your full name *"
              value={formData.name}
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
              name="password"
              type="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="companyName"
              placeholder="Company name *"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <input
              name="businessCode"
              placeholder="Business registration code *"
              value={formData.businessCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            <textarea
              name="description"
              placeholder="Company description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none min-h-[100px]"
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
              <a href="#" className="underline text-[#2563EB]">
                Privacy Policy
              </a>
            </label>
            <button
              type="submit"
              className="w-full py-2 bg-[#60A5FA] text-white font-semibold rounded-full shadow-md hover:bg-[#3B82F6]"
            >
              Submit for Review
            </button>
          </form>
          <div className="my-6 text-center text-blue-800 text-sm">Or</div>
          <Link to="/sign-up">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Sign Up as an Individual
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
export default CompanySignupForm;