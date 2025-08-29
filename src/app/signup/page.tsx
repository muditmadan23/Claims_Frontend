'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    setSuccessMessage('');

    try {

      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      setSuccessMessage('Account created successfully! Please check your email for verification.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred during registration'
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
      {/* Right signup form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">MotorClaimPro</h2>
          <h3 className="text-2xl font-semibold mb-4">Create Account!</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline"><span className="hover:underline">Login</span></Link>
          </p>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input 
                className={`w-full px-4 py-3 border-b ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                type="text" 
                id="name" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
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
            <div>
              <input 
                className={`w-full px-4 py-3 border-b ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                type="password" 
                id="confirmPassword" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required 
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
