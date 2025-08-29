'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../lib/config';

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: undefined
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
      const response = await fetch(`${API_BASE_URL}/api/users/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send reset email');
      }

      const data = await response.json();
      setSuccessMessage('Password reset email sent successfully! Please check your inbox and follow the instructions.');
      setEmail(''); // Clear form

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred while sending reset email'
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
            Forgot Your<br />Password?<span className="text-4xl">🔑</span>
          </h1>
          <p className="text-lg mb-8 max-w-md">
            No worries! Enter your email address and we'll send you a link to reset your password.
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
      {/* Right forgot password form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">SaleSkip</h2>
          <h3 className="text-2xl font-semibold mb-4">Reset Password</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Remember your password? <Link href="/login" className="text-blue-600 hover:underline font-medium">Back to Login</Link>
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
                className={`w-full px-4 py-3 border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={handleInputChange}
                required 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 text-sm gap-2">
            <Link href="/signup" className="text-black font-medium hover:underline">Don't have an account? <span className="underline">Sign up</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
