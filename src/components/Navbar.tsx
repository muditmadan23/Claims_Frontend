"use client";


import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';


function SupportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ subject: "", category: "general", priority: "medium", message: "", email: "" });
      onClose();
    }, 3000);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(243, 244, 246, 0.7)' }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-600">Thank you for contacting us. Our support team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent" placeholder="your.email@company.com" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent">
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Account</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent" placeholder="Brief description of your issue" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent resize-none" placeholder="Please provide detailed information about your inquiry..." />
              </div>
              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#1F4A75] text-white py-2 px-4 rounded-lg hover:bg-[#1a3d63] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>) : (<><Send className="w-4 h-4 mr-2" />Send Message</>)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [showSupportModal, setShowSupportModal] = useState(false);
  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 px-4 md:px-12 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home')}>
          <img src="/logo.png" alt="MotorClaimPro Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl md:text-2xl font-bold text-black flex items-center gap-2">MotorClaimPro</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8 text-sm text-gray-700 font-medium">
          <button onClick={() => router.push('/home')} className="hover:text-[#1F4A75] transition cursor-pointer">Home</button>
          <button onClick={() => router.push('/upload')} className="hover:text-[#1F4A75] transition cursor-pointer">New Claim</button>
          <button onClick={() => router.push('/dashboard')} className="hover:text-[#1F4A75] transition cursor-pointer">History</button>
          <button onClick={() => router.push('/driver-details')} className="hover:text-[#1F4A75] transition cursor-pointer">Driver Details</button>
          <button onClick={() => router.push('/my-vehicles')} className="hover:text-[#1F4A75] transition cursor-pointer">Vehicle Details</button>
          <button onClick={() => setShowSupportModal(true)} className="hover:text-[#1F4A75] transition cursor-pointer">Help</button>
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('tokenType');
              localStorage.removeItem('name');
              localStorage.removeItem('username');
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="hover:text-[#1F4A75] transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>
      <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
    </>
  );
}
