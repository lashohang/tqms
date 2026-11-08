'use client';

import React, { useState } from 'react';
import { OtherVehicle } from '../types/otherVehicle.types';

interface OtherVehicleFormProps {
  onSave: (vehicle: Omit<OtherVehicle, 'sn'>) => void;
  onCancel: () => void;
}

export default function OtherVehicleForm({
  onSave,
  onCancel,
}: OtherVehicleFormProps) {
  const [othersType, setOthersType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [formattedNumber, setFormattedNumber] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !othersType ||
      !formattedNumber.trim() ||
      (othersType === 'Indian' && !vehicleType)
    ) {
      alert('Please fill in all mandatory fields tagged with *');
      return;
    }

    onSave({
      formattedNo: formattedNumber.trim(),
      numberType: othersType === 'Indian' ? 'Others' : 'Provincial',
      plateType: othersType,
      vehicleType: othersType === 'Indian' ? vehicleType : '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-7xl mx-auto">

      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Enter Others Vehicle Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* OTHERS TYPE */}

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Others Type
              <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>

            <select
              value={othersType}
              onChange={(e) => {
                setOthersType(e.target.value);
                setVehicleType('');
              }}
              className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">Select...</option>
              <option value="Indian">Indian</option>
              <option value="Unregistered">Unregistered</option>
            </select>
          </div>

          {/* VEHICLE TYPE - INDIAN ONLY */}

          {othersType === 'Indian' && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Vehicle Type
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>

              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-white border border-slate-900 rounded px-3 py-2 text-sm focus:outline-none font-medium"
              >
                <option value="">Select...</option>
                <option value="Truck">Truck</option>
                <option value="Container">Container</option>
                <option value="Tanker">Tanker</option>
              </select>
            </div>
          )}

        </div>

        {/* FORMATTED NUMBER */}

        {othersType !== '' && (
          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Formatted Number
              <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter Formatted Number"
              value={formattedNumber}
              onChange={(e) => setFormattedNumber(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 placeholder-gray-300"
            />
          </div>
        )}

        {/* FORM ACTIONS */}

        <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-50">

          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm px-6 py-2 rounded shadow-sm transition"
          >
            Save
          </button>

        </div>

      </form>
    </div>
  );
}