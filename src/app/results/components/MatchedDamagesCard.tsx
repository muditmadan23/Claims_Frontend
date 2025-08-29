import { CheckCircle } from "lucide-react";

export default function MatchedDamagesCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="text-sm font-semibold text-green-700">Matched Damages</h3>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-800"><span className="font-medium">Part:</span> Front Bumper</p>
            <p className="text-sm font-semibold text-gray-900">$800.00</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Damage: Scratches, minor dent</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-800"><span className="font-medium">Part:</span> Left Headlight</p>
            <p className="text-sm font-semibold text-gray-900">$1,200.00</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Damage: Cracked housing</p>
        </div>
      </div>
    </div>
  );
}
