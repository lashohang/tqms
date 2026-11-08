'use client';

import React, { useMemo, useState } from 'react';
import { OtherVehicle } from '../types/otherVehicle.types';

interface OtherVehicleListProps {
  vehicles: OtherVehicle[];
    onAdd: () => void;
}

export default function OtherVehicleList({
  vehicles,
  onAdd,
}: OtherVehicleListProps) {
  const [filterType, setFilterType] = useState('All');
  const [searchNumber, setSearchNumber] = useState('');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesType =
        filterType === 'All' || vehicle.plateType === filterType;

      const matchesNumber = vehicle.formattedNo
        .toLowerCase()
        .includes(searchNumber.toLowerCase());

      return matchesType && matchesNumber;
    });
  }, [vehicles, filterType, searchNumber]);

  const handleClear = () => {
    setFilterType('All');
    setSearchNumber('');
  };

  return (
    <div className="space-y-6">

      {/* TOP FILTER AND SEARCH */}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Others Vehicle
            </label>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-300"
            >
              <option value="All">All</option>
              <option value="Indian">Indian</option>
              <option value="Unregistered">Unregistered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Other's Vehicle
            </label>

            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={handleClear}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-5 py-2 rounded transition"
            >
              Clear
            </button>

            <button
              type="button"
              className="bg-white hover:bg-slate-50 border border-gray-200 text-slate-600 text-sm font-medium px-5 py-2 rounded transition"
            >
              Search
            </button>
          </div>

        </div>
      </div>

      {/* VEHICLE TABLE */}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">

        <table className="w-full border-collapse text-left text-sm">

          <thead>
            <tr className="border-b border-gray-200 text-gray-400 text-xs tracking-wider bg-white">
              <th className="p-4 font-medium w-16">S.N</th>
              <th className="p-4 font-medium">Formated No.</th>
              <th className="p-4 font-medium">Number Type</th>
              <th className="p-4 font-medium">Plate Type</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {filteredVehicles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-400 text-sm"
                >
                  No vehicle records found. Click "+ Add Other Vehicle" to
                  insert a record.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((item, idx) => (
                <tr
                  key={item.sn}
                  className={`hover:bg-slate-50/50 transition-colors ${
                    idx % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'
                  }`}
                >
                  <td className="p-4 text-slate-500 font-medium">
                    {item.sn}
                  </td>

                  <td className="p-4 text-slate-800 font-medium break-all">
                    {item.formattedNo}
                  </td>

                  <td className="p-4 text-slate-600">
                    {item.numberType}
                  </td>

                  <td className="p-4 text-slate-600">
                    {item.plateType}
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

  

    </div>
  );
}