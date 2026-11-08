
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VehicleOwner {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNo: string;
  isAssigned: 'Assigned' | 'Not Assi';
}

export default function AdminVehicleOwnerPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<VehicleOwner[]>([]);

  // Load vehicle owners
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tqms_vehicle_owners');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0].address !== undefined
        ) {
          setData(parsed);
          return;
        }
      }

      const initialSeed: VehicleOwner[] = [
       
       
         
       
      ];

      localStorage.setItem('tqms_vehicle_owners', JSON.stringify(initialSeed));
      setData(initialSeed);
    } catch (error) {
      console.error('Error loading vehicle owners:', error);
      setData([]);
    }
  }, []);

  // Search and filter
  const filteredOwners = useMemo(() => {
    return data.filter((owner) => {
      if (filterType !== 'All' && owner.isAssigned !== filterType) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();

        const matchesName = (owner.name || '')
          .toLowerCase()
          .includes(query);

        const matchesPhone = (owner.phoneNo || '')
          .includes(query);

        return matchesName || matchesPhone;
      }

      return true;
    });
  }, [data, filterType, searchQuery]);

  const handleClear = () => {
    setFilterType('All');
    setSearchQuery('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = (owner: VehicleOwner) => {
    router.push(`/admin/vehicle/new?editId=${owner.id}`);
  };

  const handleView = (owner: VehicleOwner) => {
    router.push(`/admin/vehicle/vehicle-owner/view?id=${owner.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">

      {/* HEADER */}
      <div className="flex justify-between items-start select-none">
        <div>
          <h1 className="text-base font-bold text-gray-800 tracking-tight">
            Vehicle/Owner
          </h1>

          <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <span
              className="text-amber-600 cursor-pointer hover:underline"
              onClick={() => router.push('/admin/dashboard')}
            >
              Home
            </span>

            <span className="text-gray-300 font-light">&gt;</span>
            <span className="text-gray-400 font-normal">
              Vehicle/Owner
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/vehicle/new')}
          className="text-xs font-semibold text-gray-500 hover:text-amber-700 transition cursor-pointer focus:outline-none"
        >
          + Add Vehicle Owner
        </button>
      </div>

      {/* SEARCH FILTERS */}
      <div className="bg-white rounded border border-gray-100 p-5 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end print:hidden">

        <div className="flex flex-col gap-1.5 md:col-span-3">
          <label className="text-xs font-bold text-gray-700">
            Verified/Unverified Vehicle Owner
          </label>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white outline-none focus:border-[#b06000] text-gray-600 cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Assigned">Assigned</option>
            <option value="Not Assi">Unassigned</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-3">
          <label className="text-xs font-bold text-gray-700">
            Vehicleowner Name/Number
          </label>

          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#b06000] text-gray-700"
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-6 md:justify-start pt-2 md:pt-0 select-none">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-600 text-xs font-bold rounded shadow-sm transition cursor-pointer"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => {
              // Filtering is already applied dynamically.
            }}
            className="px-5 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded shadow-sm transition cursor-pointer"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-600 text-xs font-bold rounded shadow-sm transition cursor-pointer ml-auto md:ml-4"
          >
            Print
          </button>
        </div>
      </div>

      {/* VEHICLE OWNER TABLE */}
      <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">

            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold text-[10px] bg-slate-50/40 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">S.N</th>
                <th className="py-3.5 px-4 w-64">Name/Company</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4 w-36">Phone No.</th>
                <th className="py-3.5 px-4 w-36">Linked Owner</th>
                <th className="py-3.5 px-4 w-32">IsAssigned</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-[11px] font-semibold text-gray-600 leading-normal">

              {filteredOwners.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-400 font-medium"
                  >
                    No matching vehicle owner entry items cataloged inside the database records registry.
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner, index) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >

                    <td className="py-5 px-4 text-center text-gray-400 font-bold">
                      {index + 1}
                    </td>

                    <td className="py-5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-gray-800 font-bold tracking-wide">
                          <span className="text-gray-400 font-normal mr-1">
                            Name:
                          </span>
                          {owner.name}
                        </div>

                        <div className="text-gray-500 font-mono text-[10px] font-medium">
                          <span className="text-gray-400 font-sans font-normal mr-1">
                            Email:
                          </span>
                          {owner.email || '—'}
                        </div>
                      </div>
                    </td>

                    <td
                      className="py-5 px-4 text-gray-500 font-medium max-w-xs truncate"
                      title={owner.address}
                    >
                      {owner.address}
                    </td>

                    <td className="py-5 px-4 font-mono font-bold text-gray-700 tracking-wide">
                      {owner.phoneNo}
                    </td>

                    <td className="py-5 px-4 text-gray-400 font-medium">
                      —
                    </td>

                    <td className="py-5 px-4 font-bold">
                      <div className="flex items-center justify-between gap-4">

                        <span
                          className={
                            owner.isAssigned === 'Assigned'
                              ? 'text-emerald-600'
                              : 'text-slate-700'
                          }
                        >
                          {owner.isAssigned}
                        </span>

                        {/* ACTION BUTTONS */}
                        <div className="flex items-center gap-2.5 text-blue-500 select-none print:hidden">

                          <button
                            type="button"
                            title="Edit Vehicle Owner"
                            onClick={() => handleEdit(owner)}
                            className="hover:text-blue-700 transition cursor-pointer"
                          >
                            📝
                          </button>

                          <button
                            type="button"
                            title="View Vehicle Owner"
                            onClick={() => handleView(owner)}
                            className="hover:text-emerald-700 transition cursor-pointer"
                          >
                            👁️
                          </button>

                        </div>
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
