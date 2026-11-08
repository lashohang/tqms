
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
  status: 'pending' | 'in_job' | 'completed';
  queueNo?: string;
  vehicleType?: string;
  checkpointEntry?: string;

  // Additional report fields
  receiptNo?: string;
  checkpointName?: string;
  material?: string;
  completedAt?: string;
  owner?: string;
}

function QueueDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewId = searchParams.get('id');

  const [item, setItem] = useState<QueueItem | null>(null);

  // =========================================================
  // LOAD ACTIVE OR COMPLETED JOURNEY
  // =========================================================
  useEffect(() => {
    if (!viewId) {
      setItem(null);
      return;
    }

    try {
      const activeSaved = localStorage.getItem('tqms_live_queues');
      const completedSaved = localStorage.getItem(
        'tqms_completed_journeys'
      );

      const activeItems: QueueItem[] = activeSaved
        ? JSON.parse(activeSaved)
        : [];

      const completedItems: QueueItem[] = completedSaved
        ? JSON.parse(completedSaved)
        : [];

      // First check completed journeys
      const completedMatch = completedItems.find(
        (i) => i.id === viewId
      );

      if (completedMatch) {
        setItem(completedMatch);
        return;
      }

      // Then check active journeys
      const activeMatch = activeItems.find(
        (i) => i.id === viewId
      );

      if (activeMatch) {
        setItem(activeMatch);
        return;
      }

      // No matching record found
      setItem(null);
    } catch (error) {
      console.error('Error loading queue details:', error);
      setItem(null);
    }
  }, [viewId]);

  // =========================================================
  // END JOURNEY
  // =========================================================
  const handleEndJourney = () => {
    if (!item || item.status === 'completed') return;

    if (
      !confirm(
        'Are you sure you want to end the journey for this vehicle?'
      )
    ) {
      return;
    }

    try {
      // Get active journeys
      const saved = localStorage.getItem('tqms_live_queues');

      const activeItems: QueueItem[] = saved
        ? JSON.parse(saved)
        : [];

      // Find the selected journey
      const journey = activeItems.find(
        (i) => i.id === item.id
      );

      if (!journey) {
        alert('This journey was not found in the active queue.');
        return;
      }

      // Get previously completed journeys
      const completedSaved = localStorage.getItem(
        'tqms_completed_journeys'
      );

      const completedItems: QueueItem[] = completedSaved
        ? JSON.parse(completedSaved)
        : [];

      // Create completed journey record
      const completedJourney: QueueItem = {
        ...journey,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      // Save completed journey
      const updatedCompletedItems = [
        ...completedItems.filter(
          (i) => i.id !== journey.id
        ),
        completedJourney,
      ];

      localStorage.setItem(
        'tqms_completed_journeys',
        JSON.stringify(updatedCompletedItems)
      );

      // Remove journey from active queue
      const updatedActiveItems = activeItems.filter(
        (i) => i.id !== journey.id
      );

      localStorage.setItem(
        'tqms_live_queues',
        JSON.stringify(updatedActiveItems)
      );

      // Update the current page without navigating away
      setItem(completedJourney);

      alert('Journey completed successfully!');
    } catch (error) {
      console.error('Error completing journey:', error);
      alert('Unable to complete journey. Please try again.');
    }
  };

  // =========================================================
  // LOADING / NOT FOUND
  // =========================================================
  if (!item) {
    return (
      <div className="p-8 text-sm text-gray-400">
        No queue details found for this vehicle.
      </div>
    );
  }

  // =========================================================
  // PAGE DESIGN
  // =========================================================
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">

      {/* 1. TOP HEADER & NAVIGATION ROW */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">
            Queue Detail
          </h1>

          <div className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1 select-none">
            <span
              className="text-[#b06000] cursor-pointer hover:underline"
              onClick={() => router.push('/admin/home')}
            >
              Dashboard
            </span>

            <span className="text-gray-300 font-light">&gt;</span>

            <span
              className="text-[#b06000] cursor-pointer hover:underline"
              onClick={() => router.push('/admin/queue')}
            >
              Queue List
            </span>

            <span className="text-gray-300 font-light">&gt;</span>

            <span className="text-gray-400 font-normal">
              Queue Detail View
            </span>
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

      {/* 2. VEHICLE BACKGROUND PROFILE */}
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

          <span
            className={`px-2 py-0.5 text-white font-extrabold text-[9px] rounded uppercase tracking-wider select-none ${
              item.status === 'completed'
                ? 'bg-gray-500'
                : 'bg-emerald-500'
            }`}
          >
            {item.status === 'completed' ? 'Completed' : 'In Job'}
          </span>
        </div>

        {/* Parameter labels */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-semibold text-gray-500 pt-1 border-t border-gray-50">

          <p>
            <span className="text-gray-400 font-medium">
              Card Number:
            </span>{' '}
            {item.vehicleNo}
          </p>

          <p>
            <span className="text-gray-400 font-medium">
              Card Type:
            </span>{' '}
            Trip
          </p>

          <p>
            <span className="text-gray-400 font-medium">
              Vehicle Type:
            </span>{' '}
            {item.vehicleType || ''}
          </p>

          <p>
            <span className="text-gray-400 font-medium">
              Owner:
            </span>{' '}
            {item.owner || ''}
          </p>
        </div>
      </div>

      {/* 3. MULTI-COLUMN TRACKING DATA TABLE */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">

          <table className="w-full text-left border-collapse min-w-[1000px]">

            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold text-[11px] uppercase bg-slate-50/50 select-none tracking-wider text-center">

                <th className="py-4 px-3 text-left w-16 pl-4">
                  S.N
                </th>

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

                <td className="py-6 px-3 text-left pl-4 font-bold text-gray-400">
                  1
                </td>

                <td className="py-6 px-3 font-mono text-gray-700 font-bold">
                  {item.entryDate}
                </td>

                <td className="py-6 px-3 text-gray-500">
                  {item.from}
                </td>

                <td className="py-6 px-3 text-gray-500">
                  {item.to}
                </td>

                {/* Weight columns */}
                <td className="py-6 px-3 font-mono font-bold text-gray-700">
                  {Number(item.grossWeight || 0).toFixed(2)}
                </td>

                <td className="py-6 px-3 font-mono text-gray-300">
                  0.00
                </td>

                <td className="py-6 px-3 font-mono text-gray-300">
                  0.00
                </td>

                {/* Checkpoint 1 stamp */}
                <td className="py-4 px-2 select-none">
                  <div className="border-[2px] border-double border-slate-400 text-slate-500/80 rounded px-2 py-1 uppercase font-black tracking-widest text-[10px] leading-tight rotate-[-4deg] inline-block shadow-sm scale-95 font-mono">
                    LODBOD
                    <span className="block text-[8px] tracking-tight font-bold mt-0.5 border-t border-slate-300 pt-0.5">
                      CHECKPOINT
                    </span>
                  </div>
                </td>

                <td className="py-6 px-3 font-mono font-bold text-gray-500">
                  INX_2026_7
                </td>

                {/* Empty checkpoint placeholders */}
                <td className="py-6 px-3 text-gray-300">—</td>
                <td className="py-6 px-3 text-gray-300">—</td>
                <td className="py-6 px-3 text-gray-300">—</td>

                {/* ACTION BUTTONS */}
                <td className="py-4 px-3 text-right pr-6 select-none">
                  <div className="flex items-center justify-end gap-2">

                    {/* Check In button */}
                    {item.status !== 'completed' &&
                      item.checkpointSaved !== true && (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/admin/edit/view?editId=${encodeURIComponent(
                                item.id
                              )}`
                            )
                          }
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black rounded-full shadow transition-all duration-150 outline-none uppercase tracking-wide cursor-pointer whitespace-nowrap"
                        >
                          + Check In
                        </button>
                      )}

                    {/* End Journey button */}
                    {item.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={handleEndJourney}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black rounded-full shadow transition-all duration-150 outline-none uppercase tracking-wide cursor-pointer whitespace-nowrap"
                      >
                        + End Journey
                      </button>
                    )}

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

// =========================================================
// MAIN PAGE
// =========================================================
export default function QueueDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-gray-400">
          Loading analytical grid logs...
        </div>
      }
    >
      <QueueDetailContent />
    </Suspense>
  );
}
