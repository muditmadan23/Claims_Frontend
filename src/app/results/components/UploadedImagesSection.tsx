"use client";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

type Side = "front" | "left" | "right" | "back";

interface UploadedImagesSectionProps {
  claimId: string;
  imageUrls?: Partial<Record<Side, string>> | null;
}

export default function UploadedImagesSection({ claimId, imageUrls }: UploadedImagesSectionProps) {
  const [images, setImages] = useState<Partial<Record<Side, string>>>({});
  const [loading, setLoading] = useState<Partial<Record<Side, boolean>>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const sides: Side[] = ["front", "left", "right", "back"];
      
      for (const side of sides) {
        try {
          setLoading(prev => ({ ...prev, [side]: true }));
          
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_BASE_URL}/api/analysis/${claimId}/image/${side}`, {
            method: "GET",
            headers: {
              "accept": "application/json",
              'Authorization': token ? `Bearer ${token}` : '',
            },
          });
          
          if (response.ok) {
            // Assuming the API returns image data as blob or base64
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setImages(prev => ({ ...prev, [side]: imageUrl }));
          }
        } catch (error) {
          console.error(`Error fetching ${side} image:`, error);
        } finally {
          setLoading(prev => ({ ...prev, [side]: false }));
        }
      }
    };

    if (claimId) {
      fetchImages();
    }
  }, [claimId]);

  useEffect(() => {
    return () => {
      // Cleanup object URLs to prevent memory leaks
      Object.values(images).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  const zones: { key: Side; title: string }[] = [
    { key: "front", title: "Front" },
    { key: "left", title: "Left" },
    { key: "right", title: "Right" },
    { key: "back", title: "Back" },
  ];

  return (
    <section className="w-full max-w-6xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="pb-4 mb-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Uploaded Images</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map(({ key, title }) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="pb-3 mb-3 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
              </div>
              <div className="w-full h-40 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                {loading[key] ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="text-xs text-gray-500 mt-2">Loading...</span>
                  </div>
                ) : images[key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[key] as string} alt={`${title} Image`} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No image available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
