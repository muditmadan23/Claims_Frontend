'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../lib/config';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Create FormData for OAuth2PasswordRequestForm
      const loginFormData = new FormData();
      loginFormData.append('username', formData.email); // OAuth2 uses 'username' field for email
      loginFormData.append('password', formData.password);

      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        body: loginFormData // Send as FormData, not JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store token, name, and username in localStorage (new API response)
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('tokenType', data.token_type);
      }
      if (data.name) localStorage.setItem('name', data.name);
      if (data.username) localStorage.setItem('username', data.username);
      // Redirect to dashboard or home page after successful login
      window.location.href = '/dashboard';

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred during login'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 relative">
        <div className="absolute top-8 left-8 text-4xl font-bold">*</div>
        <div className="z-10">
          <h1 className="text-5xl font-extrabold mb-4 flex items-center gap-2">
            Hello<br />SaleSkip!<span className="text-4xl">👋</span>
          </h1>
          <p className="text-lg mb-8 max-w-md">
            Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!
          </p>
        </div>
        <div className="absolute bottom-8 left-8 text-xs opacity-70"></div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          {/* Decorative SVG lines */}
          <svg width="100%" height="100%" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 0C300 400 500 400 600 800" stroke="white" strokeWidth="1.5"/>
            <path d="M0 100C200 500 400 500 500 900" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
      {/* Right login form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">SaleSkip</h2>
          <h3 className="text-2xl font-semibold mb-4">Welcome Back!</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline font-medium">Sign up</Link>
          </p>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input 
                className={`w-full px-4 py-3 border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                type="email" 
                id="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input 
                className={`w-full px-4 py-3 border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                type="password" 
                id="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 text-sm gap-2">
            <Link href="/forgot-password" className="text-black font-medium hover:underline">Forgot password? <span className="underline">Click here</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
