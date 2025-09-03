import React from "react";
import { Download } from "lucide-react";

interface Props {
  fileLabel?: string;
  onDownload?: () => void;
  className?: string;
}

export default function ExportSummaryCard({ fileLabel = "Summary Report", onDownload, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="inline-flex items-center rounded-md bg-red-500 text-white text-xs font-semibold px-2.5 py-1">PDF</span>
          <span className="ml-3 text-sm text-gray-700">{fileLabel}</span>
        </div>
        <button
          type="button"
          aria-label="Download summary report as PDF"
          onClick={onDownload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 hover:cursor-pointer transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
}
