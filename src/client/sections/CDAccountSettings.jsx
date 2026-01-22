import React, { useState, useEffect } from "react";

export default function CDAccountSettings() {
  const [companyData, setCompanyData] = useState({
    company_name: "",
    description: "",
    address: "",
    website: "",
    business_registration_number: "",
    phone_number: ""
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/companies/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Company data received:", data);
      
      if (data.success) {
        setCompanyData({
          company_name: data.data.company_name || "",
          description: data.data.description || "",
          address: data.data.address || "",
          website: data.data.website || "",
          business_registration_number: data.data.business_registration_number || "",
          phone_number: data.data.phone_number || ""
        });
        
        if (data.data.logo_path) {
          const fullLogoPath = data.data.logo_path.startsWith('http') 
            ? data.data.logo_path 
            : `http://localhost:5000${data.data.logo_path}`;
          setLogoPreview(fullLogoPath);
        }
      } else {
        throw new Error(data.message || "Failed to fetch company data");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setErrorMessage(error.message || "Failed to load company data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size too large. Maximum size is 2MB.");
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const formData = new FormData();
      
      // Append form data
      formData.append("company_name", companyData.company_name);
      formData.append("description", companyData.description);
      formData.append("address", companyData.address);
      formData.append("website", companyData.website);
      formData.append("business_registration_number", companyData.business_registration_number);
      formData.append("phone_number", companyData.phone_number);
      
      const logoFile = document.getElementById("logoInput")?.files[0];
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      console.log("Updating company profile...");
      
      const response = await fetch("http://localhost:5000/api/companies/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log("Update response:", data);
      
      if (data.success) {
        setSuccessMessage("Company information updated successfully!");
        
        // Update logo preview if new logo was uploaded
        if (data.data.logo_path) {
          const fullLogoPath = data.data.logo_path.startsWith('http') 
            ? data.data.logo_path 
            : `http://localhost:5000${data.data.logo_path}`;
          setLogoPreview(fullLogoPath);
        }
      
        // Refresh data after a short delay
        setTimeout(() => {
          fetchCompanyData();
        }, 1000);
      } else {
        setErrorMessage(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading company information...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Company Account Settings</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          ✅ {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Company Logo Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/128x128?text=No+Logo";
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <div className="text-4xl mb-2">🏢</div>
                  <div className="text-xs">Add Logo</div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                id="logoInput"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-lg file:border-0 
                  file:text-sm file:font-medium 
                  file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recommended: Square image, PNG or JPG, max 2MB
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="company_name"
            value={companyData.company_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Registration Number
          </label>
          <input
            type="text"
            name="business_registration_number"
            value={companyData.business_registration_number}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            This field cannot be changed as it's part of your official registration.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Description
          </label>
          <textarea
            name="description"
            value={companyData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about your company..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={companyData.phone_number}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={companyData.website}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Address
          </label>
          <input
            type="text"
            name="address"
            value={companyData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Full company address"
          />
        </div>
        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-3 bg-teal-blue rounded-lg font-medium transition duration-200 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Company Status</h3>
        <p className="text-gray-600">
          Your company profile is <span className="font-semibold text-green-600">verified</span>.
          You can update your information at any time.
        </p>
      </div>
    </div>
  );
}