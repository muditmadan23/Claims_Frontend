"use client";

import React, { useState } from "react";

export default function UploadPage() {
  type Side = "left" | "right" | "front" | "back";
  const [images, setImages] = useState<Record<Side, File | null>>({
    left: null,
    right: null,
    front: null,
    back: null,
  });
  const [previews, setPreviews] = useState<Record<Side, string>>({
    left: "",
    right: "",
    front: "",
    back: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (side: Side) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImages((prev) => ({ ...prev, [side]: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [side]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews((prev) => ({ ...prev, [side]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    // Here you would send the images to your backend
    // For now, just simulate success
    setTimeout(() => {
      setSuccess("Images uploaded successfully!");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Images</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {([
            { label: "Left", key: "left" },
            { label: "Right", key: "right" },
            { label: "Front", key: "front" },
            { label: "Back", key: "back" },
          ] as { label: string; key: Side }[]).map(({ label, key }) => (
            <div key={key} className="flex flex-col items-center">
              <label className="mb-2 font-medium text-gray-700">{label} Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(key)}
                className="mb-2"
                required
              />
              {previews[key] && (
                <img
                  src={previews[key]}
                  alt={`${label} preview`}
                  className="w-32 h-32 object-cover rounded border"
                />
              )}
            </div>
          ))}
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
