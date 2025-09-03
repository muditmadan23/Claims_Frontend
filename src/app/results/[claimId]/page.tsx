"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import VehicleInformationCard from "@/components/VehicleInformationCard";
import ClaimTimeline, { TimelineItem } from "@/components/ClaimTimeline";
import MatchedDamagesCard from "../components/MatchedDamagesCard";
import DoubtfulDamagesCard from "../components/DoubtfulDamagesCard";
import RejectedClaimsCard from "../components/RejectedClaimsCard";
import InterpretedDamagesSection from "../components/InterpretedDamagesSection";
import UploadedImagesSection from "../components/UploadedImagesSection";
import SummaryCard from "../components/SummaryCard";
import AssessmentSummaryCard from "../components/AssessmentSummaryCard";
import ExportSummaryCard from "../components/ExportSummaryCard";
import { API_BASE_URL, apiCall } from "@/lib/config";
import { useToast } from "@/components/ui/Toast";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 80,
    fontFamily: 'Helvetica',
    minHeight: 800, // Ensure minimum page height
  },
  header: {
    marginBottom: 25,
    borderBottom: '2px solid #1f4a75',
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f4a75',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
    textAlign: 'center',
  },
  documentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#6b7280',
    marginTop: 10,
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f4a75',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
  },
  overviewBox: {
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 6,
    marginBottom: 25,
    border: '1px solid #e2e8f0',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: '500',
  },
  summaryBox: {
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 1.6,
    border: '1px solid #e2e8f0',
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  insightsBox: {
    backgroundColor: '#fef3c7',
    padding: 18,
    borderRadius: 6,
    border: '1px solid #f59e0b',
    marginBottom: 25,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#92400e',
  },
  insightItem: {
    marginBottom: 8,
    fontSize: 11,
    lineHeight: 1.5,
  },
  damageSection: {
    marginBottom: 20,
  },
  damageTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#92400e',
  },
  damageList: {
    marginBottom: 10,
  },
  damageItem: {
    fontSize: 10,
    marginBottom: 4,
    color: '#92400e',
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineDot: {
    width: 16,
    height: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineText: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1e293b',
  },
  timelineDate: {
    fontSize: 10,
    color: '#64748b',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 9,
    color: '#9ca3af',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderBottom: '1px solid #e5e7eb',
    zIndex: 10,
  },
  fixedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f4a75',
    textAlign: 'center',
  },
  fixedSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
  obligationCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
  relevantTitle: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #22c55e',
  },
  irrelevantTitle: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #ef4444',
  },
  actionPoint: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #e5e7eb',
  },
  actionPointTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1e293b',
  },
  actionPointDescription: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
    lineHeight: 1.5,
  },
  text: {
    fontSize: 10,
    color: '#1e293b',
    marginBottom: 5,
    lineHeight: 1.5,
  },
});

