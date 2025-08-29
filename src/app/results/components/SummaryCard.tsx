export default function SummaryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Summary</h3>
      <p className="text-sm leading-6 text-gray-600">
        The AI vehicle inspection report indicates a comprehensive assessment of the vehicle's exterior condition. Minor damage was
        identified on the front bumper and left front door, characterized by surface scratches and small indentations. All other major
        components across the left, right, and rear sections appear to be intact with no significant defects detected. The system utilized
        advanced image recognition and 3D modeling to analyze high‑resolution photographs, providing a detailed and accurate breakdown of
        each part's status for a precise repair estimate.
      </p>
    </div>
  );
}
