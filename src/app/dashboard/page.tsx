"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Search, Download, X, Loader2 } from "lucide-react";

interface Claim {
  claimId: string;
  title: string;
  carName: string;
  carNumber: string;
  status: string;
  downloadReport: string;
}

// Helper to force server-side attachment fallback
function withAttachment(sasUrl: string, fileName: string) {
  try {
    const url = new URL(sasUrl);
    const disposition = `attachment; filename="${fileName}"`;
    url.searchParams.set('response-content-disposition', disposition);
    return url.toString();
  } catch {
    return sasUrl;
  }
}

// Force download by fetching as blob first, with server-side fallback
async function forceDownloadViaBlob(sasUrl: string, fileName: string = 'document.pdf') {
  try {
    const res = await fetch(sasUrl, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // works because blob: is same-origin
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    window.location.href = withAttachment(sasUrl, fileName);
  }
}

// Modal viewer that mirrors the preview behavior from the detail page (iframe with native toolbar)
const DocumentViewerModal = ({ document, onClose }: { document: Claim | null; onClose: () => void; }) => {
  if (!document) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl h-[90vh] relative">
          <button
            onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full p-1"
            aria-label="Close document viewer"
          >
            <X className="w-6 h-6" />
          </button>
            <iframe
          src={document.downloadReport}
              title={document.title}
          className="w-full h-full border-0 block"
            />
      </div>
    </div>
  );
};

const DeleteConfirmationDialog = ({ onConfirm, onCancel, isDeleting }: { onConfirm: () => void; onCancel: () => void; isDeleting: boolean; }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-['Poppins']">
    <div className="bg-white rounded-[10px] shadow-lg w-[394px] h-[190px] flex flex-col items-center justify-center p-8">
      <p className="text-[16px] font-poppins text-[#767575] mb-10 text-center">
        Are you sure you want to delete?
      </p>
      <div className="flex justify-end space-x-6">
        <button 
          onClick={onCancel} 
          className="w-auto px-6 h-[40px] rounded-[8px] border border-[#1F4A75] text-[#1F4A75] bg-white font-normal flex items-center justify-center transition-colors hover:bg-gray-100"
        >
          No
        </button>
        
        <button 
          onClick={onConfirm} 
          disabled={isDeleting} // Disable button while deleting
          className="w-auto px-6 h-[40px] rounded-[8px] bg-[#1F4A75] text-white font-normal flex items-center justify-center transition-colors hover:bg-[#1a3c63] disabled:bg-gray-400"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            'Yes'
          )}
        </button>
      </div>
    </div>
  </div>
);

export default function AllDocuments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  // Hardcoded claims data
  const claims: Claim[] = [
    {
      claimId: "CL001",
      title: "Car Accident Claim",
      carName: "Toyota Camry",
      carNumber: "ABC-1234",
      status: "Approved",
      downloadReport: "https://example.com/report1.pdf"
    },
    {
      claimId: "CL002",
      title: "Theft Claim",
      carName: "Honda Civic",
      carNumber: "XYZ-5678",
      status: "In Process",
      downloadReport: "https://example.com/report2.pdf"
    },
    {
      claimId: "CL003",
      title: "Damage Claim",
      carName: "Ford Focus",
      carNumber: "DEF-9012",
      status: "Approved",
      downloadReport: "https://example.com/report3.pdf"
    },
    {
      claimId: "CL004",
      title: "Insurance Claim",
      carName: "BMW X3",
      carNumber: "GHI-3456",
      status: "Rejected",
      downloadReport: "https://example.com/report4.pdf"
    }
  ]; 

  const handleDownload = async (docToDownload: Claim) => {
    setDownloading(docToDownload.claimId);
    try {
      const fileName = `report-${docToDownload.claimId}.pdf`;
      await forceDownloadViaBlob(docToDownload.downloadReport, fileName);
    } finally {
      setDownloading(null);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Approved') return 'bg-green-500 text-white';
    if (status === 'In Process') return 'bg-yellow-500 text-white';
    if (status === 'Rejected') return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const filteredDocuments = claims.filter(claim =>
    claim.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Remove date sorting since we don't have date column
  const sortedDocuments = filteredDocuments;

  return (
    <>
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto mt-0">
          <div className="bg-[#FBFBFB] px-6 py-6 my-6 min-h-[calc(100vh-64px)]">
            <div className="w-full">
              {/* Header, Search, and Actions */}
              <div className="flex items-center mb-8 w-full px-8">
                <h1 className="font-poppins text-base font-medium leading-none tracking-normal text-[#4F4F4F]">
                  All Claims {claims.length > 0 && `(${claims.length})`}
                </h1>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[300px] h-8 pl-3 pr-9 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#1F4A75] "
                    />
                  </div>
                </div>
              </div>

              {/* Documents Table */}
              <div className="bg-white rounded-b-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#E5F6F0]">
                    <tr className="h-[43px]">
                      <th className="w-16 px-4 text-center text-xs font-medium text-[#4F4F4F]">ID</th>
                      <th className="text-left text-xs font-medium text-[#4F4F4F]">Title</th>
                      <th className="px-8 text-center text-xs font-medium text-[#4F4F4F]">Car Name</th>
                      <th className="px-8 text-center text-xs font-medium text-[#4F4F4F]">Car Number</th>
                      <th className="px-8 text-center text-xs font-medium text-[#4F4F4F]">Status</th>
                      <th className="px-8 text-center text-xs font-medium text-[#4F4F4F]">Download Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* This logic checks if there are any documents to display */}
                    {sortedDocuments.length > 0 ? (
                      sortedDocuments.map((document, index) =>{
                        return (
                        <tr key={document.claimId} className="hover:bg-gray-50 transition-colors text-xs font-medium text-[#767575]">
                          <td className="px-4 py-4 text-center text-gray-600 font-medium">{document.claimId}</td>
                          <td className="py-4 max-w-md">
                            <Link
                              href={`/documents/${document.claimId}`}
                              className="hover:underline"
                            >
                              {document.title}
                            </Link>
                          </td>
                          <td className="px-8 py-4 text-center">{document.carName}</td>
                          <td className="px-8 py-4 text-center">{document.carNumber}</td>
                          <td className="px-8 py-4 text-center">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(document.status)}`}>
                              {document.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-center">
                            <button
                              onClick={() => handleDownload(document)}
                              className="text-[#1F4A75] hover:text-blue-700 transition-colors"
                              disabled={downloading === document.claimId}
                              title="Download report"
                            >
                              {downloading === document.claimId ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                <Download className="w-4 h-4 mx-auto" />
                              )}
                            </button>
                          </td>
                        </tr>
                      )})
                    ) : (
                      // If NO documents, it shows this "Not Found" message
                      <tr>
                        <td colSpan={6} className="text-center py-10">
                          <p className="mt-4 text-gray-500 font-semibold">No Claims Found!</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}