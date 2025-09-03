"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { API_BASE_URL, apiCall } from "@/lib/config";
import { Search as SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function UploadPage() {
  const router = useRouter();
  const { show } = useToast();

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
      const res = await apiCall(`${API_BASE_URL}/api/policies/search?policy_number=${encodeURIComponent(query)}`, {
        method: "GET",
      });

      if (res.is401) {
        // Handle 401 error with toast
        show({ type: 'error', title: 'Session Expired', message: 'Your session has expired. Please login again.' });
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

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
      const res = await apiCall(`${API_BASE_URL}/api/claim/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policy_number: policyNumber
        })
      });

      if (res.is401) {
        show({ type: 'error', title: 'Session Expired', message: 'Your session has expired. Please login again.' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (!res.ok) throw new Error("Failed to create claim");
      const data = await res.json();
      setClaimId(data.claim_id);
      // Navigate to the dynamic route immediately
      router.push(`/upload/${data.claim_id}`);
    } catch (err: any) {
      setClaimCreateError(err?.message || "Error creating claim");
    } finally {
      // Keep button disabled until navigation
      setClaimCreateLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-5xl mx-auto mt-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center">
            {/* Progress bar with 6 steps */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black">1</div>
              <span className="text-xs font-medium text-black">Policy</span>
            </div>
            <div className="h-1 bg-black flex-1 mx-2" />
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
            <div className="flex flex-col items-center flex-1">
              <span className={`text-xs font-medium text-gray-400`}>Results</span>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="min-h-screen bg-gray-50 py-6">
          {/* Step 1: Policy Search first */}
          <div className="w-full max-w-5xl mx-auto px-4">
            {/* Phase 1: Policy Search */}
            {!detailsUnlocked && (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto mt-6">
                <div className="bg-white rounded-xl shadow p-8">
                  <h3 className="text-lg font-semibold mb-4">Search Policy Number</h3>
                  <p className="text-sm text-gray-500 mb-6">Enter your policy number to fetch vehicle and policy details.</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Enter policy number"
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-3 bg-white text-base"
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
                      className={`px-6 py-3 rounded-lg font-semibold transition cursor-pointer ${
                        policyLookupLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-900 active:bg-black focus:bg-black'
                      }`}
                    >
                      <span className="inline-flex items-center"><SearchIcon className="w-4 h-4 mr-2" />Search</span>
                    </button>
                  </div>
                  {policyLookupLoading && (
                    <div className="mt-4 text-sm text-gray-500">Searching...</div>
                  )}
                  {policyLookupError && !policyLookupLoading && (
                    <div className="mt-4 text-sm text-red-600">{policyLookupError}</div>
                  )}
                </div>
              </div>
            )}

            {/* Phase 2: Policy Details + Vehicle Info */}
            {detailsUnlocked && (
              <div className="space-y-8 mt-12">
                {/* Policy Details */}
                <div className="bg-white rounded-xl shadow p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center">
                      Policy Details
                    </h3>
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-black border border-gray-300">Verified</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {policyDetails && (
                      <>
                        {[{label:'Policy Number', value: policyDetails?.policyNumber ?? ""},{label:'Insurer', value: policyDetails?.insurer ?? ""},{label:'Plan', value: policyDetails?.plan ?? ""},{label:'Coverage', value: policyDetails?.coverage ?? ""},{label:'Effective From', value: policyDetails?.effectiveFrom ?? ""},{label:'Effective To', value: policyDetails?.effectiveTo ?? ""},{label:'Status', value: policyDetails?.status ?? ""}].map((f)=> (
                          <div key={f.label}>
                            <label className="block text-sm font-medium mb-2">{f.label}</label>
                            <input value={f.value} readOnly tabIndex={0} className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 cursor-text text-base" />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-white rounded-xl shadow p-8">
                  <h3 className="text-lg font-semibold mb-6">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[{label:'Make',value:vehicleDetails.make},{label:'Model',value:vehicleDetails.model},{label:'Year',value:vehicleDetails.year},{label:'License Plate',value:vehicleDetails.licensePlate},{label:'VIN',value:vehicleDetails.vin}].map((f)=> (
                      <div key={f.label}>
                        <label className="block text-sm font-medium mb-2">{f.label}</label>
                        <input value={f.value} readOnly tabIndex={0} className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 cursor-text text-base" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 active:bg-black focus:bg-black transition cursor-pointer text-base"
                    onClick={createClaim}
                    disabled={claimCreateLoading}
                  >
                    {claimCreateLoading ? "Creating Claim..." : "Continue to License Details"}
                  </button>
                </div>
                {claimCreateError && (
                  <div className="mt-6 text-sm text-red-600">{claimCreateError}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
