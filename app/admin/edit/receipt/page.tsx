'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ReceiptData {
  id: string;
  vehicleNo: string;
  from: string;
  to: string;
  grossWeight: number;
  entryDate: string;
  material: string;
  narration: string;
  queueNo?: string;
  feeAmount?: string;
  currentTime?: string;
}

function ReceiptPrintPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiptId = searchParams.get('id');

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    if (receiptId) {
      const saved = localStorage.getItem('tqms_live_queues');
      if (saved) {
        const items = JSON.parse(saved);
        const match = items.find((i: any) => i.id === receiptId);
        if (match) {
          setReceipt(match);
          return;
        }
      }
    }
    
    // Exact visual fallback mockup tracking parameters matching the screenshot template precisely
    setReceipt({
      id: 'mock',
      vehicleNo: 'State-1-11-AA-3434',
      from: 'Maiwakhola',
      to: 'Sidingba',
      grossWeight: 123.00,
      entryDate: '2083-07-21',
      material: 'goli',
      narration: 'Hello sir. How do you do?',
      feeAmount: '100.00',
      currentTime: '05:05 PM'
    });
  }, [receiptId]);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    // Redirects cleanly back to the main master multi-column operational board
    router.push('/admin/queue');
  };

  if (!receipt) return <div className="p-8 text-sm text-gray-400">Loading invoice structure...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans print:bg-white print:p-0 flex flex-col">
      
      {/* 1. TOP BAR SECTION (Hidden automatically during native window.print execution) */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shadow-sm shrink-0 print:hidden select-none">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-gray-800 tracking-wide">सवारी लाम प्रवेश रसिद</h1>
          <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <span className="text-amber-600" onClick={() => router.push('/admin/dashboard')}>
              Dashboard
            </span>
            <span className="font-light text-gray-300">&gt;</span>
            <span className="text-amber-600"onClick={() => router.push('/admin/queue')}>Queue List</span>
          </div>
        </div>

        {/* Action Action Controls Buttons Block Grid */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded shadow transition duration-150 cursor-pointer focus:outline-none"
          >
            Print
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded shadow transition duration-150 cursor-pointer focus:outline-none"
          >
            Close
          </button>
        </div>
      </header>

      {/* 2. CORE CENTERED DOCUMENT VIEWSPACE OUTLET BOX */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-12 print:p-0 print:block">
        <div className="bg-white border border-gray-400 w-full max-w-[660px] p-6 text-[11px] text-gray-800 shadow-md font-sans leading-relaxed relative print:border-none print:shadow-none mx-auto">
          
          {/* PAN & Metadata string elements */}
          <div className="flex justify-between items-start text-[9px] font-mono text-gray-400 select-none mb-1">
            <span>lalalal: &nbsp; qawesrtyhgfdsadfgh</span>
            <span>पान नं: 852100017</span>
          </div>

          {/* Central Invoice Title Headers Layer */}
          <div className="text-center space-y-0.5">
            <h2 className="text-base font-black text-gray-900 tracking-wide">नेपाल ट्रक यातायात व्यवसायी महासंघ</h2>
            <p className="text-[11px] font-bold text-gray-600">Loadboard sthaniya</p>
            <p className="text-[9px] text-gray-400 font-mono">फोन नं: 01-9863333,013-5555555</p>
          </div>

          {/* Core Log Parameters Details Layer */}
          <div className="grid grid-cols-12 gap-y-1.5 border-y border-dashed border-gray-300 py-3 mt-4 text-gray-600 font-semibold">
            <div className="col-span-3">रसिद नं:</div>
            <div className="col-span-9 font-mono font-bold text-gray-900">INX_2026_2_8</div>
            
            <div className="col-span-3">मिति:</div>
            <div className="col-span-3 font-mono font-bold text-gray-900">{receipt.entryDate}</div>
            <div className="col-span-3 text-right">समय:</div>
            <div className="col-span-3 text-right font-mono font-bold text-gray-900">{receipt.currentTime || '05:05 PM'}</div>
            
            <div className="col-span-3">तौलस्थान:</div>
            <div className="col-span-9 font-bold text-gray-900">lodbod checkpoint</div>
            
            <div className="col-span-3">सवारी नं:</div>
            <div className="col-span-9 font-mono font-bold text-gray-900">{receipt.vehicleNo}</div>
            
            <div className="col-span-3">सामान:</div>
            <div className="col-span-9 font-bold text-gray-900">{receipt.material}</div>
            
            <div className="col-span-3">तौल:</div>
            <div className="col-span-9 font-mono font-bold text-gray-900">{Number(receipt.grossWeight).toFixed(2)} (Kg)</div>
          </div>

          {/* Pricing Ledger Layout spreadsheet grid */}
          <div className="w-full border border-gray-400 rounded-sm overflow-hidden mt-5">
            <div className="grid grid-cols-12 bg-white border-b border-gray-400 p-2 font-bold text-gray-800 select-none text-left">
              <div className="col-span-8 pl-1 text-xs">विवरण</div>
              <div className="col-span-4 pl-4 text-xs">रकम (रू.)</div>
            </div>
            
            <div className="grid grid-cols-12 p-2.5 items-center border-b border-gray-300 font-semibold text-gray-600">
              <div className="col-span-8 pl-1">काटा शुल्क</div>
              <div className="col-span-4 pl-4 font-mono font-bold text-gray-900">{Number(receipt.feeAmount || 100).toFixed(2)}</div>
            </div>

            <div className="grid grid-cols-12 bg-white p-2.5 font-bold text-gray-900 text-xs items-center select-none">
              <div className="col-span-8 pl-1 text-sm font-black">जम्मा शुल्क</div>
              <div className="col-span-4 pl-4 font-mono text-sm font-black">{Number(receipt.feeAmount || 100).toFixed(2)}</div>
            </div>
          </div>

          {/* Footer Remarks String & Signature Marks */}
          <div className="grid grid-cols-2 pt-6 mt-4 items-end text-gray-600 font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 block font-bold select-none uppercase">विवरण:</span>
              <p className="text-gray-800 font-bold">Hello sir. How do you do?</p>
            </div>
            <div className="text-right space-y-1 select-none">
              <span className="text-[10px] text-gray-400 block font-bold uppercase">बुझाउने</span>
              <p className="text-gray-900 font-bold font-mono text-[10px] pt-4">lodbod checkpoint</p>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default function ReceiptPrintPreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Rendering receipt system view...</div>}>
      <ReceiptPrintPreviewContent />
    </Suspense>
  );
}
