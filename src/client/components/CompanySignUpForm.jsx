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
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Validate form fields
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
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5000/api/companies/register',{
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        businessRegistrationNumber: formData.businessRegistrationNumber
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
        
        {/* Form section */}
        <div className="p-10 bg-white/50 backdrop-blur-md">
          <h2 className="text-[#1E3A8A] text-3xl font-bold mb-8">Company Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* First Name */}
            <input
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

            {/* Last Name */}
            <input
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Work email *"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            {/* Password */}
            <input
              name="password"
              type="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            {/* Confirm Password */}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

            {/* Company Name */}
            <input
              name="companyName"
              placeholder="Company name *"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}

            {/* Business Registration Number */}
            <input
              name="businessRegistrationNumber"
              placeholder="Business registration number *"
              value={formData.businessRegistrationNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
            />
            {errors.businessRegistrationNumber && <p className="text-red-500 text-sm">{errors.businessRegistrationNumber}</p>}

            {/* Terms agreement */}
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
            {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[#60A5FA] text-white font-semibold rounded-full shadow-md hover:bg-[#3B82F6]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>

          {/* Or option */}
          <div className="my-6 text-center text-blue-800 text-sm">Or</div>
          <Link to="/sign-up">
            <button className="w-full flex items-center justify-center gap-2 border border-blue-200 py-2 rounded-full text-blue-800 hover:bg-[#93C5FD] hover:text-blue-900 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Sign Up as an Individual
            </button>
          </Link>

          {/* Already a member */}
          <p className="mt-6 text-center text-blue-800 text-sm">
            Already a member?{" "}
            <Link to="/login" className="underline text-[#2563EB]">
              Login
            </Link>
          </p>
        </div>

        {/* Logo / image section */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#93C5FD]">
          <img src={logo} alt="Logo" className="w-3/4 h-auto" />
        </div>
      </div>
    </div>
  );
}

export default CompanySignupForm;
