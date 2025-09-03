'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';

interface FormErrors {
  password?: string;
  confirm_password?: string;
  general?: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { show } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
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
      show({ type: 'success', title: 'Password updated', message: 'Your password has been reset.' });
      setShowSuccess(true);
      setFormData({ password: '', confirm_password: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      show({ type: 'error', title: 'Update failed', message });
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
      {/* Right reset password form section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">MotorClaimPro</h2>
          <h3 className="text-2xl font-semibold mb-4">New Password</h3>
          <p className="mb-6 text-gray-600 text-sm">
            Remember your password? <Link href="/login" className="text-blue-600 font-medium hover:underline"><span className="hover:underline">Back to Login</span></Link>
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
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
          <div className="flex flex-col items-center mt-6 text-sm gap-2">
            <span className="text-gray-600">Don't have an account?</span>
          </div>
        </div>
      </div>
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Password reset successful"
        footer={(
          <div className="flex justify-end">
            <button
              onClick={() => router.push('/login')}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              Go to Login
            </button>
          </div>
        )}
      >
        <p className="text-sm text-gray-700">You can now sign in with your new password.</p>
      </Modal>
    </div>
  );
}
