
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '../../lib/config';

interface FormErrors {
  password?: string;
  confirm_password?: string;
  general?: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [tokenValid, setTokenValid] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirm_password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    setTokenValid(null);
    fetch(`${API_BASE_URL}/api/users/validate-reset-token?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Invalid or expired token');
        const data = await res.json();
        setTokenValid(data.valid === true);
      })
      .catch(() => setTokenValid(false));
  }, [token]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reset password');
      }
      setSuccessMessage('Password reset successful! You can now log in.');
      setFormData({ password: '', confirm_password: '' });
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'An error occurred' });
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
            Reset Your<br />Password<span className="text-4xl">🔒</span>
          </h1>
          <p className="text-lg mb-8 max-w-md">
            Enter your new password below. Make sure it's strong and secure to protect your account.
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
      {/* Right reset password form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">SaleSkip</h2>
          <h3 className="text-2xl font-semibold mb-4">New Password</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Remember your password? <Link href="/login" className="text-blue-600 hover:underline font-medium">Back to Login</Link>
          </p>
          {tokenValid === null && (
            <div className="mb-4 text-center text-gray-500">Validating token...</div>
          )}
          {tokenValid === false && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              Invalid or expired token. Please request a new password reset link.
            </div>
          )}
          {tokenValid && (
            <>
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
                  {successMessage}
                </div>
              )}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                  {errors.general}
                </div>
              )}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <input
                    className={`w-full px-4 py-3 border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                    type="password"
                    id="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <input
                    className={`w-full px-4 py-3 border-b ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500 text-base`}
                    type="password"
                    id="confirm_password"
                    placeholder="Confirm New Password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
          <div className="flex flex-col items-center mt-6 text-sm gap-2">
            <Link href="/signup" className="text-black font-medium hover:underline">Don't have an account? <span className="underline">Sign up</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
