"use client";


import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";


const claims = [
  {
    id: "MC-001-2023-01",
    date: "01/15/2023",
    vehicle: "Honda Civic (ABC-123)",
    type: "Collision",
    status: "Pending",
  },
  {
    id: "MC-002-2023-02",
    date: "02/20/2023",
    vehicle: "Toyota Camry (XYZ-789)",
    type: "Theft",
    status: "Pending",
  },
  {
    id: "MC-003-2023-03",
    date: "03/10/2023",
    vehicle: "Ford F-150 (PQR-456)",
    type: "Natural Disaster",
    status: "Pending",
  },
  {
    id: "MC-004-2023-04",
    date: "04/05/2023",
    vehicle: "Tesla Model 3 (TSL-987)",
    type: "Vandalism",
    status: "Pending",
  },
  {
    id: "MC-005-2023-05",
    date: "05/18/2023",
    vehicle: "BMW X5 (BMD-321)",
    type: "Collision",
    status: "Pending",
  },
  {
    id: "MC-006-2023-06",
    date: "06/22/2023",
    vehicle: "Mercedes-Benz C-Class (MBZ-654)",
    type: "Minor Accident",
    status: "Pending",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

export default function DashboardClaimHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vehicle, setVehicle] = useState("");
  const router = useRouter();

  const filtered = claims.filter((c) => {
    return (
      (!search || c.id.toLowerCase().includes(search.toLowerCase()) || c.vehicle.toLowerCase().includes(search.toLowerCase())) &&
      (!status || c.status === status) &&
      (!vehicle || c.vehicle === vehicle)
    );
  });

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <main className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#222]">Claim History</h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search claims..."
              className="px-3 py-2 border border-gray-200 rounded bg-white text-xs min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#1F4A75]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-200 rounded bg-white text-xs"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
              <option value="Awaiting Documents">Awaiting Documents</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded bg-white text-xs"
              value={vehicle}
              onChange={e => setVehicle(e.target.value)}
            >
              <option value="">All Vehicles</option>
              {Array.from(new Set(claims.map(c => c.vehicle))).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#23272f]/90 backdrop-blur-sm">
              <tr className="h-[43px]">
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Claim ID</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Date Filed</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Vehicle</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Claim Type</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors text-xs font-medium text-[#767575]">
                  <td className="px-4 py-3 text-[#222] font-normal">{c.id}</td>
                  <td className="px-4 py-3">{c.date}</td>
                  <td className="px-4 py-3">{c.vehicle}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[c.status] || "bg-yellow-100 text-yellow-800 border border-yellow-200"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-[#1F4A75] hover:underline cursor-pointer bg-transparent p-0"
                      onClick={() => router.push("/results")}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No claims found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}