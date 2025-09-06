"use client";


import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, apiCall } from "@/lib/config";
import { useToast } from "@/components/ui/Toast";
import { Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface ClaimData {
  claim: {
    claim_id: string;
    created_at: string;
    status: string;
  };
  image_analysis: {
    analysis_type: string;
  };
  driving_license: {
    dl_number: string;
    name: string;
  };
  policy: {
    policy_number: string;
    license_plate: string;
  };
}

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

export default function DashboardClaimHistory() {
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { show } = useToast();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await apiCall(`${API_BASE_URL}/api/claim/my-claims-joined`, {
          method: "GET",
        });

        if (response.is401) {
          // Handle 401 error with toast
          show({ type: 'error', title: 'Session Expired', message: 'Your session has expired. Please login again.' });
          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        if (response.ok) {
          const data: ClaimData[] = await response.json();
          const sortedData = data.sort((a, b) => new Date(b.claim.created_at).getTime() - new Date(a.claim.created_at).getTime());
          setClaims(sortedData);
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const openDeleteModal = (claimId: string) => {
    setClaimToDelete(claimId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setClaimToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!claimToDelete) return;

    try {
      const response = await apiCall(`${API_BASE_URL}/api/claim/${claimToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        show({
          type: "success",
          title: "Claim Deleted",
          message: `Claim ${claimToDelete} has been deleted successfully.`,
        });
        setClaims((prevClaims) =>
          prevClaims.filter((c) => c.claim.claim_id !== claimToDelete)
        );
      } else {
        const errorData = await response.json();
        show({
          type: "error",
          title: "Deletion Failed",
          message:
            errorData.message || "Failed to delete the claim. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting claim:", error);
      show({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      closeDeleteModal();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const filtered = claims.filter((c) => {
    const claimId = c.claim.claim_id;
    const vehicleNumber = c.driving_license?.dl_number || "";
    const name = c.driving_license?.name || "";
    const policyNumber = c.policy?.policy_number || "";
    const licensePlate = c.policy?.license_plate || "";
    const searchLower = search.toLowerCase();
    
    return (
      (!search || claimId.toLowerCase().includes(searchLower) || vehicleNumber.toLowerCase().includes(searchLower) || name.toLowerCase().includes(searchLower) || policyNumber.toLowerCase().includes(searchLower) || licensePlate.toLowerCase().includes(searchLower)) &&
      (!status || status === "All Statuses" || c.claim.status === status) &&
      (!vehicle || vehicle === "All Vehicles" || licensePlate === vehicle)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc]">
        <Navbar />
        <main className="px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F4A75]"></div>
            <span className="ml-2 text-gray-600">Loading claims...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <main className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#222]">Claim History</h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search claims..."
              className="px-3 py-2 border border-gray-200 rounded bg-white text-xs min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#1F4A75]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-200 rounded bg-white text-xs"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
              <option value="Awaiting Documents">Awaiting Documents</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded bg-white text-xs"
              value={vehicle}
              onChange={e => setVehicle(e.target.value)}
            >
              <option value="">All Vehicles</option>
              {Array.from(new Set(claims.map(c => c.policy?.license_plate).filter(Boolean))).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#23272f]/90 backdrop-blur-sm">
              <tr className="h-[43px]">
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Claim ID</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">DL Number</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">License Plate</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Date Filed</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Policy Number</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left">Report</th>
                <th className="px-4 py-3 text-xs font-medium text-white text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.claim.claim_id} className="hover:bg-gray-50 transition-colors text-xs font-medium text-[#767575]">
                  <td className="px-4 py-3 text-[#222] font-normal">{c.claim.claim_id}</td>
                  <td className="px-4 py-3">{c.driving_license?.name || "N/A"}</td>
                  <td className="px-4 py-3">{c.driving_license?.dl_number || "N/A"}</td>
                  <td className="px-4 py-3">{c.policy?.license_plate || "N/A"}</td>
                  <td className="px-4 py-3">{formatDate(c.claim.created_at)}</td>
                  <td className="px-4 py-3">{c.policy?.policy_number || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusStyles["Pending"]}`}>
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-[#1F4A75] hover:underline cursor-pointer bg-transparent p-0"
                      onClick={() => router.push(`/results/${c.claim.claim_id}`)}
                    >
                      View Report
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-red-500 hover:text-red-700 cursor-pointer bg-transparent p-0"
                      onClick={() => openDeleteModal(c.claim.claim_id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-400">No claims found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        footer={
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4A75]"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        }
      >
        <p>Are you sure you want to delete claim <strong>{claimToDelete}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}