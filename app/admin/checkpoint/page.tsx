
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Checkpoint {
  id: string;
  sn: number;
  name: string;
  type: string;
  state: string;
  district: string;
  region: string;
  geoLocation: string;
  address: string;
  email: string;
  isWeightMachineActive: boolean;
}

const STORAGE_KEY = 'tqms_checkpoints';

export default function CheckpointPage() {
  const router = useRouter();

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved checkpoints when the page opens
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setCheckpoints(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading checkpoints:', error);
    }
  }, []);

  // Toggle weight machine and save the updated data
  const toggleWeightMachine = (id: string) => {
    setCheckpoints((previousCheckpoints) => {
      const updatedCheckpoints = previousCheckpoints.map((item) =>
        item.id === id
          ? {
              ...item,
              isWeightMachineActive: !item.isWeightMachineActive,
            }
          : item
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedCheckpoints)
      );

      return updatedCheckpoints;
    });
  };

  // Search filter
  const filteredCheckpoints = checkpoints.filter((item) =>
    [
      item.name,
      item.address,
      item.email,
      item.type,
      item.state,
      item.district,
    ].some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            CheckPoint
          </h1>

          <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <span className="text-orange-600 cursor-pointer hover:underline">
              Home
            </span>

            <span>&gt;</span>

            <span className="text-gray-500">
              CheckPoint
            </span>
          </nav>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/checkpoint/add')}
          className="text-gray-400 hover:text-gray-400 font-medium text-sm flex items-center gap-1 transition"
        >
          <span className="text-lg font-bold">+</span>
          Add Checkpoint
        </button>
      </div>

      {/* CHECKPOINT LIST */}
      <div className="space-y-6">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 max-w-md">
          <input
            type="text"
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 placeholder-gray-400"
          />

          <button
            type="button"
            onClick={() => setSearchQuery(searchQuery)}
            className="bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-5 py-1.5 rounded transition shadow-sm"
          >
            Search
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[800px]">

            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-medium bg-white whitespace-nowrap">
                <th className="p-4 font-normal w-12">S.N</th>
                <th className="p-4 font-normal">Checkpoint Name</th>
                <th className="p-4 font-normal">Address</th>
                <th className="p-4 font-normal">Email</th>
                <th className="p-4 font-normal w-24">Action</th>
                <th className="p-4 font-normal w-40">
                  Wt. Machine(Dynamic)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredCheckpoints.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-400 text-sm bg-white"
                  >
                    No records found. Click "+ Add Checkpoint" to insert a record.
                  </td>
                </tr>
              ) : (
                filteredCheckpoints.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/50 transition-colors ${
                      idx % 2 === 0
                        ? 'bg-slate-50/20'
                        : 'bg-white'
                    }`}
                  >
                    <td className="p-4 text-slate-500 font-medium">
                      {item.sn}
                    </td>

                    <td className="p-4 text-slate-800 font-medium">
                      {item.name}
                    </td>

                    <td className="p-4 text-slate-500 break-words max-w-[240px]">
                      {item.address}
                    </td>

                    <td className="p-4 text-slate-500 break-all">
                      {item.email}
                    </td>

                    <td className="p-4">
                      <span className="text-gray-300" title="Edit functionality not added yet">
                        —
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center">
                        <button
                          type="button"
                          aria-label="Toggle weight machine"
                          aria-pressed={item.isWeightMachineActive}
                          onClick={() => toggleWeightMachine(item.id)}
                          className={`relative inline-flex h-5 w-11 items-center rounded-full transition-colors duration-200 outline-none ${
                            item.isWeightMachineActive
                              ? 'bg-blue-500'
                              : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                              item.isWeightMachineActive
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
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
