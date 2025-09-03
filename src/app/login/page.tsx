'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

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
  const router = useRouter();
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

      const loginFormData = new FormData();
      loginFormData.append('username', formData.email);
      loginFormData.append('password', formData.password);

  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        body: loginFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();

      // Store user data and token in localStorage
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('tokenType', data.token_type);
      localStorage.setItem('userId', data.user.id.toString());
      localStorage.setItem('name', data.user.name);
      localStorage.setItem('email', data.user.email);
      
      // Redirect to home page
      router.push('/home');

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
  <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-black text-white p-12 relative">
        <div className="z-10">
          <h1 className="text-5xl font-extrabold mb-4 flex items-center gap-2">
            Welcome Back<br />to MotorClaimPro
          </h1>
          <p className="text-lg mb-8 max-w-md">
            Manage your vehicle insurance claims, track progress, and access all your claim documents in one place.
          </p>
        </div>
      </div>
      {/* Right login form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">MotorClaimPro</h2>
          <h3 className="text-2xl font-semibold mb-4">Welcome Back!</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Don't have an account? <Link href="/signup" className="text-blue-600 font-medium hover:underline"><span className="hover:underline">Sign up</span></Link>
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
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 text-sm gap-2">
            <Link href="/forgot-password" className="text-blue-600 font-medium hover:underline"><span className="hover:underline">Forgot password?</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
