'use client';

import React, { useState } from 'react';

import OtherVehicleList from './OtherVehicleList';
import OtherVehicleForm from './OtherVehicleForm';

import { OtherVehicle } from '../types/otherVehicle.types';
import { useRouter } from 'next/navigation';

export default function OtherVehiclePage() {
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
    const router = useRouter();

  const [vehicles, setVehicles] = useState<OtherVehicle[]>([]);

  // SAVE VEHICLE

  const handleSaveVehicle = (
    vehicleData: Omit<OtherVehicle, 'sn'>
  ) => {
    const newVehicle: OtherVehicle = {
      sn: vehicles.length + 1,
      ...vehicleData,
    };

    setVehicles((previousVehicles) => [
      ...previousVehicles,
      newVehicle,
    ]);

    setViewMode('list');
  };

  // CANCEL FORM

  const handleCancel = () => {
    setViewMode('list');
  };

  // RETURN TO LIST

  const handleGoToList = () => {
    setViewMode('list');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">

      {/* PAGE HEADER AND BREADCRUMB */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Other's Vehicle
          </h1>

          <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">

            <span
              className="text-orange-600 cursor-pointer hover:underline"
              onClick={() => router.push('/admin/dashboard')}
            >
              Home
            </span>

            <span>&gt;</span>

            <span
              className="text-orange-600 cursor-pointer hover:underline"
              onClick={handleGoToList}
            >
              Vehicle
            </span>

            <span>&gt;</span>

            {viewMode === 'list' ? (
              <span className="text-gray-500">
                Other's Vehicle
              </span>
            ) : (
              <>
                <span
                  className="text-orange-600 cursor-pointer hover:underline"
                  onClick={handleGoToList}
                >
                  Other's Vehicle
                </span>

                <span>&gt;</span>

                <span className="text-gray-500">
                  New
                </span>
              </>
            )}

          </nav>
        </div>

        {viewMode === 'list' && (
          <button
            type="button"
            onClick={() => setViewMode('add')}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 transition"
          >
            <span className="text-lg font-bold">+</span>
            Add Other Vehicle
          </button>
        )}

      </div>

      {/* PAGE CONTENT */}

      {viewMode === 'list' ? (
        <OtherVehicleList
  vehicles={vehicles}
  onAdd={() => setViewMode('add')}
/>
      ) : (
        <OtherVehicleForm
          onSave={handleSaveVehicle}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
}