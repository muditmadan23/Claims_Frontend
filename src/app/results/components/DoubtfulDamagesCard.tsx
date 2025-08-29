import { AlertCircle } from "lucide-react";

export default function DoubtfulDamagesCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
        </div>
        <h3 className="text-sm font-semibold text-yellow-700">Doubtful Damages</h3>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-800"><span className="font-medium">Part:</span> Rear Door</p>
            <p className="text-sm font-semibold text-gray-900">$450.00</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Damage: Minor paint chip</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-800"><span className="font-medium">Part:</span> Right Taillight</p>
            <p className="text-sm font-semibold text-gray-900">$250.00</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Damage: Scuff mark</p>
        </div>
      </div>
    </div>
  );
}
