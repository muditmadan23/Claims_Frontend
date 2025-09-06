interface Damage {
  part: string;
  reason: string;
  cost?: number;
}

interface AssessmentSummaryCardProps {
  damages: Damage[];
}

export default function AssessmentSummaryCard({ damages }: AssessmentSummaryCardProps) {
  const partsCost = damages.reduce((total, damage) => total + (damage.cost || 0), 0);
  const laborCost = damages.length * 50;
  const miscellaneousCosts = damages.length * 20;
  const totalCost = partsCost + laborCost + miscellaneousCosts;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-4">
        <h3 className="text-base font-semibold text-gray-900">Assessment Summary</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5">Labor Cost</div>
          <div className="text-sm font-semibold text-gray-900">${laborCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5">Parts Cost</div>
          <div className="text-sm font-semibold text-gray-900">${partsCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5">Miscellaneous Costs</div>
          <div className="text-sm font-semibold text-gray-900">${miscellaneousCosts.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-gray-500 mb-0.5">Claim Owner</div>
          <div className="text-sm font-semibold text-gray-900">John Doe</div>
        </div>
      </div>
      <div className="my-4 h-px bg-gray-200" />
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-900">Total Estimated Cost</div>
        <div className="text-sm font-semibold text-primary-blue">${totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
}
