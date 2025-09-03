interface SummaryCardProps {
  summary: string;
  consistencyCheck: string;
}

export default function SummaryCard({ summary, consistencyCheck }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Summary</h3>
      <p className="text-sm leading-6 text-gray-600 mb-4">
        {summary || "No summary available."}
      </p>
      <p className="text-sm leading-6 text-gray-600">
        {consistencyCheck || "No consistency check available."}
      </p>
    </div>
  );
}
