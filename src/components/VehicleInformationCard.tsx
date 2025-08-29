import React from "react";

export default function VehicleInformationCard() {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-gray-100 w-full">
      <div className="flex items-center mb-4">
        <h2 className="text-base font-poppins font-normal text-gray-900">Vehicle Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Make</div>
          <div className="font-semibold text-sm font-poppins text-gray-800">Toyota</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Model</div>
          <div className="font-semibold text-sm font-poppins text-gray-800">Camry</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Year</div>
          <div className="font-semibold text-sm font-poppins text-gray-800">2022</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">VIN</div>
          <div className="font-semibold text-sm font-poppins text-gray-800">JT1BM2K3XN1001234</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Policy Number</div>
          <div className="font-semibold text-sm font-poppins text-gray-800">CP-12345-6789</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Claim ID</div>
          <div className="font-semibold text-sm font-poppins text-gray-800">CLM-2023-98765</div>
        </div>
      </div>
    </div>
  );
}
