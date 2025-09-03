"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { API_BASE_URL } from "@/lib/config";
import { Search as SearchIcon } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  const [policyNumber, setPolicyNumber] = useState<string>("");
  const [policyLookupLoading, setPolicyLookupLoading] = useState(false);
  const [policyLookupError, setPolicyLookupError] = useState<string>("");
  const [detailsUnlocked, setDetailsUnlocked] = useState(false);
  const [policyDetails, setPolicyDetails] = useState<{
    insurer: string;
    policyNumber: string;
    coverage: string;
    effectiveFrom: string;
    effectiveTo: string;
    status: string;
    plan: string;
  } | null>(null);
  const [claimId, setClaimId] = useState<string>("");
  const [claimCreateLoading, setClaimCreateLoading] = useState(false);
  const [claimCreateError, setClaimCreateError] = useState<string>("");

  // Vehicle details state for API response
  const [vehicleDetails, setVehicleDetails] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: ""
  });

  const lookupPolicy = async () => {
    const query = policyNumber.trim();
    if (!query) return;

    setPolicyLookupLoading(true);
    setPolicyLookupError("");
    try {
      // Use the real API for policy search
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/api/policies/search?policy_number=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });
      if (!res.ok) throw new Error("Policy not found");
      const data = await res.json();

      // Map API response to UI fields
      setPolicyDetails({
        insurer: data.insurer || "",
        policyNumber: data.policy_number || "",
        coverage: data.coverage || "",
        effectiveFrom: data.effective_from || "",
        effectiveTo: data.effective_to || "",
        status: data.status || "",
        plan: data.plan || "",
      });

      // Set vehicle details for display from API response
      if (data) {
        setVehicleDetails({
          make: data.vehicle_make || "",
          model: data.vehicle_model || "",
          year: data.vehicle_year ? String(data.vehicle_year) : "",
          licensePlate: data.license_plate || "",
          vin: data.vin || "",
        });
      } else {
        setVehicleDetails({ make: "", model: "", year: "", licensePlate: "", vin: "" });
      }

      setDetailsUnlocked(true);
    } catch (err: any) {
      setPolicyLookupError(err?.message || "Error searching policy");
    } finally {
      setPolicyLookupLoading(false);
    }
  };

  const createClaim = async () => {
    setClaimCreateLoading(true);
    setClaimCreateError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/api/claim/create`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          policy_number: policyNumber
        })
      });
      if (!res.ok) throw new Error("Failed to create claim");
      const data = await res.json();
      setClaimId(data.claim_id);
      
      // Navigate to the dynamic route
      router.push(`/upload/${data.claim_id}`);
    } catch (err: any) {
      setClaimCreateError(err?.message || "Error creating claim");
    } finally {
      setClaimCreateLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-5xl mx-auto mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            {/* Progress bar with 6 steps */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>1</div>
              <span className={`text-xs font-medium text-black`}>Policy</span>
            </div>
            <div className={`h-1 bg-gray-200 flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-gray-200 text-black`}>2</div>
              <span className={`text-xs font-medium text-gray-400`}>License</span>
            </div>
            <div className={`h-1 bg-gray-200 flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-gray-200 text-black`}>3</div>
              <span className={`text-xs font-medium text-gray-400`}>Images</span>
            </div>
            <div className={`h-1 bg-gray-200 flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-gray-200 text-black`}>4</div>
              <span className={`text-xs font-medium text-gray-400`}>Claim</span>
            </div>
            <div className={`h-1 bg-gray-200 flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-gray-200 text-black`}>5</div>
              <span className={`text-xs font-medium text-gray-400`}>Estimate</span>
            </div>
            <div className={`h-1 bg-gray-200 flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-gray-200 text-black`}>6</div>
              <span className={`text-xs font-medium text-gray-400`}>Results</span>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="min-h-screen bg-gray-50">
          {/* Step 1: Policy Search first */}
          <div className="w-full max-w-5xl mx-auto">
            
            {/* Phase 1: Policy Search */}
            {!detailsUnlocked && (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">Search Policy Number</h3>
                  <p className="text-sm text-gray-500 mb-4">Enter your policy number to fetch vehicle and policy details.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter policy number"
                      className="flex-1 border border-gray-200 rounded px-3 py-2 bg-white"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          lookupPolicy();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={lookupPolicy}
                      disabled={policyLookupLoading}
                      className={`px-4 py-2 rounded font-semibold transition cursor-pointer ${
                        policyLookupLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      <span className="inline-flex items-center"><SearchIcon className="w-4 h-4 mr-2" />Search</span>
                    </button>
                  </div>
                  {policyLookupLoading && (
                    <div className="mt-3 text-sm text-gray-500">Searching...</div>
                  )}
                  {policyLookupError && !policyLookupLoading && (
                    <div className="mt-3 text-sm text-red-600">{policyLookupError}</div>
                  )}
                </div>
              </div>
            )}

            {/* Phase 2: Policy Details + Vehicle Info */}
            {detailsUnlocked && (
              <div className="space-y-6">
                {/* Policy Details */}
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      Policy Details
                    </h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">Verified</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {policyDetails ? (
                      <>
                        {[{label:'Policy Number', value: policyDetails.policyNumber},{label:'Insurer', value: policyDetails.insurer},{label:'Plan', value: policyDetails.plan},{label:'Coverage', value: policyDetails.coverage},{label:'Effective From', value: policyDetails.effectiveFrom},{label:'Effective To', value: policyDetails.effectiveTo},{label:'Status', value: policyDetails.status}].map((f)=> (
                          <div key={f.label}>
                            <label className="block text-sm font-medium mb-1">{f.label}</label>
                            <input value={f.value} readOnly tabIndex={0} className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700 cursor-text" />
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{label:'Make',value:vehicleDetails.make},{label:'Model',value:vehicleDetails.model},{label:'Year',value:vehicleDetails.year},{label:'License Plate',value:vehicleDetails.licensePlate},{label:'VIN',value:vehicleDetails.vin}].map((f)=> (
                      <div key={f.label}>
                        <label className="block text-sm font-medium mb-1">{f.label}</label>
                        <input value={f.value} readOnly tabIndex={0} className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700 cursor-text" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-900 transition cursor-pointer"
                    onClick={createClaim}
                    disabled={claimCreateLoading}
                  >
                    {claimCreateLoading ? "Creating Claim..." : "Continue to License Details"}
                  </button>
                </div>
                {claimCreateError && (
                  <div className="mt-4 text-sm text-red-600">{claimCreateError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
