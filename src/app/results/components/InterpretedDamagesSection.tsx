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
            ? zoneOrder.map((zone, i) => {
                // fallback data for each section
                const fallback = [
                  {
                    title: "Front",
                    items: [
                      { part: "Front Bumper", status: "Minor Damage" },
                      { part: "Hood", status: "Intact" },
                      { part: "Left Headlight", status: "Intact" },
                      { part: "Right Headlight", status: "Intact" },
                      { part: "Front Grille", status: "Intact" },
                      { part: "Windshield", status: "Intact" }
                    ]
                  },
                  {
                    title: "Left",
                    items: [
                      { part: "Left Door (Front)", status: "Minor Damage" },
                      { part: "Left Door (Rear)", status: "Intact" },
                      { part: "Left Front Fender", status: "Intact" },
                      { part: "Left Side Mirror", status: "Intact" },
                      { part: "Left Quarter Panel", status: "Intact" },
                      { part: "Left Glass Door", status: "Intact" }
                    ]
                  },
                  {
                    title: "Right",
                    items: [
                      { part: "Right Door (Front)", status: "Intact" },
                      { part: "Right Door (Rear)", status: "Intact" },
                      { part: "Right Front Fender", status: "Intact" },
                      { part: "Right Side Mirror", status: "Intact" },
                      { part: "Right Quarter Panel", status: "Intact" },
                      { part: "Right Glass Door", status: "Intact" }
                    ]
                  },
                  {
                    title: "Back",
                    items: [
                      { part: "Rear Bumper", status: "Intact" },
                      { part: "Trunk Lid", status: "Intact" },
                      { part: "Left Taillight", status: "Intact" },
                      { part: "Right Taillight", status: "Intact" },
                      { part: "Rear Window", status: "Intact" }
                    ]
                  }
                ];
                const aiSection = aiParts[zone];
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
                      <ul className="space-y-3">
                        {fallback[i].items.map((item) => (
                          <li key={fallback[i].title + '-' + item.part} className="flex items-center justify-between text-sm">
                            <span className="text-gray-800">{item.part}</span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${item.status === "Intact" ? "text-gray-600 bg-gray-100" : "text-yellow-700 bg-yellow-100"}`}>
                              {item.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            : null}
          {!aiParts && (
            <>
              {[
                {
                  title: "Front",
                  items: [
                    { part: "Front Bumper", status: "Minor Damage" },
                    { part: "Hood", status: "Intact" },
                    { part: "Left Headlight", status: "Intact" },
                    { part: "Right Headlight", status: "Intact" },
                    { part: "Front Grille", status: "Intact" },
                    { part: "Windshield", status: "Intact" }
                  ]
                },
                {
                  title: "Left",
                  items: [
                    { part: "Left Door (Front)", status: "Minor Damage" },
                    { part: "Left Door (Rear)", status: "Intact" },
                    { part: "Left Front Fender", status: "Intact" },
                    { part: "Left Side Mirror", status: "Intact" },
                    { part: "Left Quarter Panel", status: "Intact" },
                    { part: "Left Glass Door", status: "Intact" }
                  ]
                },
                {
                  title: "Right",
                  items: [
                    { part: "Right Door (Front)", status: "Intact" },
                    { part: "Right Door (Rear)", status: "Intact" },
                    { part: "Right Front Fender", status: "Intact" },
                    { part: "Right Side Mirror", status: "Intact" },
                    { part: "Right Quarter Panel", status: "Intact" },
                    { part: "Right Glass Door", status: "Intact" }
                  ]
                },
                {
                  title: "Back",
                  items: [
                    { part: "Rear Bumper", status: "Intact" },
                    { part: "Trunk Lid", status: "Intact" },
                    { part: "Left Taillight", status: "Intact" },
                    { part: "Right Taillight", status: "Intact" },
                    { part: "Rear Window", status: "Intact" }
                  ]
                }
              ].map((zone) => (
                <div key={zone.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="pb-3 mb-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800">{zone.title}</h4>
                  </div>
                  <ul className="space-y-3">
                    {zone.items.map((item) => (
                      <li key={`${zone.title}-${item.part}`} className="flex items-center justify-between text-sm">
                        <span className="text-gray-800">{item.part}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${item.status === "Intact" ? "text-gray-600 bg-gray-100" : "text-yellow-700 bg-yellow-100"}`}>
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
