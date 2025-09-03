import { Check } from "lucide-react";
import React from "react";

const formatDateTime = (isoString?: string) => {
  if (!isoString) return "Not available";
  // The API already returns IST, so just format for display
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export interface TimelineItem {
  title: string;
  timestamp?: string;
  color?: string;
  completed?: boolean;
}

interface ClaimTimelineProps {
  timeline: TimelineItem[];
}

export default function ClaimTimeline({ timeline }: ClaimTimelineProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-[361px]">
      <h3 className="text-base font-poppins font-normal text-gray-900 mb-4">Claim Timeline</h3>
      <div className="relative">
        <div className="absolute left-[9px] top-[10px] w-px bg-gray-200" style={{ height: `${(timeline.length - 1) * 44}px` }}></div>
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start space-x-2.5 pb-3 last:pb-0 relative">
            <div className={`relative z-10 w-5 h-5 ${item.color || 'bg-gray-300'} rounded-full flex items-center justify-center flex-shrink-0`}>
              {item.completed && (
                <Check className="w-2.5 h-2.5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-medium text-gray-800 font-poppins">{item.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-poppins">{item.timestamp ? formatDateTime(item.timestamp) : 'Not available'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
