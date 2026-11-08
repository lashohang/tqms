// app/detail-entry-report/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

// Explicit type matching the exact structure from the layout image
interface ReportEntry {
  sn: number;
  dateAndTime: string;
  receiptNo: string;
  vehicleNo: string;
  vehicleType: string;
  checkpointName: string;
  fromToRoute: string;
  grossWeightKg: number;
  material: string;
  remarks: string;
}

export default function DetailEntryReportPage() {
  // 1. Filter input state elements
  const [startDate, setStartDate] = useState<string>('2083-07-22');
  const [endDate, setEndDate] = useState<string>('2083-07-22');
  const [vehicleNo, setVehicleNo] = useState<string>('');
  const [goodsDetails, setGoodsDetails] = useState<string>('');
  const [billNo, setBillNo] = useState<string>('');

  // 2. Data array state initialized completely empty as requested
const [entries, setEntries] = useState<ReportEntry[]>([]);

useEffect(() => {
  const saved = localStorage.getItem('tqms_completed_journeys');

  if (saved) {
    const completedJourneys = JSON.parse(saved);

    const reportEntries: ReportEntry[] = completedJourneys.map(
      (item: any, index: number) => ({
        sn: index + 1,
        dateAndTime: item.completedAt || item.entryDate || '',
        receiptNo: item.receiptNo || '',
        vehicleNo: item.vehicleNo || '',
        vehicleType: item.vehicleType || '',
        checkpointName: item.checkpointName || item.checkpointEntry || '',
        fromToRoute: `${item.from || ''} - ${item.to || ''}`,
        grossWeightKg: Number(item.grossWeight || 0),
        material: item.material || item.loadDetails || '',
        remarks: item.narration || '',
      })
    );

    setEntries(reportEntries);
  }
}, []);
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setVehicleNo('');
    setGoodsDetails('');
    setBillNo('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Insert your live data query logic / API fetch handler routines here
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">
      
      {/* Top Header Block & Breadcrumbs */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
        <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <span className="text-orange-600 cursor-pointer hover:underline">Home</span>
          <span>&gt;</span>
          <span className="text-gray-500">Reports</span>
        </nav>
      </div>

      {/* Main Content Layout Container */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 space-y-6">
        
        {/* Action Panel Row: Print & Export Controls */}
        <div className="flex justify-end items-center gap-3">
          <button className="bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 text-xs px-4 py-2 rounded shadow-sm transition">
            Print
          </button>
          <button className="bg-white border border-gray-200 text-slate-700 hover:bg-slate-50 text-xs px-4 py-2 rounded shadow-sm transition">
            Export Excel
          </button>
        </div>

        {/* Multi-Parameter Search Filtering Grid */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 items-end border-b border-gray-50 pb-6">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Start Date</label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">End Date</label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">VehicleNo</label>
            <select
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
            >
              <option value="">Select..</option>
              {/* Populated dynamically from outer vehicle list data sets */}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Goods Details</label>
            <select
              value={goodsDetails}
              onChange={(e) => setGoodsDetails(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
            >
              <option value="">Select..</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Bill No</label>
            <select
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
            >
              <option value="">Select..</option>
            </select>
          </div>

          {/* Filtering Action Triggers */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium py-2 rounded transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-full bg-white border border-gray-200 text-slate-400 text-xs font-medium py-2 rounded hover:bg-slate-50 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Tabular Matrix Screen Block */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[1000px]">
            <thead>
              <tr className="text-gray-400 font-medium whitespace-nowrap border-b border-gray-200">
                <th className="pb-3 pt-1 px-2 font-normal w-12">S.N</th>
                <th className="pb-3 pt-1 px-2 font-normal">Date & Time</th>
                <th className="pb-3 pt-1 px-2 font-normal">Reciept No</th>
                <th className="pb-3 pt-1 px-2 font-normal">Vehicle No</th>
                <th className="pb-3 pt-1 px-2 font-normal">Vehicle Type</th>
                <th className="pb-3 pt-1 px-2 font-normal">Checkpoint Name</th>
                <th className="pb-3 pt-1 px-2 font-normal">From - To (Route)</th>
                <th className="pb-3 pt-1 px-2 font-normal">Gross Weight (in kg)</th>
                <th className="pb-3 pt-1 px-2 font-normal">Material</th>
                <th className="pb-3 pt-1 px-2 font-normal">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-400 text-sm">
                    No records loaded. Modify filters and click Search to query vehicle records.
                  </td>
                </tr>
              ) : (
                entries.map((item, idx) => (
                  <tr key={item.sn} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-slate-500 font-medium">{item.sn}</td>
                    <td className="p-3 text-slate-600 whitespace-pre-line">{item.dateAndTime}</td>
                    <td className="p-3 text-blue-500 font-medium hover:underline cursor-pointer break-all">{item.receiptNo}</td>
                    <td className="p-3 text-blue-500 font-medium hover:underline cursor-pointer break-all">{item.vehicleNo}</td>
                    <td className="p-3 text-slate-600">{item.vehicleType}</td>
                    <td className="p-3 text-slate-600">{item.checkpointName}</td>
                    <td className="p-3 text-slate-600">{item.fromToRoute}</td>
                    <td className="p-3 text-slate-600 font-medium">{item.grossWeightKg.toFixed(2)}</td>
                    <td className="p-3 text-slate-600 break-all">{item.material}</td>
                    <td className="p-3 text-slate-400 break-words max-w-[200px]">{item.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
