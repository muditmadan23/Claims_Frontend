import React from "react";

interface VehicleInformationCardProps {
  drivingLicense?: {
    name?: string;
    dl_number?: string;
    date_of_birth?: string;
  };
  policy?: {
    insurer?: string;
    policy_number?: string;
    coverage?: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
    license_plate?: string;
  };
}

export default function VehicleInformationCard({ drivingLicense, policy }: VehicleInformationCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-gray-100 w-full">
      <div className="flex items-center mb-4">
        <h2 className="text-base font-poppins font-normal text-gray-900">Vehicle and Policy Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3 text-gray-700">
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Driver Name</div>
          <div className={`text-sm font-poppins ${drivingLicense?.name ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {drivingLicense?.name || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">DL Number</div>
          <div className={`text-sm font-poppins ${drivingLicense?.dl_number ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {drivingLicense?.dl_number || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Date of Birth</div>
          <div className={`text-sm font-poppins ${drivingLicense?.date_of_birth ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {formatDate(drivingLicense?.date_of_birth)}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Policy Number</div>
          <div className={`text-sm font-poppins ${policy?.policy_number ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {policy?.policy_number || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Coverage</div>
          <div className={`text-sm font-poppins ${policy?.coverage ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {policy?.coverage || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Vehicle</div>
          <div className={`text-sm font-poppins ${(policy?.vehicle_make || policy?.vehicle_model) ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {policy?.vehicle_make && policy?.vehicle_model
              ? `${policy.vehicle_make} ${policy.vehicle_model}`
              : policy?.vehicle_make || policy?.vehicle_model || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">Year</div>
          <div className={`text-sm font-poppins ${policy?.vehicle_year ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {policy?.vehicle_year || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5 font-poppins">License Plate</div>
          <div className={`text-sm font-poppins ${policy?.license_plate ? 'font-semibold text-gray-800' : 'font-normal text-gray-600'}`}>
            {policy?.license_plate || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
