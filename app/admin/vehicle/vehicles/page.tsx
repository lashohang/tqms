'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VehicleItem {
  id: number;
  plateNo: string;
  lotNo: string;
  vehicleNumber: string;
  vehicleType: string;
}

export default function AdminVehicleListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<VehicleItem[]>([]);

  // Seed default dataset precisely matching your user interface screenshot strings values


  // Filter rows dynamically based on the formatted vehicle number string token input
  const filteredVehicles = useMemo(() => {
    return data.filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.plateNo.toLowerCase().includes(query) ||
        item.vehicleNumber.includes(query)
      );
    });
  }, [data, searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER NAVIGATION AND ACTION BAR ROW */}
      <div className="flex justify-between items-start select-none">
        <div>
          <h1 className="text-base font-bold text-gray-800 tracking-tight">Vehicle</h1>
          <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <span className="text-amber-600 cursor-pointer hover:underline" onClick={() => router.push('/admin/home')}>Home</span>
            <span className="text-gray-300 font-light">&gt;</span>
            <span className="text-gray-400 font-normal">Vehicle</span>
          </div>
        </div>

        {/* Add Vehicle Subpage Action Trigger */}
        <button
          type="button"
          onClick={() => router.push('/admin/vehicle/create')}
          className="text-xs font-semibold text-gray-500 hover:text-amber-700 transition cursor-pointer focus:outline-none"
        >
          + Add Vehicle
        </button>
      </div>

      {/* 2. SEARCH FILTER INPUT CONTAINER PANEL */}
      <div className="bg-white rounded border border-gray-100 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-end gap-4">
        <div className="flex flex-col gap-1.5 w-full max-w-xs">
          <label className="text-xs font-bold text-gray-700 select-none">Formatted Number</label>
          <input 
            type="text" 
            placeholder="Search number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#b06000] text-gray-700 h-[34px]"
          />
        </div>

        <div className="flex items-center gap-2 select-none h-[34px]">
          <button 
            type="button" 
            onClick={handleClear}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-600 text-xs font-bold rounded shadow-sm transition focus:outline-none h-full cursor-pointer"
          >
            Clear
          </button>
          <button 
            type="button" 
            className="px-5 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded shadow-sm transition focus:outline-none h-full cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* 3. MULTI-COLUMN VEHICLE LIST MATRIX display */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold text-[10px] bg-slate-50/40 select-none uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">S.N</th>
                <th className="py-3.5 px-4 w-60">Plate No</th>
                <th className="py-3.5 px-4 w-32">Lot No</th>
                <th className="py-3.5 px-4 w-40">Vehicle Number</th>
                <th className="py-3.5 px-4">Vehicle Type</th>
                <th className="py-3.5 px-4 w-28 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px] font-semibold text-gray-500 leading-normal">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">
                    Hello no vehicles.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* S.N Column */}
                    <td className="py-4 px-4 text-center text-gray-400 select-none font-bold">
                      {index + 1}
                    </td>

                    {/* Plate No Column */}
                    <td className="py-4 px-4 text-gray-700 font-bold tracking-wide">
                      {vehicle.plateNo}
                    </td>

                    {/* Lot No Column */}
                    <td className="py-4 px-4 font-mono text-gray-600 font-bold">
                      {vehicle.lotNo || '—'}
                    </td>

                    {/* Vehicle Number Column */}
                    <td className="py-4 px-4 font-mono text-gray-600 font-bold">
                      {vehicle.vehicleNumber}
                    </td>

                    {/* Vehicle Type Description Column */}
                    <td className="py-4 px-4 text-gray-500 font-medium font-sans">
                      {vehicle.vehicleType}
                    </td>

                    {/* Action Column mapping icon control triggers */}
                    <td className="py-4 px-4 text-right pr-6 select-none print:hidden">
                      <div className="flex items-center justify-end gap-3 text-blue-500">
                        <button type="button" className="hover:text-blue-700 transition cursor-pointer text-xs" title="Edit Vehicle Details">
                          📝
                        </button>
                        <button type="button" className="hover:text-blue-700 transition cursor-pointer text-xs" title="View Detailed Logistics Tracking">
                          👁️
                        </button>
                      </div>
                    </td>

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
