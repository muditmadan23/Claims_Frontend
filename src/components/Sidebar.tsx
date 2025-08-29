'use client';

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
  ChevronLeft,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Send,
  Loader2,
} from "lucide-react";

interface SidebarProps {
  forceCollapsed?: boolean;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ subject: "", category: "general", priority: "medium", message: "", email: "" });
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Contact Support</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-600">
                Thank you for contacting us. Our support team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent"
                  placeholder="your.email@company.com"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Account</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A75] focus:border-transparent resize-none"
                  placeholder="Please provide detailed information about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1F4A75] text-white py-2 px-4 rounded-lg hover:bg-[#1a3d63] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  forceCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ forceCollapsed = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const [name, setName] = useState("User");
  const [username, setUsername] = useState("");
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem("name") || "User");
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  const actuallyCollapsed = forceCollapsed || isCollapsed;
  const isActive = (path: string): boolean => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={twMerge(
          `bg-white border-r border-gray-200 flex flex-col h-screen
           fixed lg:relative left-0 top-0 z-50 transform transition-all duration-300 ease-in-out`,
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          actuallyCollapsed ? "w-[70px]" : "w-64",
          "lg:translate-x-0"
        )}
      >
        <div className={twMerge("flex flex-col h-full", actuallyCollapsed ? "items-center" : "")}>
          {/* User Profile Section */}
          <div className={twMerge("p-4 border-b border-gray-200 w-full", actuallyCollapsed ? "px-4" : "px-6")}> 
            {isClient && (
              <div className="flex items-center space-x-3">
                <img
                  src="/analyst.png"
                  alt="Analyst"
                  className="w-10 h-10 rounded-full object-cover"
                />
                {!actuallyCollapsed && (
                  <div>
                    <div className="font-medium text-sm leading-5 tracking-normal text-black">
                      {name}
                    </div>
                    <div className="font-medium text-[9px] leading-[12px] tracking-[0.4px] text-[#757575]">
                      {username}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-8 z-10 w-6 h-6 bg-white border-2 border-gray-200 rounded-full items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${actuallyCollapsed ? "rotate-180" : ""}`} />
          </button>

          {/* Navigation Menu */}
          <div className={twMerge("flex-1 py-6 w-full", actuallyCollapsed ? "px-4" : "px-6")}>
            {!actuallyCollapsed && (
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">MAIN</div>
            )}

            <ul className="space-y-2">
              {/* Company Profile and Create Uploader removed for all roles */}
            </ul>

            {/* New Navigation Options */}
            <ul className="space-y-2 mt-4">
              {/* Upload New Claim */}
              <li>
                <button
                  className={twMerge(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium tracking-tightest",
                    "text-[#718096] hover:bg-gray-100",
                    actuallyCollapsed && "justify-center"
                  )}
                >
                  <img
                    src="/uploader.png"
                    alt="Upload"
                    className="w-4 h-4 object-contain"
                  />
                  {!actuallyCollapsed && <span>Upload New Claim</span>}
                </button>
              </li>

              {/* History Claim */}
              <li>
                <button
                  className={twMerge(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium tracking-tightest",
                    "text-[#718096] hover:bg-gray-100",
                    actuallyCollapsed && "justify-center"
                  )}
                >
                  <img
                    src="/document.png"
                    alt="History"
                    className="w-4 h-4 object-contain"
                  />
                  {!actuallyCollapsed && <span>History Claim</span>}
                </button>
              </li>

              {/* Car Details */}
              <li>
                <button
                  className={twMerge(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium tracking-tightest",
                    "text-[#718096] hover:bg-gray-100",
                    actuallyCollapsed && "justify-center"
                  )}
                >
                  <img
                    src="/companyProfile.png"
                    alt="Car Details"
                    className="w-4 h-4 object-contain"
                  />
                  {!actuallyCollapsed && <span>Car Details</span>}
                </button>
              </li>

              {/* Driver Details */}
              <li>
                <button
                  className={twMerge(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium tracking-tightest",
                    "text-[#718096] hover:bg-gray-100",
                    actuallyCollapsed && "justify-center"
                  )}
                >
                  <img
                    src="/companyProfile.png"
                    alt="Driver Details"
                    className="w-4 h-4 object-contain"
                  />
                  {!actuallyCollapsed && <span>Driver Details</span>}
                </button>
              </li>
            </ul>

            {!actuallyCollapsed && <div className="w-[208px] h-[2px] rounded-full bg-[#F6F6F6] mx-auto my-4" />}
          </div>

          {/* Bottom Section */}
          <div className={twMerge("p-4 w-full", actuallyCollapsed ? "px-2" : "px-6")}>
            {!actuallyCollapsed ? (
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="flex items-center gap-3 p-2 text-sm font-medium leading-5 tracking-tightest text-[#757575] hover:bg-gray-100 rounded-lg w-full"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-2 text-sm font-medium leading-5 tracking-tightest text-[#D55F5A] hover:bg-red-50 rounded-lg w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout Account</span>
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="flex justify-center p-2 rounded-lg text-[#757575] hover:bg-gray-100 w-full"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex justify-center p-2 rounded-lg text-[#D55F5A] hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <SupportModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />
      )}
    </>
  );
};
