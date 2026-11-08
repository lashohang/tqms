'use client';

import React, { useState } from 'react';

interface CustomFileInputProps {
  label: string;
  onChange: (file: File | null) => void;
}

export default function CustomFileInput({
  label,
  onChange,
}: CustomFileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);

    onChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        aria-label={label}
        onChange={handleChange}
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
      />

      {selectedFile && (
        <span className="text-[10px] text-gray-500">
          Selected: {selectedFile.name}
        </span>
      )}
    </div>
  );
}