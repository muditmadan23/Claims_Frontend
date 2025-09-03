'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { show } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      show({ type: 'success', title: 'Email sent', message: 'Check your inbox for the reset link.' });
      setShowSuccess(true);
      setEmail('');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred while sending reset email';
      show({ type: 'error', title: 'Could not send email', message });
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
      {/* Right forgot password form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">MotorClaimPro</h2>
          <h3 className="text-2xl font-semibold mb-4">Reset Password</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Remember your password? <Link href="/login" className="text-blue-600 font-medium hover:underline"><span className="hover:underline">Back to Login</span></Link>
          </p>
          
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
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="flex flex-col items-center mt-6 text-sm gap-2">
            <span className="text-gray-600">Don't have an account?</span>{' '}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline"><span className="hover:underline">Sign up</span></Link>
          </div>
        </div>
      </div>
      <Modal open={showSuccess} onClose={() => setShowSuccess(false)} title="Reset link sent">
        <p className="text-sm text-gray-700">We sent a password reset link to your email address.</p>
      </Modal>
    </div>
  );
}
