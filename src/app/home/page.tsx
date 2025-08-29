"use client";

import React, { useState } from "react";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: string;
  kmDriven: string;
  lastClaimDate: string;
  color: string;
  registration: string;
}

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      make: "Toyota",
      model: "Corolla",
      year: "2022",
      kmDriven: "15000",
      lastClaimDate: "10/08/2025",
      color: "White",
      registration: "DL01AB1234"
    }
  ]);

  const handleChange = (idx: number, field: keyof Vehicle, value: string) => {
    setVehicles((prev) => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const addVehicle = () => {
    setVehicles((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        make: "",
        model: "",
        year: "",
        kmDriven: "",
        lastClaimDate: "",
        color: "",
        registration: ""
      }
    ]);
  };

  const removeVehicle = (idx: number) => {
    setVehicles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Vehicle Details</h2>
        <form className="space-y-8">
          {vehicles.map((vehicle, idx) => (
            <div key={vehicle.id} className="border rounded-lg p-6 mb-4 bg-gray-50 relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={() => removeVehicle(idx)}
                title="Remove Vehicle"
                disabled={vehicles.length === 1}
              >
                &times;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Make</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.make}
                    onChange={e => handleChange(idx, "make", e.target.value)}
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Model</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.model}
                    onChange={e => handleChange(idx, "model", e.target.value)}
                    placeholder="e.g. Corolla"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Year</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.year}
                    onChange={e => handleChange(idx, "year", e.target.value)}
                    placeholder="e.g. 2022"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">KM Driven</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.kmDriven}
                    onChange={e => handleChange(idx, "kmDriven", e.target.value)}
                    placeholder="e.g. 15000"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Color</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.color}
                    onChange={e => handleChange(idx, "color", e.target.value)}
                    placeholder="e.g. White"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Registration Number</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.registration}
                    onChange={e => handleChange(idx, "registration", e.target.value)}
                    placeholder="e.g. DL01AB1234"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Last Claim Date</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={vehicle.lastClaimDate}
                    onChange={e => handleChange(idx, "lastClaimDate", e.target.value)}
                    placeholder="e.g. 10/08/2025"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={addVehicle}
          >
            + Add Another Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}
