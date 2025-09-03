"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import VehicleInformationCard from "@/components/VehicleInformationCard";
import ClaimTimeline from "@/components/ClaimTimeline";
import MatchedDamagesCard from "../components/MatchedDamagesCard";
import DoubtfulDamagesCard from "../components/DoubtfulDamagesCard";
import RejectedClaimsCard from "../components/RejectedClaimsCard";
import InterpretedDamagesSection from "../components/InterpretedDamagesSection";
import UploadedImagesSection from "../components/UploadedImagesSection";
import SummaryCard from "../components/SummaryCard";
import AssessmentSummaryCard from "../components/AssessmentSummaryCard";
import { Download, Share2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

interface CategorizedParts {
  relevant_damages: { part: string; reason: string }[];
  doubtful_damages: { part: string; reason: string }[];
  rejected_parts: { part: string; reason: string }[];
}

interface DamageDetail {
  part: string;
  reason: string;
}

interface AnalysisHistory {
  id: number;
  created_at: string;
  analysis_type: string;
  has_front_image: boolean;
  has_back_image: boolean;
  has_left_image: boolean;
  has_right_image: boolean;
  front_damage_details: DamageDetail[] | null;
  back_damage_details: DamageDetail[] | null;
  left_damage_details: DamageDetail[] | null;
  right_damage_details: DamageDetail[] | null;
  analysis_summary: string | null;
}

interface FinalReport {
  summary: string;
  consistency_check: string;
  categorized_parts: CategorizedParts;
}

interface ClaimData {
  claim: {
    claim_id: string;
    created_at: string;
    status: string;
    claim_story?: string;
    policy_id?: number;
    final_report?: {
      summary: string;
      consistency_check: string;
      categorized_parts: CategorizedParts;
    } | null;
  };
  driving_license: {
    name: string;
    dl_number: string;
    date_of_birth: string;
    address?: string;
    blood_group?: string;
    emergency_contact_number?: string;
  };
  policy: {
    insurer: string;
    policy_number: string;
    coverage: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    license_plate: string;
    plan?: string;
    status?: string;
    effective_from?: string;
    effective_to?: string;
  };
  image_analysis?: {
    front_damage_details: string;
    back_damage_details: string;
    left_damage_details: string;
    right_damage_details: string | null;
  };
  estimate_parts?: any[];
  final_report?: {
    summary: string;
    consistency_check: string;
    categorized_parts: CategorizedParts;
  };
}

export default function UploadResultPage() {
  const params = useParams();
  const claimId = params.claimId as string;
  
  console.log("Claim ID from URL:", claimId);
  const [report, setReport] = useState<FinalReport | null>(null);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAllClaimsData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        // Fetch all claims data
        const res = await fetch(`${API_BASE_URL}/api/claim/my-claims-joined`, {
          method: "GET",
          headers: {
            "accept": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch claims data");
        const claimsData: ClaimData[] = await res.json();

        // Find the specific claim by claimId
        const specificClaim = claimsData.find(claim => claim.claim.claim_id === claimId);

        if (!specificClaim) {
          throw new Error(`Claim with ID ${claimId} not found`);
        }

        // Set the claim data
        setClaimData(specificClaim);

        // Set the final report if it exists
        if (specificClaim.final_report) {
          setReport(specificClaim.final_report);
        }

        // Set analysis history from image_analysis if available
        if (specificClaim.image_analysis) {
          const analysisHistoryItem: AnalysisHistory = {
            id: 1,
            created_at: specificClaim.claim.created_at,
            analysis_type: "vehicle_damage",
            has_front_image: true,
            has_back_image: true,
            has_left_image: true,
            has_right_image: false,
            front_damage_details: specificClaim.image_analysis.front_damage_details ? JSON.parse(specificClaim.image_analysis.front_damage_details) : null,
            back_damage_details: specificClaim.image_analysis.back_damage_details ? JSON.parse(specificClaim.image_analysis.back_damage_details) : null,
            left_damage_details: specificClaim.image_analysis.left_damage_details ? JSON.parse(specificClaim.image_analysis.left_damage_details) : null,
            right_damage_details: specificClaim.image_analysis.right_damage_details ? JSON.parse(specificClaim.image_analysis.right_damage_details || "[]") : null,
            analysis_summary: null
          };
          setAnalysisHistory([analysisHistoryItem]);
        }

      } catch (err: any) {
        console.error("Error fetching claims data:", err);
        setError(err?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (claimId) {
      fetchAllClaimsData();
    }
  }, [claimId]);

  // Combine all damage details for InterpretedDamagesSection
  const getCombinedDamages = () => {
    const combined: {
      front: DamageDetail[];
      back: DamageDetail[];
      left: DamageDetail[];
      right: DamageDetail[];
    } = {
      front: [],
      back: [],
      left: [],
      right: []
    };
    
    analysisHistory.forEach(analysis => {
      if (analysis.front_damage_details) {
        combined.front.push(...analysis.front_damage_details);
      }
      if (analysis.back_damage_details) {
        combined.back.push(...analysis.back_damage_details);
      }
      if (analysis.left_damage_details) {
        combined.left.push(...analysis.left_damage_details);
      }
      if (analysis.right_damage_details) {
        combined.right.push(...analysis.right_damage_details);
      }
    });
    
    return combined;
  };

  const combinedDamages = getCombinedDamages();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-12">
        {/* Progress bar with 5 steps, last step is Results */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>1</div>
                <span className={`text-xs font-medium text-black`}>Details</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>2</div>
                <span className={`text-xs font-medium text-black`}>Upload Images</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>3</div>
                <span className={`text-xs font-medium text-black`}>Claim Form</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>4</div>
                <span className={`text-xs font-medium text-black`}>Estimate Copy</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>5</div>
                <span className={`text-xs font-medium text-black`}>Results</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
          {/* Left: Vehicle Information */}
          <div className="flex-1 min-w-0">
            <VehicleInformationCard 
              drivingLicense={claimData?.driving_license}
              policy={claimData?.policy}
            />
          </div>
          {/* Right: Timeline */}
          <div className="w-[361px] flex-shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <button className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-black px-2.5 py-1.5 border border-gray-200 rounded-md bg-white shadow-sm cursor-pointer">
                <Share2 className="w-4 h-4" />
                Share PDF Report
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-black px-2.5 py-1.5 border border-gray-200 rounded-md bg-white shadow-sm cursor-pointer">
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>
            </div>
            <ClaimTimeline />
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <UploadedImagesSection claimId={claimId} />
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <InterpretedDamagesSection damageDetails={combinedDamages} />
        </div>
        <div className="mt-6 w-full flex justify-center px-4">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <MatchedDamagesCard damages={report?.categorized_parts.relevant_damages || []} />
            <DoubtfulDamagesCard damages={report?.categorized_parts.doubtful_damages || []} />
            <RejectedClaimsCard damages={report?.categorized_parts.rejected_parts || []} />
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><SummaryCard summary={report?.summary || ""} consistencyCheck={report?.consistency_check || ""} /></div>
              <div><AssessmentSummaryCard /></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
