'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface QueueItem {
    checkpointSaved?: boolean;
  id: string;
  vehicleNo: string;
  from: string;
  to: string;
  grossWeight: number;
  entryDate: string;
  companyName?: string;
  loadDetails?: string;
  narration?: string;
  driversPhone?: string;
  status: 'pending' | 'in_job';
  queueNo?: string;
  vehicleType?: string;
  checkpointEntry?: string;
}

function QueueDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewId = searchParams.get('id');

  const [item, setItem] = useState<QueueItem | null>(null);

  useEffect(() => {
    if (viewId) {
      const saved = localStorage.getItem('tqms_live_queues');
      if (saved) {
        const items = JSON.parse(saved);
        const match = items.find((i: any) => i.id === viewId);
        if (match) {
          setItem(match);
          return;
        }
      }
    }

    // Default snapshot baseline dataset matching your screenshot parameters perfectly
    setItem({
      id: 'mock-192284',
      vehicleNo: 'JA-345-GA-5554',
      from: 'Maiwakhola',
      to: 'Sidingba',
      grossWeight: 23.00,
      entryDate: '2083-07-21',
      status: 'in_job',
      queueNo: '192284',
      vehicleType: 'Bulker 12 wheeler',
      checkpointEntry: 'First Checkpoint'
    });
  }, [viewId]);

  const handleEndJourney = () => {
    if (!item) return;
    if (confirm('Are you sure you want to end the journey for this vehicle?')) {
      const saved = localStorage.getItem('tqms_live_queues');
      if (saved) {
        const items: QueueItem[] = JSON.parse(saved);
        const updated = items.filter(i => i.id !== item.id);
        localStorage.setItem('tqms_live_queues', JSON.stringify(updated));
      }
      router.push('/admin/queue');
    }
  };

  if (!item) return <div className="p-8 text-sm text-gray-400">Loading queue metadata parameters...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & NAVIGATION ROW */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">Queue Detail</h1>
          <div className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1 select-none">
            <span className="text-[#b06000] cursor-pointer hover:underline" onClick={() => router.push('/admin/home')}>Dashboard</span>
            <span className="text-gray-300 font-light">&gt;</span>
            <span className="text-[#b06000] cursor-pointer hover:underline" onClick={() => router.push('/admin/queue')}>Queue List</span>
            <span className="text-gray-300 font-light">&gt;</span>
            <span className="text-gray-400 font-normal">Queue Detail View</span>
          </div>
        </div>

        {/* Top-Right Navigation Shortcut */}
        <button
          type="button"
          onClick={() => router.push('/admin/queue')}
          className="px-5 py-2.5 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded-md shadow-sm transition flex items-center gap-2 focus:outline-none cursor-pointer"
        >
          <span>☰</span> Queue List
        </button>
      </div>

      {/* 2. VEHICLE BACKGROUND PROFILE CRADLE */}
      <div className="bg-white rounded border border-gray-100 p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2 py-0.5 border border-gray-300 rounded bg-gray-50 text-gray-500 font-mono text-[10px] font-bold">
            Queue Number: {item.queueNo || '192284'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black text-gray-800 tracking-wide">
            Vehicle Number: {item.vehicleNo}
          </h2>
          <span className="px-2 py-0.5 bg-emerald-500 text-white font-extrabold text-[9px] rounded uppercase tracking-wider select-none">
            In Job
          </span>
        </div>

        {/* Parameter labels list row layout text matching image */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-semibold text-gray-500 pt-1 border-t border-gray-50">
          <p><span className="text-gray-400 font-medium">Card Number:</span> {item.vehicleNo}</p>
          <p><span className="text-gray-400 font-medium">Card Type:</span> Trip</p>
          <p><span className="text-gray-400 font-medium">Vehicle Type:</span> {item.vehicleType || ''}</p>
          <p><span className="text-gray-400 font-medium">Owner:</span> {item.owner || ''}</p>
        </div>
      </div>

      {/* 3. MULTI-COLUMN TRACKING DATA PRIMITIVES TABLE GRID MATRIX */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold text-[11px] uppercase bg-slate-50/50 select-none tracking-wider text-center">
                <th className="py-4 px-3 text-left w-16 pl-4">S.N</th>
                <th className="py-4 px-3">Entry Date</th>
                <th className="py-4 px-3">From</th>
                <th className="py-4 px-3">To</th>
                <th className="py-4 px-3">CP1 Wt.(kg)</th>
                <th className="py-4 px-3">CP2 Wt.(kg)</th>
                <th className="py-4 px-3">CP3 Wt.(kg)</th>
                <th className="py-4 px-3">CP 1</th>
                <th className="py-4 px-3">CP1 BillNo</th>
                <th className="py-4 px-3">CP 2</th>
                <th className="py-4 px-3">CP2 BillNo</th>
                <th className="py-4 px-3">CP 3</th>
                <th className="py-4 px-3 pr-6">CP3 BillNo</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-gray-600 text-center divide-y divide-gray-100">
              <tr className="hover:bg-slate-50/30 transition-colors">
                <td className="py-6 px-3 text-left pl-4 font-bold text-gray-400">1</td>
                <td className="py-6 px-3 font-mono text-gray-700 font-bold">{item.entryDate}</td>
                <td className="py-6 px-3 text-gray-500">{item.from}</td>
                <td className="py-6 px-3 text-gray-500">{item.to}</td>
                
                {/* Dynamically renders captured weights rows metrics blocks */}
                <td className="py-6 px-3 font-mono font-bold text-gray-700">{Number(item.grossWeight || 0).toFixed(2)}</td>
                <td className="py-6 px-3 font-mono text-gray-300">0.00</td>
                <td className="py-6 px-3 font-mono text-gray-300">0.00</td>
                
                {/* Custom Rubber Blueprint Stamp Container Replica */}
                <td className="py-4 px-2 select-none">
                  <div className="border-[2px] border-double border-slate-400 text-slate-500/80 rounded px-2 py-1 uppercase font-black tracking-widest text-[10px] leading-tight rotate-[-4deg] inline-block shadow-sm scale-95 font-mono">
                    LODBOD
                    <span className="block text-[8px] tracking-tight font-bold mt-0.5 border-t border-slate-300 pt-0.5">CHECKPOINT</span>
                  </div>
                </td>

                <td className="py-6 px-3 font-mono font-bold text-gray-500">INX_2026_7</td>
                
                {/* Empty Node Channels Column Fillers placeholders */}
                <td className="py-6 px-3 text-gray-300">—</td>
                <td className="py-6 px-3 text-gray-300">—</td>
                <td className="py-6 px-3 text-gray-300">—</td>
                
                
<td className="py-4 px-3 text-right pr-6 select-none">
  <div className="flex items-center justify-end gap-2">
    {item.checkpointSaved !== true && (
      <button
        type="button"
        onClick={() =>
          router.push(
            `/admin/edit/view?editId=${encodeURIComponent(item.id)}`
          )
        }
        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black rounded-full shadow transition-all duration-150 outline-none uppercase tracking-wide cursor-pointer whitespace-nowrap"
      >
        + Check In
      </button>
    )}

    <button
      type="button"
      onClick={handleEndJourney}
      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black rounded-full shadow transition-all duration-150 outline-none uppercase tracking-wide cursor-pointer whitespace-nowrap"
    >
      + End Journey
    </button>
  </div>
</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default function QueueDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading analytical grid logs...</div>}>
      <QueueDetailContent />
    </Suspense>
  );
}
