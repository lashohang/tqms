'use client';

import React, { useEffect, useState } from 'react';

interface ImagePreviewProps {
  file: File | null;
  title: string;
}

export default function ImagePreview({
  file,
  title,
}: ImagePreviewProps) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  if (!file) return null;

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-xs font-bold text-gray-600">
        {title}
      </h4>

      {preview && (
        <img
          src={preview}
          alt={title}
          className="w-32 h-28 object-contain border border-gray-300 rounded-md bg-white p-1"
        />
      )}

      <p className="text-[10px] text-gray-500">
        {file.name}
      </p>
    </div>
  );
}