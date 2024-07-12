import React, { useState } from 'react';
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import LoadingOverlay from "../loading/loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const singinUrl = `${process.env.REACT_APP_BACKEND_URL}` + '/api/auth/signin';
  const dispatch = useDispatch();
  
  const handleSuccessfulLogin = (responseData) => {
    Swal.fire({
      icon: 'success',
      title: responseData.message,
    });
    dispatch({ type: 'LOGIN_SUCCESS', payload: responseData.user });
    localStorage.setItem('token', responseData.accessToken);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    navigate('/');
  };

  const handleUnsuccessfulLogin = (errorData) => {
    Swal.fire({
      icon: 'error',
      title: errorData.message,
    });
    navigate('/login');
  };

  const login = async () => {
    setLoading(true);
    const data = {
      email: username,
      password,
    };
    
    try {
      console.log(singinUrl)
      const response = await fetch(singinUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        handleSuccessfulLogin(responseData);
      } else {
        const errorData = await response.json();
        handleUnsuccessfulLogin(errorData);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const linkStyle = {
    color: 'blue',
    textDecoration: 'none',
  };

  return (
    <>
      {loading && <LoadingOverlay/>}

    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
        <div className="border border-gray-400 rounded p-4 shadow-md">
          <form>
            <div className="mb-4 flex items-center">
              <label htmlFor="email" className="block font-bold mr-2 w-24 text-left">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-400 p-1 rounded w-full"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-4 flex items-center">
              <label htmlFor="password" className="block font-bold mr-2 w-24 text-left">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-400 p-1 rounded w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
              type="button" 
              className="bg-customPurple hover:bg-customPurple text-white font-bold py-2 px-4 rounded w-full mb-4"
              onClick={login}
              >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <div className="text-center">
          Don't have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </div>
        <div className="text-center mt-4">
          <Link to="/forgot-password" style={linkStyle}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default LoginPage;