const PDFDocument = ({ claimData, report, combinedDamages }: { claimData: ClaimData | null, report: FinalReport | null, combinedDamages: any }) => (
  <Document>
    <Page
      size="RA4"
      style={styles.page}
      wrap={false}
    >
      {/* Fixed Header - appears on every page */}
      <View fixed style={styles.fixedHeader}>
        <Text style={styles.fixedTitle}>
          Claim Assessment Report
        </Text>
        <Text style={styles.fixedSubtitle}>Vehicle Damage Analysis</Text>
      </View>

      {/* Dynamic Page Numbers - appears on every page */}
      <Text
        fixed
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />

      {/* Document Header - only on first page */}
      <View style={[styles.header, { marginTop: 40 }]}>
        <Text style={styles.title}>Claim Assessment Report</Text>
        <Text style={styles.subtitle}>Comprehensive Vehicle Damage Analysis</Text>
        <View style={styles.documentMeta}>
          <Text>Report Generated: {new Date().toLocaleDateString()}</Text>
          <Text>Claim ID: {claimData?.claim?.claim_id || 'N/A'}</Text>
        </View>
      </View>

      {/* Claim Overview */}
      <View style={styles.overviewBox}>
        <Text style={styles.sectionTitle}>Claim Overview</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Claim ID</Text>
            <Text style={styles.value}>{claimData?.claim?.claim_id || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{claimData?.claim?.status || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Created Date</Text>
            <Text style={styles.value}>
              {claimData?.claim?.created_at ? new Date(claimData.claim.created_at).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Policy Number</Text>
            <Text style={styles.value}>{claimData?.policy?.policy_number || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Driver Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} break>Driver Information</Text>
        <View style={styles.overviewBox}>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{claimData?.driving_license?.name || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>License Number</Text>
              <Text style={styles.value}>{claimData?.driving_license?.dl_number || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>{claimData?.driving_license?.date_of_birth || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Blood Group</Text>
              <Text style={styles.value}>{claimData?.driving_license?.blood_group || 'N/A'}</Text>
            </View>
          </View>
          {claimData?.driving_license?.address && (
            <View style={[styles.gridItem, { width: '100%' }]}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{claimData.driving_license.address}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Policy Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} break>Policy Information</Text>
        <View style={styles.overviewBox}>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Insurer</Text>
              <Text style={styles.value}>{claimData?.policy?.insurer || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Coverage Type</Text>
              <Text style={styles.value}>{claimData?.policy?.coverage || 'N/A'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Vehicle</Text>
              <Text style={styles.value}>
                {claimData?.policy?.vehicle_make} {claimData?.policy?.vehicle_model} ({claimData?.policy?.vehicle_year})
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>License Plate</Text>
              <Text style={styles.value}>{claimData?.policy?.license_plate || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Damage Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} break>Damage Analysis</Text>
        <View style={styles.insightsBox}>
          <Text style={styles.insightsTitle}>Detected Damages by Vehicle Side</Text>

          {combinedDamages.front.length > 0 && (
            <View style={styles.damageSection}>
              <Text style={styles.damageTitle}>Front Side Damages ({combinedDamages.front.length})</Text>
              <View style={styles.damageList}>
                {combinedDamages.front.map((damage: DamageDetail, index: number) => (
                  <Text key={index} style={styles.damageItem}>
                    • {damage.part}: {damage.reason}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {combinedDamages.back.length > 0 && (
            <View style={styles.damageSection}>
              <Text style={styles.damageTitle}>Back Side Damages ({combinedDamages.back.length})</Text>
              <View style={styles.damageList}>
                {combinedDamages.back.map((damage: DamageDetail, index: number) => (
                  <Text key={index} style={styles.damageItem}>
                    • {damage.part}: {damage.reason}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {combinedDamages.left.length > 0 && (
            <View style={styles.damageSection}>
              <Text style={styles.damageTitle}>Left Side Damages ({combinedDamages.left.length})</Text>
              <View style={styles.damageList}>
                {combinedDamages.left.map((damage: DamageDetail, index: number) => (
                  <Text key={index} style={styles.damageItem}>
                    • {damage.part}: {damage.reason}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {combinedDamages.right.length > 0 && (
            <View style={styles.damageSection}>
              <Text style={styles.damageTitle}>Right Side Damages ({combinedDamages.right.length})</Text>
              <View style={styles.damageList}>
                {combinedDamages.right.map((damage: DamageDetail, index: number) => (
                  <Text key={index} style={styles.damageItem}>
                    • {damage.part}: {damage.reason}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Assessment Summary */}
      {report && (
        <View style={[styles.section, { marginTop: 40 }]}>
          <Text style={styles.sectionTitle} break>Assessment Summary</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText} orphans={3} widows={3}>{report.summary}</Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]} break>Consistency Check</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText} orphans={3} widows={3}>{report.consistency_check}</Text>
          </View>
        </View>
      )}

      {/* Categorized Damages */}
      {report && (
        <View style={[styles.section, { marginTop: 40 }]}>
          <Text style={styles.sectionTitle} break>Damage Classification</Text>

          {/* Relevant Damages */}
          {report.categorized_parts.relevant_damages.length > 0 && (
            <View style={styles.obligationCategory}>
              <Text style={[styles.categoryTitle, styles.relevantTitle]}>
                RELEVANT DAMAGES ({report.categorized_parts.relevant_damages.length})
              </Text>
              <View style={styles.overviewBox}>
                {report.categorized_parts.relevant_damages.map((damage, index) => (
                  <View key={index} style={styles.actionPoint}>
                    <Text style={styles.actionPointTitle}>{damage.part}</Text>
                    <Text style={styles.actionPointDescription}>{damage.reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Doubtful Damages */}
          {report.categorized_parts.doubtful_damages.length > 0 && (
            <View style={styles.obligationCategory}>
              <Text style={[styles.categoryTitle, { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' }]}>
                DOUBTFUL DAMAGES ({report.categorized_parts.doubtful_damages.length})
              </Text>
              <View style={styles.overviewBox}>
                {report.categorized_parts.doubtful_damages.map((damage, index) => (
                  <View key={index} style={styles.actionPoint}>
                    <Text style={styles.actionPointTitle}>{damage.part}</Text>
                    <Text style={styles.actionPointDescription}>{damage.reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Rejected Parts */}
          {report.categorized_parts.rejected_parts.length > 0 && (
            <View style={styles.obligationCategory}>
              <Text style={[styles.categoryTitle, styles.irrelevantTitle]}>
                REJECTED PARTS ({report.categorized_parts.rejected_parts.length})
              </Text>
              <View style={styles.overviewBox}>
                {report.categorized_parts.rejected_parts.map((damage, index) => (
                  <View key={index} style={styles.actionPoint}>
                    <Text style={styles.actionPointTitle}>{damage.part}</Text>
                    <Text style={styles.actionPointDescription}>{damage.reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Processing Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} break>Claim Processing Timeline</Text>
        <View style={styles.overviewBox}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
            </View>
            <View style={styles.timelineText}>
              <Text style={styles.timelineTitle}>Documents Uploaded</Text>
              <Text style={styles.timelineDate}>
                {claimData?.claim?.created_at ? new Date(claimData.claim.created_at).toLocaleString() : 'Not available'}
              </Text>
            </View>
          </View>
          {claimData?.estimate_parts && claimData.estimate_parts.length > 0 && (
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelineTitle}>AI Analysis Completed</Text>
                <Text style={styles.timelineDate}>
                  {claimData.estimate_parts[0].created_at ? new Date(claimData.estimate_parts[0].created_at).toLocaleString() : 'Not available'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

interface CategorizedParts {
  relevant_damages: { part: string; reason: string }[];
  doubtful_damages: { part: string; reason: string }[];
  rejected_parts: { part: string; reason: string }[];
}

interface DamageDetail {
  part: string;
  reason: string;
}

interface AnalysisHistory {
  id: number;
  created_at: string;
  analysis_type: string;
  has_front_image: boolean;
  has_back_image: boolean;
  has_left_image: boolean;
  has_right_image: boolean;
  front_damage_details: DamageDetail[] | null;
  back_damage_details: DamageDetail[] | null;
  left_damage_details: DamageDetail[] | null;
  right_damage_details: DamageDetail[] | null;
  analysis_summary: string | null;
}

interface FinalReport {
  summary: string;
  consistency_check: string;
  categorized_parts: CategorizedParts;
}

interface ClaimData {
  claim: {
    claim_id: string;
    created_at: string;
    status: string;
    claim_story?: string;
    policy_id?: number;
    final_report?: {
      summary: string;
      consistency_check: string;
      categorized_parts: CategorizedParts;
    } | null;
  };
  driving_license: {
    name: string;
    dl_number: string;
    date_of_birth: string;
    address?: string;
    blood_group?: string;
    emergency_contact_number?: string;
  };
  policy: {
    insurer: string;
    policy_number: string;
    coverage: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    license_plate: string;
    plan?: string;
    status?: string;
    effective_from?: string;
    effective_to?: string;
  };
  image_analysis?: {
    front_damage_details: string;
    back_damage_details: string;
    left_damage_details: string;
    right_damage_details: string | null;
  };
  estimate_parts?: any[];
  final_report?: {
    summary: string;
    consistency_check: string;
    categorized_parts: CategorizedParts;
  };
}

export default function UploadResultPage() {
  const params = useParams();
  const claimId = params.claimId as string;
  
  console.log("Claim ID from URL:", claimId);
  const [report, setReport] = useState<FinalReport | null>(null);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { show } = useToast();

  useEffect(() => {
    const fetchAllClaimsData = async () => {
      try {
        // Fetch all claims data
        const response = await apiCall(`${API_BASE_URL}/api/claim/my-claims-joined`, {
          method: "GET",
        });

        if (response.is401) {
          // Handle 401 error with toast
          const errorData = await response.json();
          show({
            message: errorData.message || "Session expired. Please login again.",
            type: "error",
          });
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch claims data");
        const claimsData: ClaimData[] = await response.json();

        // Find the specific claim by claimId
        const specificClaim = claimsData.find(claim => claim.claim.claim_id === claimId);

        if (!specificClaim) {
          throw new Error(`Claim with ID ${claimId} not found`);
        }

        // Set the claim data
        setClaimData(specificClaim);

        // Set the final report if it exists
        if (specificClaim.final_report) {
          setReport(specificClaim.final_report);
        }

        // Set analysis history from image_analysis if available
        if (specificClaim.image_analysis) {
          const analysisHistoryItem: AnalysisHistory = {
            id: 1,
            created_at: specificClaim.claim.created_at,
            analysis_type: "vehicle_damage",
            has_front_image: true,
            has_back_image: true,
            has_left_image: true,
            has_right_image: false,
            front_damage_details: specificClaim.image_analysis.front_damage_details ? JSON.parse(specificClaim.image_analysis.front_damage_details) : null,
            back_damage_details: specificClaim.image_analysis.back_damage_details ? JSON.parse(specificClaim.image_analysis.back_damage_details) : null,
            left_damage_details: specificClaim.image_analysis.left_damage_details ? JSON.parse(specificClaim.image_analysis.left_damage_details) : null,
            right_damage_details: specificClaim.image_analysis.right_damage_details ? JSON.parse(specificClaim.image_analysis.right_damage_details || "[]") : null,
            analysis_summary: null
          };
          setAnalysisHistory([analysisHistoryItem]);
        }

      } catch (err: any) {
        console.error("Error fetching claims data:", err);
        setError(err?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (claimId) {
      fetchAllClaimsData();
    }
  }, [claimId]);

  // Combine all damage details for InterpretedDamagesSection
  const getCombinedDamages = () => {
    const combined: {
      front: DamageDetail[];
      back: DamageDetail[];
      left: DamageDetail[];
      right: DamageDetail[];
    } = {
      front: [],
      back: [],
      left: [],
      right: []
    };
    
    analysisHistory.forEach(analysis => {
      if (analysis.front_damage_details) {
        combined.front.push(...analysis.front_damage_details);
      }
      if (analysis.back_damage_details) {
        combined.back.push(...analysis.back_damage_details);
      }
      if (analysis.left_damage_details) {
        combined.left.push(...analysis.left_damage_details);
      }
      if (analysis.right_damage_details) {
        combined.right.push(...analysis.right_damage_details);
      }
    });
    
    return combined;
  };

  const combinedDamages = getCombinedDamages();

  const handleDownloadPDF = async () => {
    try {
      const blob = await pdf(<PDFDocument claimData={claimData} report={report} combinedDamages={combinedDamages} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `claim-report-${claimId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      show({
        message: "PDF downloaded successfully!",
        type: "success",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      show({
        message: "Failed to download PDF. Please try again.",
        type: "error",
      });
    }
  };

  const timeline: TimelineItem[] = [];
  if (claimData?.claim?.created_at) {
    timeline.push({
      title: "Uploaded Documents",
      timestamp: claimData.claim.created_at,
      color: "bg-blue-500",
      completed: true
    });
  }
  // Use estimate_parts[0]?.created_at for AI Analysis Completed if available
  if (claimData?.estimate_parts && claimData.estimate_parts.length > 0 && claimData.estimate_parts[0].created_at) {
    timeline.push({
      title: "AI Analysis Completed",
      timestamp: claimData.estimate_parts[0].created_at,
      color: "bg-green-500",
      completed: true
    });
  }
  // (No summary completed event)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12">
          <LoadingIndicator />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-12">
        {/* Progress bar with 5 steps, last step is Results */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>1</div>
                <span className={`text-xs font-medium text-black`}>Details</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>2</div>
                <span className={`text-xs font-medium text-black`}>Upload Images</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>3</div>
                <span className={`text-xs font-medium text-black`}>Claim Form</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>4</div>
                <span className={`text-xs font-medium text-black`}>Estimate Copy</span>
              </div>
              <div className={`h-1 bg-black flex-1 mx-2`} />
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 bg-black`}>5</div>
                <span className={`text-xs font-medium text-black`}>Results</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
          {/* Left: Vehicle Information */}
          <div className="flex-1 min-w-0">
            <VehicleInformationCard 
              drivingLicense={claimData?.driving_license}
              policy={claimData?.policy}
            />
          </div>
          {/* Right: Timeline */}
          <div className="w-[361px] flex-shrink-0 flex flex-col">
            <ClaimTimeline timeline={timeline} />
            <ExportSummaryCard className="mt-auto" onDownload={handleDownloadPDF} />
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <UploadedImagesSection claimId={claimId} />
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <InterpretedDamagesSection damageDetails={combinedDamages} />
        </div>
        <div className="mt-6 w-full flex justify-center px-4">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <MatchedDamagesCard damages={report?.categorized_parts.relevant_damages || []} />
            <DoubtfulDamagesCard damages={report?.categorized_parts.doubtful_damages || []} />
            <RejectedClaimsCard damages={report?.categorized_parts.rejected_parts || []} />
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><SummaryCard summary={report?.summary || ""} consistencyCheck={report?.consistency_check || ""} /></div>
              <div><AssessmentSummaryCard /></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
