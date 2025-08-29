import { XCircle } from "lucide-react";

export default function RejectedClaimsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="text-sm font-semibold text-red-700">Rejected Claims</h3>
      </div>
      <div>
        <div className="flex items-start justify-between">
          <p className="text-sm text-gray-800"><span className="font-medium">Part:</span> Roof</p>
          <p className="text-sm font-semibold text-gray-900">$900.00</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">Damage: Hail damage (policy exclusion)</p>
      </div>
    </div>
  );
}
