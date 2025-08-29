"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Pencil, X } from "lucide-react";
import { createPortal } from "react-dom";

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    <p className="text-sm text-gray-900 break-words">{value || 'N/A'}</p>
  </div>
);

const CardHeader = ({
  title,
  onEdit
}: {
  title: string;
  onEdit?: () => void;
}) => (
  <div className="flex justify-between items-center mb-4 border-b pb-2">
    <h2 className="text-l font-bold text-black flex items-center gap-3">
      {title}
    </h2>
    {onEdit && (
      <button
        onClick={onEdit}
        className="flex items-center gap-2 text-sm text-black font-semibold p-2 rounded-lg hover:bg-gray-100 border border-black cursor-pointer"
        aria-label="Edit section"
      >
        <Pencil size={16} className="text-black" />
        Edit
      </button>
    )}
  </div>
);


// Modal for editing section
function EditModal({
  section,
  data,
  onClose,
  onSave
}: {
  section: 'driver' | 'license' | 'address',
  data: any,
  onClose: () => void,
  onSave: (section: string, values: any) => void
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [section]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj: Record<string, any> = {};
    fd.forEach((v, k) => {
      obj[k] = v as string;
    });
    onSave(section, obj);
  };

  let fields: { label: string; name: string; type?: string; }[] = [];
  if (section === 'driver') {
    fields = [
      { label: 'First Name', name: 'firstName' },
      { label: 'Last Name', name: 'lastName' },
      { label: 'Gender', name: 'gender' },
      { label: 'Date of Birth', name: 'dob', type: 'date' },
      { label: 'Phone', name: 'phone' },
      { label: 'Email', name: 'email' },
      { label: 'Nationality', name: 'nationality' },
      { label: 'Emergency Contact', name: 'emergencyContact' },
    ];
  } else if (section === 'license') {
    fields = [
      { label: 'License Number', name: 'licenseNumber' },
      { label: 'License Type', name: 'licenseType' },
      { label: 'State', name: 'licenseState' },
      { label: 'Issued On', name: 'issuedOn', type: 'date' },
      { label: 'Expires On', name: 'expiresOn', type: 'date' },
      { label: 'Policy Number', name: 'policyNumber' },
    ];
  } else if (section === 'address') {
    fields = [
      { label: 'Address Line 1', name: 'address1' },
      { label: 'Address Line 2', name: 'address2' },
      { label: 'City', name: 'city' },
      { label: 'State', name: 'state' },
      { label: 'ZIP Code', name: 'zip' },
    ];
  }

  const modalUI = (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 transition-colors duration-200" onMouseDown={e => e.stopPropagation()}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto" onMouseDown={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black capitalize">Edit {section === 'driver' ? 'Driver Details' : section === 'license' ? 'License Details' : 'Mailing Address'}</h3>
          <button onClick={onClose} className="text-black hover:text-gray-800"><X size={24} /></button>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f, i) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-sm font-medium text-gray-700">{f.label}</label>
              <input
                ref={i === 0 ? firstFieldRef : undefined}
                type={f.type || 'text'}
                id={f.name}
                name={f.name}
                defaultValue={data?.[f.name] ?? ''}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>
          ))}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-black rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modalUI, document.body);
}

export default function DriverDetailsPage() {
  const [form, setForm] = useState({
    firstName: "Jane",
    lastName: "Doe",
    gender: "Female",
    dob: "1990-05-15",
    phone: "+1 (555) 123-4567",
    email: "jane.doe@email.com",
    nationality: "American",
    licenseNumber: "D1234567890",
    licenseType: "Full",
    licenseState: "CA",
    issuedOn: "2018-06-01",
    expiresOn: "2028-06-01",
    policyNumber: "POL1234567",
    address1: "123 Market Street",
    address2: "Apt 4B",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    emergencyContact: "John Doe (+1 555-987-6543)"
  });
  const [editSection, setEditSection] = useState<null | 'driver' | 'license' | 'address'>(null);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('driverDetails');
    if (saved) {
      try { setForm(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      {editSection && (
        <EditModal
          section={editSection}
          data={form}
          onClose={() => setEditSection(null)}
          onSave={(section, values) => {
            setForm(prev => {
              const next = { ...prev, ...values } as typeof prev;
              try { localStorage.setItem('driverDetails', JSON.stringify(next)); } catch {}
              return next;
            });
            setEditSection(null);
          }}
        />
      )}
      <main className="pb-16">
        <section className="max-w-5xl mx-auto px-4 pt-12">
          <div className="space-y-8">
            {/* Driver Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <CardHeader
                title="Driver Details"
                onEdit={() => setEditSection('driver')}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem label="First Name" value={form.firstName} />
                <InfoItem label="Last Name" value={form.lastName} />
                <InfoItem label="Gender" value={form.gender} />
                <InfoItem label="Date of Birth" value={form.dob} />
                <InfoItem label="Phone" value={form.phone} />
                <InfoItem label="Email" value={form.email} />
                <InfoItem label="Nationality" value={form.nationality} />
                <InfoItem label="Emergency Contact" value={form.emergencyContact} />
              </div>
            </div>
            {/* License Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <CardHeader
                title="License Details"
                onEdit={() => setEditSection('license')}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem label="License Number" value={form.licenseNumber} />
                <InfoItem label="License Type" value={form.licenseType} />
                <InfoItem label="State" value={form.licenseState} />
                <InfoItem label="Issued On" value={form.issuedOn} />
                <InfoItem label="Expires On" value={form.expiresOn} />
                <InfoItem label="Policy Number" value={form.policyNumber} />
              </div>
            </div>
            {/* Address */}
            <div className="bg-white rounded-xl shadow p-6">
              <CardHeader
                title="Mailing Address"
                onEdit={() => setEditSection('address')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Address Line 1" value={form.address1} />
                <InfoItem label="Address Line 2" value={form.address2} />
                <InfoItem label="City" value={form.city} />
                <InfoItem label="State" value={form.state} />
                <InfoItem label="ZIP Code" value={form.zip} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
// ...existing code up to the last display section...
