import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('admin');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/signup', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      setMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[80px] animate-pulse delay-700"></div>
        </div>
      </div>

      <div className="max-w-md w-full backdrop-blur-xl bg-dark-800/40 p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/40 space-y-8 relative z-10 hover:shadow-brand-500/10 transition-all duration-300">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-white via-brand-200 to-brand-400 text-transparent bg-clip-text">
            Create Account
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-brand-400 hover:text-brand-300 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full px-4 py-3 rounded-xl border-2 border-dark-700 bg-dark-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 group-hover:border-brand-500/50"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 rounded-xl border-2 border-dark-700 bg-dark-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 group-hover:border-brand-500/50"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3 rounded-xl border-2 border-dark-700 bg-dark-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 group-hover:border-brand-500/50"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="group">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                className="block w-full px-4 py-3 rounded-xl border-2 border-dark-700 bg-dark-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 group-hover:border-brand-500/50"
                placeholder="Confirm your password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative w-full flex justify-center py-3 px-4 border-0 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transform transition-all duration-200 hover:scale-[1.02]"
            >
              Create Account
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-xl backdrop-blur-sm ${
            message.includes('successfully') 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          } animate-fadeIn`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
