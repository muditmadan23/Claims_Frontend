"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FadedTextLoader from "@/components/FadedTextLoader";
import { API_BASE_URL } from "@/lib/config";
import { Shield, Search as SearchIcon, FileText } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<{ [k: string]: File | null }>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
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
  const [claimForm, setClaimForm] = useState<File | null>(null);
  const [claimStory, setClaimStory] = useState<string>("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState<string>("");
  const [estimateCopy, setEstimateCopy] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState<string>("");
  const [extractedParts, setExtractedParts] = useState<string[]>([]);
  // AI Interpreted Parts state
  const [aiParts, setAiParts] = useState<any>(null);
  const [aiPartsLoading, setAiPartsLoading] = useState(false);
  const [aiPartsError, setAiPartsError] = useState<string>("");

  // Estimate copy extraction logic
  // Analyze images API call
  const analyzeImages = async () => {
    setAiPartsLoading(true);
    setAiPartsError("");
    try {
      const formData = new FormData();
      if (images.front) formData.append("front_image", images.front);
      if (images.back) formData.append("back_image", images.back);
      if (images.left) formData.append("left_image", images.left);
      if (images.right) formData.append("right_image", images.right);
      const res = await fetch("http://localhost:8000/api/analyze-images/", {
        method: "POST",
        headers: {
          // 'accept': 'application/json',
          // 'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to analyze images");
      const data = await res.json();
      setAiParts(data);
    } catch (err: any) {
      setAiPartsError(err?.message || "Error analyzing images");
    } finally {
      setAiPartsLoading(false);
    }
  };
  const extractEstimateParts = async (file: File) => {
    setEstimateLoading(true);
    setEstimateError("");
    setExtractedParts([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/api/docs/extract-estimate-parts`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract estimate parts");
      const data = await res.json();
      setExtractedParts(data?.extracted_parts || []);
    } catch (err: any) {
      setEstimateError(err?.message || "Error extracting estimate parts");
    } finally {
      setEstimateLoading(false);
    }
  };

  const handleEstimateCopyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEstimateCopy(file);
    if (!file) return;
    await extractEstimateParts(file);
  };

  // Hardcoded vehicle options
  const vehicleOptions = [
    {
      id: "1",
      name: "2020 Toyota Camry",
      make: "Toyota",
      model: "Camry",
      year: "2020",
      license: "ABC 123",
      vin: "1234XXXXXXXXDEF",
      policy: "POL1234567"
    },
    {
      id: "2",
      name: "2022 Honda CR-V",
      make: "Honda",
      model: "CR-V",
      year: "2022",
      license: "XYZ 789",
      vin: "FECXXXXXXX4321",
      policy: "POL7654321"
    },
    {
      id: "3",
      name: "2019 Ford F-150",
      make: "Ford",
      model: "F-150",
      year: "2019",
      license: "LMN 456",
      vin: "0987XXXXXXXDEF",
      policy: "POL2468101"
    },
  ];

  // Hardcoded driver details
  const driver = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@email.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-05-15",
    licenseState: "CA"
  };

  const selectedVehicle = useMemo(
    () => vehicleOptions.find((v) => v.id === selectedVehicleId),
    [selectedVehicleId]
  );

  const handleImageChange = (side: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImages((prev) => ({ ...prev, [side]: file }));
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLicenseImage(file);
  };

  const lookupPolicy = async () => {
    const query = policyNumber.trim();
    if (!query) return;
    setPolicyLookupLoading(true);
    setPolicyLookupError("");
    try {
      const defaultVehicleId = vehicleOptions[0]?.id || "";
      setSelectedVehicleId(defaultVehicleId);
      setPolicyDetails({
        insurer: "MotorProtect Insurance Co.",
        policyNumber: query,
        coverage: "Comprehensive",
        effectiveFrom: "2024-01-01",
        effectiveTo: "2024-12-31",
        status: "Active",
        plan: "Gold",
      });
      setDetailsUnlocked(true);
    } catch (err: any) {
      setPolicyLookupError(err?.message || "Error searching policy");
    } finally {
      setPolicyLookupLoading(false);
    }
  };

  const extractClaimStory = async (file: File) => {
    setClaimLoading(true);
    setClaimError("");
    setClaimStory("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/api/docs/extract/claim-story`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract claim story");
      const data = await res.json();
      const story = data?.claim_story?.trim?.() || "";
      if (story) {
        setClaimStory(story);
      } else {
        setClaimError("No claim story found in response.");
      }
    } catch (err: any) {
      setClaimError(err?.message || "Error extracting claim story");
    } finally {
      setClaimLoading(false);
    }
  };

  const handleClaimFormChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClaimForm(file);
    if (!file) return;
    await extractClaimStory(file);
  };

  const handleCopyStory = async () => {
    if (!claimStory) return;
    try {
      await navigator.clipboard.writeText(claimStory);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <main className="flex flex-col items-center py-8">
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center">
              {/* Progress bar with 5 steps, last step is Results */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 1 ? 'bg-black' : 'bg-gray-200 text-black'}`}>1</div>
                <span className={`text-xs font-medium ${step === 1 ? 'text-black' : 'text-gray-400'}`}>Details</span>
              </div>
              <div className={`h-1 ${(step > 1) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200 text-black'}`}>2</div>
                <span className={`text-xs font-medium ${step === 2 ? 'text-black' : 'text-gray-400'}`}>Upload Images</span>
              </div>
              <div className={`h-1 ${(step > 2) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 3 ? 'bg-black' : 'bg-gray-200 text-black'}`}>3</div>
                <span className={`text-xs font-medium ${step === 3 ? 'text-black' : 'text-gray-400'}`}>Claim Form</span>
              </div>
              <div className={`h-1 ${(step > 3) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 4 ? 'bg-black' : 'bg-gray-200 text-black'}`}>4</div>
                <span className={`text-xs font-medium ${step === 4 ? 'text-black' : 'text-gray-400'}`}>Estimate Copy</span>
              </div>
              <div className={`h-1 ${(step > 4) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step === 5 ? 'bg-black' : 'bg-gray-200 text-black'}`}>5</div>
                <span className={`text-xs font-medium ${step === 5 ? 'text-black' : 'text-gray-400'}`}>Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: License Upload + Policy Search, then locked details */}
        {step === 1 && (
          <div className="w-full max-w-5xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Upload Driving License</h3>
                <p className="text-sm text-gray-500 mb-4">Upload a clear photo or scan of the driver's license.</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center">
                  <div className="font-semibold text-gray-700 mb-1">Drag & drop your file here</div>
                  <div className="text-xs text-gray-400 mb-4">or click to browse</div>
                  <label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleLicenseChange} />
                    <div className="bg-gray-100 rounded px-4 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">Browse Files</div>
                  </label>
                  {licenseImage && <div className="mt-4 text-sm text-green-600">{licenseImage.name}</div>}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Search Policy Number</h3>
                <p className="text-sm text-gray-500 mb-4">Enter the policy number and press Enter to fetch details.</p>
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
                    className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-900 transition cursor-pointer"
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

            {detailsUnlocked && licenseImage && selectedVehicle && (
              <div className="space-y-6 mt-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
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

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{label:'Make',value:selectedVehicle.make},{label:'Model',value:selectedVehicle.model},{label:'Year',value:selectedVehicle.year},{label:'License Plate',value:selectedVehicle.license},{label:'VIN',value:selectedVehicle.vin}].map((f)=> (
                      <div key={f.label}>
                        <label className="block text-sm font-medium mb-1">{f.label}</label>
                        <input value={f.value} readOnly tabIndex={0} className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700 cursor-text" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[{label:'First Name',value:driver.firstName},{label:'Last Name',value:driver.lastName},{label:'Email',value:driver.email},{label:'Phone',value:driver.phone},{label:'Date of Birth',value:driver.dob},{label:'License State',value:driver.licenseState}].map((f)=> (
                      <div key={f.label} className="relative">
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
                    onClick={() => setStep(2)}
                  >
                    Continue to Upload Images
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Upload Car Images */}
        {step === 2 && (
          <div className="w-full max-w-5xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'front', label: 'Front View', desc: "Upload a clear image of the car's front view." },
                { key: 'back', label: 'Back View', desc: "Upload a clear image of the car's back view." },
                { key: 'left', label: 'Left Side View', desc: "Upload a clear image of the car's left side view." },
                { key: 'right', label: 'Right Side View', desc: "Upload a clear image of the car's right side view." },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className={`bg-white rounded-xl border flex flex-col items-center shadow-sm transition-all duration-300 overflow-hidden ${images[key] ? 'p-4' : 'p-2'} ${images[key] ? '' : 'max-h-32'}`}
                  style={{ minHeight: images[key] ? 280 : 80 }}
                >
                  <div className={`w-full ${images[key] ? 'h-44 mb-4' : 'h-12 mb-2'} rounded overflow-hidden flex items-center justify-center bg-gray-100 transition-all duration-300`}>
                    {/* Show uploaded image in top area only after upload */}
                    {images[key] ? (
                      <img
                        src={URL.createObjectURL(images[key] as File)}
                        alt={label}
                        className="object-contain w-full max-h-44"
                      />
                    ) : null}
                  </div>
                  <div className="font-semibold text-base mb-1">{label}</div>
                  <div className="text-xs text-gray-500 mb-4 text-center">{desc}</div>
                  <label className="w-full">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange(key)} />
                    <div className="w-full bg-gray-100 rounded px-4 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">Upload</div>
                  </label>
                  {/* No preview below upload button */}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button
                className="bg-black text-white px-8 py-3 rounded font-semibold transition hover:cursor-pointer"
                onClick={() => {
                  setStep(3);
                  analyzeImages();
                }}
                type="button"
              >Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Claim Form */}

        {step === 3 && (
          <>
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow p-8">
                <h2 className="text-xl font-bold mb-2">Upload Claim Form</h2>
                <p className="text-gray-500 mb-6">Please upload your motor insurance claim form document. PDF or JPG format preferred.</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center mb-8">
                  <div className="font-semibold text-gray-700 mb-1">Drag & drop your file here</div>
                  <div className="text-xs text-gray-400 mb-4">or click to browse</div>
                  <label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleClaimFormChange} />
                    <div className="bg-gray-100 rounded px-4 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">Browse Files</div>
                  </label>
                  {claimForm && <div className="mt-4 text-sm text-green-600">{claimForm.name}</div>}
                </div>
              </div>
            </div>
            {/* Always render the claim story section as a separate div underneath the upload form when a file is selected or loading */}
            {(claimForm || claimLoading) && (
              <div className="w-full max-w-3xl mx-auto mt-8">
                <div className="bg-white rounded-xl shadow p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Claim Story</h3>
                      <p className="text-sm text-gray-500 mt-1">{claimLoading ? "Extracting from your document..." : claimStory ? "Review the extracted narrative below." : "The claim story will appear here after upload."}</p>
                    </div>
                    {/* Copy button removed as requested */}
                  </div>

                  {claimLoading && (
                    <div className="mt-6">
                      <FadedTextLoader lines={3} className="max-w-2xl" />
                    </div>
                  )}

                  {claimError && !claimLoading && (
                    <div className="mt-4 border border-red-200 bg-red-50 text-red-700 rounded p-4 flex items-start justify-between">
                      <div className="text-sm">{claimError}</div>
                      {claimForm ? (
                        <button type="button" className="ml-4 px-3 py-1.5 rounded bg-black text-white hover:bg-gray-900 transition" onClick={() => extractClaimStory(claimForm as File)}>Retry</button>
                      ) : null}
                    </div>
                  )}

                  {claimStory && !claimLoading && !claimError && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 leading-relaxed">
                      {claimStory}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    {claimStory && !claimLoading ? (
                      <button className="px-8 py-3 rounded font-semibold transition bg-black text-white hover:bg-gray-900 cursor-pointer" onClick={() => setStep(4)} type="button">Continue</button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 4: Upload Estimate Copy */}
        {step === 4 && (
          <>
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow p-8">
                <h2 className="text-xl font-bold mb-2">Upload Estimate Copy</h2>
                <p className="text-gray-500 mb-6">Please upload your estimate copy document. PDF or JPG format preferred.</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center mb-8">
                  <div className="font-semibold text-gray-700 mb-1">Drag & drop your file here</div>
                  <div className="text-xs text-gray-400 mb-4">or click to browse</div>
                  <label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.txt" className="hidden" onChange={handleEstimateCopyChange} />
                    <div className="bg-gray-100 rounded px-4 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">Browse Files</div>
                  </label>
                  {estimateCopy && <div className="mt-4 text-sm text-green-600">{estimateCopy.name}</div>}
                </div>
              </div>
            </div>
            {/* Always render the extracted parts section as a separate div underneath the upload form when a file is selected or loading */}
            {(estimateCopy || estimateLoading) && (
              <div className="w-full max-w-3xl mx-auto mt-8">
                <div className="bg-white rounded-xl shadow p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Extracted Parts</h3>
                      <p className="text-sm text-gray-500 mt-1">{estimateLoading ? "Extracting parts from your document..." : extractedParts.length ? "Review the extracted parts below." : "The extracted parts will appear here after upload."}</p>
                    </div>
                  </div>

                  {estimateLoading && (
                    <div className="mt-6">
                      <FadedTextLoader lines={3} className="max-w-2xl" />
                    </div>
                  )}

                  {estimateError && !estimateLoading && (
                    <div className="mt-4 border border-red-200 bg-red-50 text-red-700 rounded p-4 flex items-start justify-between">
                      <div className="text-sm">{estimateError}</div>
                      {estimateCopy ? (
                        <button type="button" className="ml-4 px-3 py-1.5 rounded bg-black text-white hover:bg-gray-900 transition" onClick={() => extractEstimateParts(estimateCopy as File)}>Retry</button>
                      ) : null}
                    </div>
                  )}

                  {extractedParts.length > 0 && !estimateLoading && !estimateError && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5">
                        {extractedParts.map((part, idx) => (
                          <li key={idx} className="py-1 text-base font-medium text-gray-700">{part}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    {extractedParts.length > 0 && !estimateLoading ? (
                      <button
                        className="px-8 py-3 rounded font-semibold transition bg-black text-white hover:bg-gray-900 cursor-pointer"
                        onClick={() => {
                          setSubmitting(true);
                          setStep(5);
                          // Save aiParts to localStorage for results page
                          if (aiParts) {
                            try {
                              localStorage.setItem("aiParts", JSON.stringify(aiParts));
                            } catch {}
                          }
                          setTimeout(() => {
                            setSubmitting(false);
                            router.push("/results");
                          }, 2000);
                        }}
                        type="button"
                      >Submit</button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Step 5: Submission Progress Bar */}
        {step === 5 && (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Submitting...</h2>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="text-gray-700 text-lg mt-4">Please wait while we process your submission.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
