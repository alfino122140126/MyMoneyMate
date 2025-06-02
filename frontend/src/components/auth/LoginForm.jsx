import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null); // State for local error handling
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const resultAction = await dispatch(login({ username, password }));
      if (login.fulfilled.match(resultAction)) {
        // Redirect on successful login, e.g., to dashboard or transactions page
        navigate('/transactions');
      } else {
        // Handle login failure (e.g., invalid credentials)
        if (resultAction.payload && resultAction.payload.message) {
           setError(resultAction.payload.message);
        } else {
           setError('Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-8"> {/* Adjusted max-w and added w-full for better responsiveness */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"> {/* Added shadow-lg, rounded-lg */}
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="username"> {/* Adjusted text color and font-weight */}
            Username
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" {/* Enhanced border, rounded, focus styles, shadow-sm */}
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="password"> {/* Adjusted text color and font-weight */}
            Password
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" {/* Enhanced border, rounded, focus styles, shadow-sm */}
            id="password"
            type="password"
            placeholder="********"
            name="password"
            value={password}
            onChange={handleChange}
            required          
          />
        </div>
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p> {/* Adjusted text color, size, and removed italic */}
        )}
        <div className="flex items-center justify-center"> {/* Centered button */}
          <button
 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 transition duration-150 ease-in-out w-full" {/* Enhanced button styles, added w-full */}
 type="submit"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;