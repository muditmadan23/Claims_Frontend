"use client";

'use client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#fafbfc]">
  <Navbar />

      {/* Hero Section */}
      <section className="w-full flex justify-center bg-white py-10 md:py-14">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-8 px-4">
          <div className="flex-1 flex flex-col items-start justify-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Simplify Your Motor Claim Process</h1>
            <p className="text-gray-700 mb-6 max-w-md">MotorClaim Pro makes filing and tracking your vehicle insurance claims effortless and efficient, right from your device.</p>
            <button
              className="bg-black text-white px-5 py-2 rounded font-semibold text-sm shadow hover:bg-gray-900 transition cursor-pointer hover:cursor-pointer"
              onClick={() => router.push('/upload')}
            >
              Get Started Now
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src="/cardemo.png" alt="Car Demo" className="w-96 h-64 object-cover rounded-lg shadow" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 px-4 flex flex-col items-center bg-[#f5f6f7]">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-10">How MotorClaim Pro Works</h2>
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border p-6 flex flex-col items-center text-center">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4"><path d="M4 17v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#bdbdbd" strokeWidth="1.5"/></svg>
            <h3 className="font-semibold text-lg mb-2">Upload Images</h3>
            <p className="text-gray-600 text-sm">Easily upload photos of your vehicle damage from multiple angles directly through our intuitive portal.</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col items-center text-center">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="font-semibold text-lg mb-2">Detail Your Claim</h3>
            <p className="text-gray-600 text-sm">Provide comprehensive information about the accident, vehicle details, and insurance coverage in a guided form.</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col items-center text-center">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4"><path d="M17 9V7a5 5 0 0 0-10 0v2M5 12h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Z" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="font-semibold text-lg mb-2">Get an Estimate</h3>
            <p className="text-gray-600 text-sm">Receive a quick damage estimate and upload relevant documents, accelerating your claim processing.</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="w-full py-16 px-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Key Features That Make Claims Easy</h2>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl border p-6 flex flex-col items-start text-left">
            <div className="mb-3"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M8 12h8m-4-4v8" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <h3 className="font-semibold text-lg mb-1">Fast Processing</h3>
            <p className="text-gray-600 text-sm">Experience rapid claim processing with our streamlined digital platform, getting you back on the road sooner.</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col items-start text-left">
            <div className="mb-3"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#bdbdbd" strokeWidth="1.5"/><path d="M8 12l2 2 4-4" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <h3 className="font-semibold text-lg mb-1">Secure & Reliable</h3>
            <p className="text-gray-600 text-sm">Your data is protected with industry-leading security, ensuring a safe and trustworthy claims experience.</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col items-start text-left">
            <div className="mb-3"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M3 12h18M12 3v18" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <h3 className="font-semibold text-lg mb-1">Real-time Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor your claim’s status with real-time updates, from submission to final resolution, right at your fingertips.</p>
          </div>
        </div>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border p-6 flex flex-col items-start text-left">
            <div className="mb-3"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#bdbdbd" strokeWidth="1.5"/><path d="M12 8v4l3 3" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <h3 className="font-semibold text-lg mb-1">Expert Support</h3>
            <p className="text-gray-600 text-sm">Access a team of dedicated claim specialists ready to assist you at every step of your claim journey.</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col items-start text-left">
            <div className="mb-3"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 17v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#bdbdbd" strokeWidth="1.5"/></svg></div>
            <h3 className="font-semibold text-lg mb-1">Effortless Submission</h3>
            <p className="text-gray-600 text-sm">Our user-friendly interface guides you through each step, making claim submission simple and stress-free.</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col items-start text-left">
            <div className="mb-3"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#bdbdbd" strokeWidth="1.5"/><path d="M8 12h8m-4-4v8" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <h3 className="font-semibold text-lg mb-1">Comprehensive History</h3>
            <p className="text-gray-600 text-sm">Keep a detailed record of all your past and current claims, accessible anytime for your convenience.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
