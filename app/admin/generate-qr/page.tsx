// app/checkpoint/qr/page.tsx
'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

export default function CheckpointQRPage() {
  // Replace with the dynamic data payload or routing url you want the QR code to point to
  const qrPayload = "https://example.com";
  const qrRef = useRef<SVGSVGElement>(null);
  const router= useRouter();
  // Triggers browser download of the generated code asset as an SVG file
  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const svgElement = qrRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "checkpoint-qr-code.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">
      
      {/* 1. Breadcrumbs Layout Block */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900"onClick={() => router.push('/admin/')}>CheckPoint</h1>
        <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <span className="text-amber-700 cursor-pointer hover:underline"onClick={() => router.push('/admin/dashboard')}>Home</span>
          <span>&gt;</span>
          <span className="text-amber-700 cursor-pointer hover:underline"onClick={() => router.push('/admin/checkpoint')}>CheckPoint</span>
          <span>&gt;</span>
          <span className="text-gray-500">QR</span>
        </nav>
      </div>

      {/* 2. Centered Functional Layout Pillar */}
      <div className="flex flex-col items-center justify-center py-4 space-y-6">
        
        {/* QR Code Presentation Box */}
        <div className="bg-white p-12 rounded border border-gray-100 shadow-sm flex items-center justify-center max-w-md w-full aspect-square">
          <QRCodeSVG
            ref={qrRef}
            value={qrPayload}
            size={280}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"} 
            includeMargin={false}
          />
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={handleDownloadQR}
          className="bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm px-8 py-2 rounded shadow-sm transition-colors duration-200"
        >
          Download
        </button>

      </div>
    </div>
  );
}
