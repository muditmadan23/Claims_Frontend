import { AlertCircle } from "lucide-react";

interface Damage {
  part: string;
  reason: string;
  cost?: number;
}

interface DoubtfulDamagesCardProps {
  damages: Damage[];
}

export default function DoubtfulDamagesCard({ damages }: DoubtfulDamagesCardProps) {
  console.log("DoubtfulDamagesCard received damages:", damages);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
        </div>
        <h3 className="text-sm font-semibold text-yellow-700">Doubtful Damages</h3>
      </div>
      <div className="space-y-2.5">
        {damages.length > 0 ? (
          damages.map((damage, index) => (
            <div key={index} className="group relative flex items-center justify-between text-sm hover:bg-gray-50 rounded-md px-2 py-1.5 transition">
              <p className="text-sm text-gray-800">{damage.part}</p>
              {damage.cost && (
                <span className="text-sm font-semibold text-gray-900">
                  ${damage.cost.toFixed(2)}
                </span>
              )}
              <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block w-max max-w-xs">
                <div className="bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs text-gray-700">
                  {damage.reason}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No doubtful damages.</p>
        )}
      </div>
    </div>
  );
}
