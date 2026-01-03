import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo-pin-b.png';

function CompanySignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // User Account Info
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',

    // Company Info
    companyName: '',
    businessRegistrationNumber: '',
    companyEmail: '',
    phoneNumber: '',
    address: '',
    website: '',
    description: '',

    // Legal
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogoUpload = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    
    // User Account Validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    // Company Info Validation
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.businessRegistrationNumber.trim()) {
      newErrors.businessRegistrationNumber = 'Business registration number is required';
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Legal
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData(); 

    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('companyName', formData.companyName);
    formDataToSend.append('businessRegistrationNumber', formData.businessRegistrationNumber);
    formDataToSend.append('companyEmail', formData.companyEmail); 
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('logo_path', logoFile);

      const response = await axios.post('/api/companies/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.status === 'pending') {
        alert('Registration successful! Your account is pending verification.');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
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
            
            {/* User Account Section */}
            <div className="space-y-4">
              <h3 className="text-[#1E3A8A] font-semibold">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <input
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password *"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="space-y-4">
              <h3 className="text-[#1E3A8A] font-semibold">Company Information</h3>
              
              <div>
                <input
                  name="companyName"
                  placeholder="Company Name *"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <input
                  name="businessRegistrationNumber"
                  placeholder="Business Registration Number *"
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
                {errors.businessRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.businessRegistrationNumber}</p>}
              </div>

              <div>
                <input
                  name="companyEmail"
                  type="email"
                  placeholder="Company Email *"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
                {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>}
              </div>

              <div>
                <input
                  name="phoneNumber"
                  placeholder="Phone Number *"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <input
                  name="address"
                  placeholder="Company Address *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <input
                  name="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Company Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-blue-200 bg-transparent text-[#1E3A8A] placeholder-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-blue-800 mb-1">Company Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-sm text-blue-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Terms agreement */}
            <div className="mt-4">
              <label className="flex items-center text-blue-800 text-sm">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mr-2 accent-[#60A5FA]"
                />
                I agree to the
                <button 
                  type="button" 
                  onClick={() => navigate('/terms')} 
                  className="underline mx-1 text-[#2563EB] bg-transparent border-none p-0 cursor-pointer"
                >
                  Terms of Service
                </button>
                and 
                <button 
                  type="button" 
                  onClick={() => navigate('/privacy')} 
                  className="underline ml-1 text-[#2563EB] bg-transparent border-none p-0 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </label>
              {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#60A5FA] text-white font-semibold rounded-full shadow-md hover:bg-[#3B82F6] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Register Company'}
            </button>
          </form>

          <p className="mt-6 text-center text-blue-800 text-sm">
            Already have an account?{" "}
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