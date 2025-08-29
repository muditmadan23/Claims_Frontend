"use client";
import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { createPortal } from "react-dom";
import { vehicles as sharedVehicles } from "@/lib/data/vehicles";


type AddVehicleModalProps = {
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
};
function AddVehicleModal({ onClose, onSave }: AddVehicleModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj: Record<string, string> = {};
    fd.forEach((v, k) => { obj[k as string] = v as string; });
    onSave(obj);
  };
  const modalUI = (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 transition-colors duration-200" onMouseDown={e => e.stopPropagation()}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto" onMouseDown={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">Add New Vehicle</h3>
          <button onClick={onClose} className="text-black hover:text-gray-800 text-xl">×</button>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vehicle Name</label>
            <input ref={firstFieldRef} type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
          <div>
            <label htmlFor="license" className="block text-sm font-medium text-gray-700">License Plate</label>
            <input type="text" id="license" name="license" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700">VIN</label>
            <input type="text" id="vin" name="vin" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
          <div>
            <label htmlFor="policy" className="block text-sm font-medium text-gray-700">Policy Number</label>
            <input type="text" id="policy" name="policy" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" id="image" name="image" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-black rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800">Add Vehicle</button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalUI, document.body);
}

export default function MyVehiclesPage() {
  const [showModal, setShowModal] = useState(false);
  const [vehicleList, setVehicleList] = useState<any[]>(sharedVehicles);
  const handleAddVehicle = (data: Record<string, string>) => {
    setVehicleList(prev => [
      {
        name: data.name || "",
        license: data.license || "",
        vin: data.vin || "",
        policy: data.policy || "",
        status: "Active",
        image: data.image || "/default-car.jpg"
      },
      ...prev
    ]);
    setShowModal(false);
  };
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      {showModal && (
        <AddVehicleModal onClose={() => setShowModal(false)} onSave={handleAddVehicle} />
      )}
      <main className="pb-16">
        <section className="max-w-6xl mx-auto px-4 pt-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Registered Vehicles</h1>
          <p className="text-gray-600 mb-8 max-w-2xl">Here you can view and manage all vehicles associated with your account. Easily add new vehicles.</p>
          <button
            className="flex items-center gap-2 bg-gray-200 text-gray-900 px-5 py-2 rounded font-semibold text-sm shadow hover:bg-gray-300 transition mb-10 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Add New Vehicle
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicleList.map((v, i) => (
              <div key={i} className="bg-white rounded-xl border p-4 flex flex-col items-center shadow-sm">
                <img src={v.image} alt={v.name} className="w-full h-44 object-cover rounded mb-4" />
                <h2 className="font-semibold text-lg text-gray-900 mb-1">{v.name}</h2>
                <div className="text-sm text-gray-700 mb-1">License Plate: <span className="font-mono">{v.license}</span></div>
                <div className="text-xs text-gray-500 mb-1">VIN: {v.vin}</div>
                <div className="text-xs text-gray-500 mb-2">Policy: {v.policy}</div>
                <div className={
                  v.status === "Active"
                    ? "bg-gray-200 text-gray-900 text-xs rounded px-3 py-1 mb-2 font-semibold"
                    : "bg-gray-300 text-gray-700 text-xs rounded px-3 py-1 mb-2 font-semibold"
                }>
                  {v.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
