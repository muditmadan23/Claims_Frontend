"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import FadedTextLoader from "@/components/FadedTextLoader";
import { API_BASE_URL } from "@/lib/config";
import { Shield, Search as SearchIcon, FileText } from "lucide-react";

export default function UploadPageWithClaimId() {
  const router = useRouter();
  const params = useParams();
  const claimId = params.claimId as string;

  const [step, setStep] = useState(2);
  const [images, setImages] = useState<{ [k: string]: File | null }>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [licenseExtractLoading, setLicenseExtractLoading] = useState(false);
  const [licenseExtractError, setLicenseExtractError] = useState<string>("");
  const [licenseForm, setLicenseForm] = useState<{
    dlNumber: string;
    issueDate: string;
    name: string;
    dob: string;
    relation: string;
    address: string;
    validityNonTransport: string;
    bloodGroup: string;
    organDonor: string;
    firstIssueDate: string;
    covCode: string;
    licensingAuthority: string;
    issuedBy: string;
    emergencyContact: string;
  } | null>(null);
  const [licenseSubmitLoading, setLicenseSubmitLoading] = useState(false);
  const [licenseSubmitError, setLicenseSubmitError] = useState<string>("");
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

  // Hardcoded driver details
  const [driverDetails, setDriverDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    licenseState: ""
  });

  // Vehicle details state for API response
  const [vehicleDetails, setVehicleDetails] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: ""
  });

  // Estimate copy extraction logic
  // Analyze images API call
    const analyzeImages = async () => {
    setAiPartsLoading(true);
    setAiPartsError("");
    try {
      const formData = new FormData();
      formData.append("claim_id", claimId);
      if (images.front) formData.append("front_image", images.front);
      if (images.back) formData.append("back_image", images.back);
      if (images.left) formData.append("left_image", images.left);
      if (images.right) formData.append("right_image", images.right);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/api/analyze-images/`, {
        method: "POST",
        headers: {
          'accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
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
      formData.append("claim_id", claimId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/api/docs/extract-estimate-parts`, {
        method: "POST",
        headers: {
          'accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
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
  };  const handleEstimateCopyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEstimateCopy(file);
    if (!file) return;
    await extractEstimateParts(file);
  };

  const handleClaimFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setClaimForm(file);
    if (file) {
      extractClaimStory(file);
    }
  };

  const handleImageChange = (side: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImages((prev) => ({ ...prev, [side]: file }));
  };

  const fileToDataURL = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const saveImagesToLocalStorage = async () => {
    try {
      const payload: any = {};
      const sides: (keyof typeof images)[] = ["front", "back", "left", "right"];
      for (const s of sides) {
        const f = images[s];
        if (f) {
          payload[s] = await fileToDataURL(f as File);
        }
      }
      localStorage.setItem(`claim_images_${claimId}`, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  };

  const extractLicenseDetails = async (file: File) => {
    setLicenseExtractLoading(true);
    setLicenseExtractError("");
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch(`${API_BASE_URL}/api/dl/extract`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract license details");
      const data = await res.json();
      
      // Extract name parts
      const fullName = data["Name"] || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Update driver details from extracted data
      setDriverDetails({
        firstName: firstName,
        lastName: lastName,
        email: "", // Keep empty as it's not in license
        phone: data["Emergency Contact Number"] || "",
        dob: data["Date of Birth"] || "",
        licenseState: data["Licensing Authority"] || ""
      });
      
      setLicenseForm({
        dlNumber: data["DL Number"] || "",
        issueDate: data["Issue Date"] || "",
        name: data["Name"] || "",
        dob: data["Date of Birth"] || "",
        relation: data["Relation (Son/Daughter/Wife of)"] || "",
        address: data["Address"] || "",
        validityNonTransport: data["Validity (Non-Transport)"] || "",
        bloodGroup: data["Blood Group"] || "",
        organDonor: data["Organ Donor"] || "",
        firstIssueDate: data["Date of First Issue"] || "",
        covCode: data["Class of Vehicle Code"] || "",
        licensingAuthority: data["Licensing Authority"] || "",
        issuedBy: data["Issued By"] || "",
        emergencyContact: data["Emergency Contact Number"] || "",
      });
    } catch (err: any) {
      setLicenseExtractError(err?.message || "Error extracting license details");
    } finally {
      setLicenseExtractLoading(false);
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLicenseImage(file);
    if (file) {
      extractLicenseDetails(file);
    }
  };

  const submitLicenseData = async () => {
    if (!licenseForm) return;
    
    setLicenseSubmitLoading(true);
    setLicenseSubmitError("");

    // Validate required fields
    if (!licenseForm.dlNumber?.trim()) {
      setLicenseSubmitError("DL Number is required");
      setLicenseSubmitLoading(false);
      return;
    }
    if (!licenseForm.name?.trim()) {
      setLicenseSubmitError("Name is required");
      setLicenseSubmitLoading(false);
      return;
    }
    if (!licenseForm.address?.trim()) {
      setLicenseSubmitError("Address is required");
      setLicenseSubmitLoading(false);
      return;
    }
    if (!licenseForm.licensingAuthority?.trim()) {
      setLicenseSubmitError("Licensing Authority is required");
      setLicenseSubmitLoading(false);
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const dateFields = [
      { field: licenseForm.issueDate, name: 'Issue Date' },
      { field: licenseForm.dob, name: 'Date of Birth' },
      { field: licenseForm.validityNonTransport, name: 'Validity (Non-Transport)' },
      { field: licenseForm.firstIssueDate, name: 'Date of First Issue' }
    ];

    for (const { field, name } of dateFields) {
      if (field && !dateRegex.test(field)) {
        setLicenseSubmitError(`${name} must be in YYYY-MM-DD format (e.g., 2023-01-01)`);
        setLicenseSubmitLoading(false);
        return;
      }
    }
    
    try {
      const licenseData = {
        claim_id: claimId,
        dl_number: licenseForm.dlNumber,
        issue_date: licenseForm.issueDate,
        name: licenseForm.name,
        date_of_birth: licenseForm.dob,
        relation: licenseForm.relation,
        address: licenseForm.address,
        validity_non_transport: licenseForm.validityNonTransport,
        blood_group: licenseForm.bloodGroup,
        organ_donor: licenseForm.organDonor,
        date_of_first_issue: licenseForm.firstIssueDate,
        class_of_vehicle_code: licenseForm.covCode,
        licensing_authority: licenseForm.licensingAuthority,
        issued_by: licenseForm.issuedBy,
        emergency_contact_number: licenseForm.emergencyContact,
      };

      const token = localStorage.getItem('authToken');

      const res = await fetch(`${API_BASE_URL}/api/dl/driving-license`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(licenseData),
      });

      if (!res.ok) throw new Error("Failed to submit license data");

      // On success, proceed to next step
      setStep(3);
    } catch (err: any) {
      setLicenseSubmitError(err?.message || "Error submitting license data");
    } finally {
      setLicenseSubmitLoading(false);
    }
  };

  const extractClaimStory = async (file: File) => {
    setClaimLoading(true);
    setClaimError("");
    setClaimStory("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("claim_id", claimId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/api/docs/extract/claim-story`, {
        method: "POST",
        headers: {
          'accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract claim story");
      const data = await res.json();
      const story = data?.claim_story?.trim?.() || "";
      setClaimStory(story);
    } catch (err: any) {
      setClaimError(err?.message || "Error extracting claim story");
    } finally {
      setClaimLoading(false);
    }
  };

  const callSummaryApis = async () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      "accept": "application/json",
      "Content-Type": "application/json",
      'Authorization': token ? `Bearer ${token}` : '',
    };
    const body = JSON.stringify({ claim_id: claimId });

    const apis = [
      `${API_BASE_URL}/api/generate-summary/`,
      `${API_BASE_URL}/api/check-consistency/`,
      `${API_BASE_URL}/api/categorize-parts/`,
    ];

    for (const url of apis) {
      try {
        const res = await fetch(url, { method: "POST", headers, body });
        if (!res.ok) {
          console.error(`API call to ${url} failed with status ${res.status}`);
        }
      } catch (e) {
        console.error(`Error calling ${url}:`, e);
      }
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-green-600`}>1</div>
              <span className={`text-xs font-medium text-green-600`}>Policy</span>
            </div>
            <div className={`h-1 bg-green-600 flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200 text-black'}`}>2</div>
              <span className={`text-xs font-medium ${step === 2 ? 'text-black' : 'text-gray-400'}`}>License</span>
            </div>
            <div className={`h-1 ${(step > 2) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 3 ? 'bg-black' : 'bg-gray-200 text-black'}`}>3</div>
              <span className={`text-xs font-medium ${step === 3 ? 'text-black' : 'text-gray-400'}`}>Images</span>
            </div>
            <div className={`h-1 ${(step > 3) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 4 ? 'bg-black' : 'bg-gray-200 text-black'}`}>4</div>
              <span className={`text-xs font-medium ${step === 4 ? 'text-black' : 'text-gray-400'}`}>Claim</span>
            </div>
            <div className={`h-1 ${(step > 4) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step >= 5 ? 'bg-black' : 'bg-gray-200 text-black'}`}>5</div>
              <span className={`text-xs font-medium ${step === 5 ? 'text-black' : 'text-gray-400'}`}>Estimate</span>
            </div>
            <div className={`h-1 ${(step > 5) ? 'bg-black' : 'bg-gray-200'} flex-1 mx-2`} />
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${step === 6 ? 'bg-black' : 'bg-gray-200 text-black'}`}>6</div>
              <span className={`text-xs font-medium ${step === 6 ? 'text-black' : 'text-gray-400'}`}>Results</span>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="min-h-screen bg-gray-50">
          {/* Step 2: License Upload + Details */}
          {step === 2 && (
            <div className="w-full max-w-5xl mx-auto">
              <div className="space-y-6">
                {/* License Upload Section - Full Width */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold mb-2">Upload Driving License</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload a clear photo or scan of the driver's license to fetch details.</p>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center">
                    <div className="font-semibold text-gray-700 mb-1">Drag & drop your file here</div>
                    <div className="text-xs text-gray-400 mb-4">or click to browse</div>
                    <label>
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleLicenseChange} />
                      <div className="bg-gray-100 rounded px-4 py-2 text-center font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition">Browse Files</div>
                    </label>
                    {licenseImage && <div className="mt-4 text-sm text-green-600">{licenseImage.name}</div>}
                  </div>
                  {licenseExtractError && !licenseExtractLoading && (
                    <div className="mt-4 border border-red-200 bg-red-50 text-red-700 rounded p-4 flex items-start justify-between">
                      <div className="text-sm">{licenseExtractError}</div>
                      {licenseImage ? (
                        <button type="button" className="ml-4 px-3 py-1.5 rounded bg-black text-white hover:bg-gray-900 transition" onClick={() => extractLicenseDetails(licenseImage as File)}>Retry</button>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* License Details Section - Underneath */}
                {(licenseImage || licenseExtractLoading) && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Driver & License Details</h3>
                    
                    {/* Show loader while fetching data */}
                    {licenseExtractLoading && (
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-3">Extracting license details...</div>
                        <FadedTextLoader lines={5} className="max-w-4xl" />
                      </div>
                    )}
                    
                    {/* Show error if any */}
                    {licenseExtractError && !licenseExtractLoading && (
                      <div className="mb-4 border border-red-200 bg-red-50 text-red-700 rounded p-4">
                        <div className="text-sm">{licenseExtractError}</div>
                      </div>
                    )}
                    
                    {/* License Information */}
                    {(!licenseExtractLoading && licenseForm) && (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {key:'name',label:'Full Name'},
                            {key:'dlNumber',label:'DL Number'},
                            {key:'issueDate',label:'Issue Date'},
                            {key:'dob',label:'Date of Birth'},
                            {key:'relation',label:'Relation'},
                            {key:'address',label:'Address'},
                            {key:'validityNonTransport',label:'Validity'},
                            {key:'bloodGroup',label:'Blood Group'},
                            {key:'organDonor',label:'Organ Donor'},
                            {key:'firstIssueDate',label:'First Issue'},
                            {key:'covCode',label:'Vehicle Code'},
                            {key:'licensingAuthority',label:'Authority'},
                            {key:'issuedBy',label:'Issued By'},
                            {key:'emergencyContact',label:'Emergency Contact'}
                          ].map((f)=> (
                            <div key={f.key}>
                              <label className="block text-sm font-medium mb-1">{f.label}</label>
                              <input
                                value={(licenseForm as any)[f.key] || ''}
                                onChange={(e) => setLicenseForm((prev) => ({ ...(prev as any), [f.key]: e.target.value }))}
                                className="w-full border border-gray-200 rounded px-3 py-2 bg-white text-gray-800"
                                disabled={licenseExtractLoading}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  {licenseSubmitError && (
                    <div className="mr-4 border border-red-200 bg-red-50 text-red-700 rounded p-4 flex items-start">
                      <div className="text-sm">{licenseSubmitError}</div>
                    </div>
                  )}
                  <button
                    type="button"
                    className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-900 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={submitLicenseData}
                    disabled={licenseExtractLoading || !licenseForm || licenseSubmitLoading}
                  >
                    {licenseSubmitLoading ? "Submitting..." : "Continue to Upload Images"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Car Images */}
          {step === 3 && (
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
                  onClick={async () => {
                    await saveImagesToLocalStorage();
                    setStep(4);
                    analyzeImages();
                  }}
                  type="button"
                >Next</button>
              </div>
            </div>
          )}


          {/* Step 4: Upload Claim Form */}
          {step === 4 && (
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
                        <button className="px-8 py-3 rounded font-semibold transition bg-black text-white hover:bg-gray-900 cursor-pointer" onClick={() => setStep(5)} type="button">Continue</button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {/* Step 5: Upload Estimate Copy */}
          {step === 5 && (
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
                            setStep(6);
                            // Save aiParts to localStorage for results page
                            // Removed as per request
                            setTimeout(() => {
                              setSubmitting(false);
                              router.push(`/results/${claimId}`);
                              callSummaryApis();
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

          {/* Step 6: Submission Progress Bar */}
          {step === 6 && (
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
        </div>
      </main>
    </>
  );
}
