import React from "react";

interface AIPart {
  part: string;
  reason: string;
}

interface AIPartsResponse {
  front?: AIPart[] | null;
  back?: AIPart[] | null;
  left?: AIPart[] | null;
  right?: AIPart[] | null;
}

// Derive a compact status label from a free-form reason
function deriveStatus(reason: string) {
  const r = (reason || "").toLowerCase();
  const intactHints = [
    "no damage",
    "not damaged",
    "undamaged",
    "intact",
    "no visible damage",
    "no significant damage",
    "good condition",
    "normal",
    "ok",
    "fine",
  ];
  if (intactHints.some((k) => r.includes(k))) {
    return { label: "Intact", cls: "text-gray-600 bg-gray-100" };
  }
  if (r.includes("minor")) {
    return { label: "Minor Damage", cls: "text-yellow-700 bg-yellow-100" };
  }
  return { label: "Damage", cls: "text-red-700 bg-red-100" };
}

export default function InterpretedDamagesSection({ damageDetails }: { damageDetails?: AIPartsResponse }) {
  const data = damageDetails;

  // If data exists, render from data, else fallback to default
  const zoneOrder: (keyof AIPartsResponse)[] = ["front", "left", "right", "back"];

  return (
    <section className="w-full max-w-6xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="pb-4 mb-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">AI Interpreted Damaged Parts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data
            ? zoneOrder.map((zone, i) => {
                const aiSection = data[zone];
                return (
                  <div key={zone} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="pb-3 mb-3 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-800">{zone.charAt(0).toUpperCase() + zone.slice(1)}</h4>
                    </div>
                    {Array.isArray(aiSection) && aiSection.length > 0 ? (
                      <ul className="space-y-3">
                        {aiSection.map((item, idx) => {
                          const status = deriveStatus(item.reason);
                          return (
                            <li key={item.part + idx} className="group relative flex items-center justify-between text-sm hover:bg-gray-50 rounded-md px-2 py-1.5 transition">
                              <span className="text-gray-800 font-medium">{item.part}</span>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${status.cls}`}>
                                {status.label}
                              </span>
                              <div className="absolute left-0 top-full mt-2 z-10 hidden group-hover:block w-full">
                                <div className="bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs text-gray-700">
                                  {item.reason}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-600 italic">
                        No damages detected
                      </div>
                    )}
                  </div>
                );
              })
            : null}
          {!data && (
            <>
              {[
                "front",
                "left", 
                "right",
                "back"
              ].map((zone) => (
                <div key={zone} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="pb-3 mb-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">{zone.charAt(0).toUpperCase() + zone.slice(1)}</h4>
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    No data available
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
