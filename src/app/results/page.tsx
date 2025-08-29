"use client";
import Navbar from "@/components/Navbar";
import VehicleInformationCard from "@/components/VehicleInformationCard";
import ClaimTimeline from "@/components/ClaimTimeline";
import MatchedDamagesCard from "./components/MatchedDamagesCard";
import DoubtfulDamagesCard from "./components/DoubtfulDamagesCard";
import RejectedClaimsCard from "./components/RejectedClaimsCard";
import InterpretedDamagesSection from "./components/InterpretedDamagesSection";
import SummaryCard from "./components/SummaryCard";
import AssessmentSummaryCard from "./components/AssessmentSummaryCard";
import { Download, Share2 } from "lucide-react";

export default function UploadResultPage() {
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
            <VehicleInformationCard />
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
          <InterpretedDamagesSection />
        </div>
        <div className="mt-6 w-full flex justify-center px-4">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <MatchedDamagesCard />
            <DoubtfulDamagesCard />
            <RejectedClaimsCard />
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><SummaryCard /></div>
              <div><AssessmentSummaryCard /></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
