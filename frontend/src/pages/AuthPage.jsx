import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <button
          onClick={toggleForm}
          className="mt-4 w-full text-center text-blue-600 hover:underline"
        >
          {isLogin ? 'Need an account? Register here.' : 'Already have an account? Login here.'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;