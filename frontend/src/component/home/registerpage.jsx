import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from "../loading/loader";

const positions = [
  'Select Position',
  'Compliance Admin Users',
  'Department Users',
  'Department Heads',
  'Zonal Compliance Officers',
  'Regional Compliance Officers',
  'Compliance Maker',
  'Compliance Checker'
];
const departments = [
  'Select Department',
  'Emerging Entrepreneur Business (EEB)',
  'Commercial Banking (CB)',
  'Retail Banking',
  'Commercial & Retail Credit',
  'Banking Operations & Customer Services',
  'Finance & Accounts',
  'Corporate Strategy',
  'Corporate Services',
  'Internal Audit',
  'Risk Management',
  'Internal Vigilance',
  'Compliance',
  'Information Technology (IT)',
  'Human Resources (HR)',
  'Project & Premises',
  'Company Secretary (CS)',
  'Legal',
  'Trade Finance',
  'Transaction Banking'
];

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const singupUrl = `${process.env.REACT_APP_BACKEND_URL}` + '/api/auth/signup';

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(JSON.stringify(formData))
    try {
      const response = await fetch(singupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to register user");
      }
  
      navigate("/login");
    } catch (error) {
      setError(error.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay/>}
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="border border-gray-400 rounded p-4 shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center">
              <label htmlFor="name" className="block font-bold mr-2 w-24 text-left">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="border border-gray-400 p-1 rounded w-full"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-4 flex items-center">
              <label htmlFor="email" className="block font-bold mr-2 w-24 text-left">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-400 p-1 rounded w-full"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                />
            </div>
            <div className="mb-4 flex items-center">
              <label htmlFor="role" className="block font-bold mr-2 w-24 text-left">
                Role:
              </label>
              <select
                id="role"
                className="border border-gray-400 p-1 rounded w-full"
                value={formData.role}
                onChange={handleInputChange}
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <label htmlFor="department" className="block font-bold mr-2 w-24 text-left">
                Department:
              </label>
              <select
                id="department"
                className="border border-gray-400 p-1 rounded w-full"
                value={formData.department}
                onChange={handleInputChange}
                >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6 flex items-center">
              <label htmlFor="password" className="block font-bold mr-2 w-24 text-left">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-400 p-1 rounded w-full"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="bg-customPurple hover:bg-customPurple text-white font-bold py-2 px-4 rounded w-full mb-4"
              >
              Register
            </button>
          </form>
        </div>
        <div className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue hover:text-lightBlue">
            Log in
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default RegisterPage;
