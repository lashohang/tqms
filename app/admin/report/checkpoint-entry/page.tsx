// app/reports/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReportRow {
  sn: number;
  sthaniyaSangh: string;
  checkpoint: string;
  checkpointUser: string;
  entryDate: string;
  totalVehicle: number;
  totalAmount: number;
}

export default function ReportsPage() {
  // Filter panel inputs state management
  const router = useRouter();
  const [checkpointUser, setCheckpointUser] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2083-07-22');
  const [endDate, setEndDate] = useState<string>('2083-07-22');

  // Hardcoded layout baseline array matching the dashboard view exactly
  const initialData: ReportRow[] = [
    {
      sn: 1,
      sthaniyaSangh: "Loadboard sthaniya",
      checkpoint: "lodbod checkpoint",
      checkpointUser: "lodbod checkpoint",
      entryDate: "2026 11 08",
      totalVehicle: 2,
      totalAmount: 100,
    }
  ];

  const [reportData, setReportData] = useState<ReportRow[]>(initialData);

  // Derive column summary aggregate totals dynamically
  const overallTotalVehicles = reportData.reduce((acc, current) => acc + current.totalVehicle, 0);
  const overallTotalAmount = reportData.reduce((acc, current) => acc + current.totalAmount, 0);

  const handleClear = () => {
    setCheckpointUser('');
    setStartDate('');
    setEndDate('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Connect your query filtration or fetch handlers here
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">
      
      {/* 1. Page Header Titles & Breadcrumbs block */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
        <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <span className="text-orange-600 cursor-pointer hover:underline"onClick={() => router.push('/admin/dashboard')}>Home</span>
          <span>&gt;</span>
          <span className="text-gray-500">Reports</span>
        </nav>
      </div>

      {/* 2. Global Filter Panel Block */}
      <div className="bg-white rounded shadow-sm border border-gray-100 p-5 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Checkpoint/User Name</label>
            <input
              type="text"
              value={checkpointUser}
              onChange={(e) => setCheckpointUser(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Start Date</label>
            <input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-300 text-gray-600"
/>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">End Date</label>
            <input
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
  min={startDate || undefined}
  className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-300 text-gray-600"
/>
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium py-2 rounded transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-full bg-white hover:bg-slate-50 border border-gray-200 text-slate-400 text-xs font-medium py-2 rounded transition"
            >
              Search
            </button>
          </div>

        </form>
      </div>

      {/* 3. Tabular Matrix Board Overview */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 font-medium whitespace-nowrap">
              <th className="p-4 font-normal w-12">S.N</th>
              <th className="p-4 font-normal">Sthaniya Sangh</th>
              <th className="p-4 font-normal">Checkpoint</th>
              <th className="p-4 font-normal">Checkpoint User</th>
              <th className="p-4 font-normal">Entry Date</th>
              <th className="p-4 font-normal">Total Vehicle</th>
              <th className="p-4 font-normal">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reportData.map((item) => (
              <tr key={item.sn} className="bg-slate-50/40 hover:bg-slate-50/70 transition-colors">
                <td className="p-4 text-slate-400 font-medium">{item.sn}</td>
                <td className="p-4 text-slate-500 font-medium">{item.sthaniyaSangh}</td>
                <td className="p-4 text-slate-500 font-medium">{item.checkpoint}</td>
                <td className="p-4 text-slate-500 font-medium">{item.checkpointUser}</td>
                <td className="p-4 text-slate-500 font-medium">{item.entryDate}</td>
                <td className="p-4 text-blue-500 font-medium hover:underline cursor-pointer">{item.totalVehicle}</td>
                <td className="p-4 text-slate-600 font-medium">{item.totalAmount}</td>
              </tr>
            ))}

            {/* 4. Exact Explicit Totals Aggregation Row Panel */}
            {reportData.length > 0 && (
              <tr className="bg-white font-bold text-slate-800">
                <td colSpan={4} className="p-4"></td>
                <td className="p-4 text-left text-sm font-bold text-slate-900">Total</td>
                <td className="p-4 text-sm font-bold text-slate-900">{overallTotalVehicles}</td>
                <td className="p-4 text-sm font-bold text-slate-900">{overallTotalAmount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
    