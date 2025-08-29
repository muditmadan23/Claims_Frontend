type Status = "Intact" | "Minor Damage";

interface PartStatus {
  part: string;
  status: Status;
}

interface ZoneData {
  title: string;
  items: PartStatus[];
}

const zones: ZoneData[] = [
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

const statusBadgeClasses: Record<Status, string> = {
  "Intact": "text-gray-600 bg-gray-100",
  "Minor Damage": "text-yellow-700 bg-yellow-100"
};

export default function InterpretedDamagesSection() {
  return (
    <section className="w-full max-w-6xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="pb-4 mb-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">AI Interpreted Damaged Parts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div key={zone.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="pb-3 mb-3 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800">{zone.title}</h4>
              </div>
              <ul className="space-y-3">
                {zone.items.map((item) => (
                  <li key={`${zone.title}-${item.part}`} className="flex items-center justify-between text-sm">
                    <span className="text-gray-800">{item.part}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusBadgeClasses[item.status]}`}>
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
