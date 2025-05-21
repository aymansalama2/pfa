import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/signin', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Redirection basée sur le rôle
          const userRole = response.data.user.role;
          let redirectPath;

          switch(userRole) {
            case 'admin':
              redirectPath = '/admin/dashboard';
              break;
            case 'manager':
              redirectPath = '/manager';
              break;
            case 'employee':
              redirectPath = '/employee';
              break;
            default:
              redirectPath = '/dashboard';
          }

          setMessage('Connexion réussie !');
          setTimeout(() => {
            navigate(redirectPath);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      if (error.response) {
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            const errorMessages = Object.values(validationErrors).flat();
            setMessage(errorMessages.join(', '));
          }
        } else if (error.response.status === 401) {
          setMessage('Email ou mot de passe incorrect');
        } else {
          setMessage(error.response.data.message || 'Erreur lors de la connexion');
        }
      } else {
        setMessage('Erreur de connexion au serveur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-500/20 blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[80px] animate-pulse delay-700"></div>
        </div>
      </div>

      <div className="max-w-md w-full backdrop-blur-xl bg-dark-800/40 p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/40 space-y-8 relative z-10 hover:shadow-brand-500/10 transition-all duration-300">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-white via-brand-200 to-brand-400 text-transparent bg-clip-text">
            Welcome Back
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-brand-400 hover:text-brand-300 transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 rounded-xl border-2 border-dark-700 bg-dark-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 group-hover:border-brand-500/50"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
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
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full flex justify-center py-3 px-4 border-0 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-xl backdrop-blur-sm ${
            message.includes('réussie') 
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

export default SignIn;
