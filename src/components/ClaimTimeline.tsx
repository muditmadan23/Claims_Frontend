import { Check } from "lucide-react";
import React from "react";

const formatDateTime = (isoString?: string) => {
  if (!isoString) return "Not available";
  const utcDate = new Date(isoString);
  const istDate = new Date(utcDate.getTime() + (5 * 60 + 30) * 60 * 1000);
  return istDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function ClaimTimeline() {
  // Hardcoded for now
  const timelineItems = [
    {
      title: "Uploaded Documents",
      timestamp: formatDateTime(new Date().toISOString()),
      color: "bg-blue-500",
      completed: true
    },
    {
      title: "AI Analysis Completed",
      timestamp: formatDateTime(new Date(Date.now() + 60000).toISOString()),
      color: "bg-green-500",
      completed: true
    }
  ];

  return (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-[361px]">
      <h3 className="text-base font-poppins font-normal text-gray-900 mb-6">Claim Timeline</h3>
      <div className="relative">
        <div className="absolute left-[9px] top-[10px] w-px bg-gray-200" style={{ height: `${(timelineItems.length - 1) * 44}px` }}></div>
        {timelineItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-2.5 pb-4 last:pb-0 relative">
            <div className={`relative z-10 w-5 h-5 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
              {item.completed && (
                <Check className="w-2.5 h-2.5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-medium text-gray-800 font-poppins">{item.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-poppins">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
