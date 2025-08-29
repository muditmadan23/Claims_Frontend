
import React, { useEffect, useState } from "react";

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


export default function InterpretedDamagesSection() {
  const [aiParts, setAiParts] = useState<AIPartsResponse | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aiParts");
      if (stored) {
        setAiParts(JSON.parse(stored));
      }
    } catch {}
  }, []);


  // If aiParts exists, render from API, else fallback to default
  const zoneOrder: (keyof AIPartsResponse)[] = ["front", "left", "right", "back"];

  return (
    <section className="w-full max-w-6xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="pb-4 mb-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">AI Interpreted Damaged Parts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiParts
            ? zoneOrder.map((zone) => (
                <div key={zone} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="pb-3 mb-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">{zone.charAt(0).toUpperCase() + zone.slice(1)}</h4>
                  </div>
                  {Array.isArray(aiParts[zone]) && (aiParts[zone] as AIPart[]).length > 0 ? (
                    <ul className="space-y-3">
                      {(aiParts[zone] as AIPart[]).map((item, idx) => (
                        <li key={item.part + idx} className="flex flex-col text-sm">
                          <span className="text-gray-800 font-medium">{item.part}</span>
                          <span className="text-gray-500 text-xs mt-0.5">{item.reason}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400 text-xs italic">No data</div>
                  )}
                </div>
              ))
            : null}
          {!aiParts && (
            // fallback to previous static zones if no aiParts
            <>
              {/* ...existing code for zones fallback... */}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
