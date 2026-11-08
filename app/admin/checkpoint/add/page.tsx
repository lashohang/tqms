
'use client';
import DistrictSelect from '@/features/checkpoint/components/DistrictSelect';
import React, { useState } from 'react';
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

export default function AddCheckpointPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    state: '',
    district: '',
    region: '',
    geoLocation: '',
    email: '',
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset form and return to checkpoint list
  const handleCancel = () => {
    setFormData({
      name: '',
      type: '',
      state: '',
      district: '',
      region: '',
      geoLocation: '',
      email: '',
    });

    router.push('/admin/checkpoint');
  };

  // Save checkpoint
  const handleSaveCheckpoint = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Validate mandatory fields
    if (
      !formData.name.trim() ||
      !formData.type ||
      !formData.state ||
      !formData.district.trim() ||
      !formData.region ||
      !formData.email.trim()
    ) {
      alert('Please fill in all mandatory fields tagged with *');
      return;
    }

    try {
      // Get existing checkpoints
      const saved = localStorage.getItem(STORAGE_KEY);

      const existingCheckpoints: Checkpoint[] = saved
        ? JSON.parse(saved)
        : [];

      // Generate next serial number
      const nextSN =
        existingCheckpoints.length > 0
          ? Math.max(...existingCheckpoints.map((item) => item.sn)) + 1
          : 1;

      // Construct address
      const calculatedAddress = [
        formData.state,
        formData.district,
        formData.region,
      ]
        .filter(Boolean)
        .join(', ');

      // Create new checkpoint
      const newCheckpoint: Checkpoint = {
        id: crypto.randomUUID(),
        sn: nextSN,
        name: formData.name.trim(),
        type: formData.type,
        state: formData.state,
        district: formData.district.trim(),
        region: formData.region,
        geoLocation: formData.geoLocation.trim(),
        address: calculatedAddress || 'N/A',
        email: formData.email.trim(),
        isWeightMachineActive: false,
      };

      // Save new checkpoint with existing records
      const updatedCheckpoints = [
        ...existingCheckpoints,
        newCheckpoint,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedCheckpoints)
      );

      alert('Checkpoint saved successfully!');

      // Return to checkpoint list
      router.push('/admin/checkpoint');
    } catch (error) {
      console.error('Error saving checkpoint:', error);
      alert('Unable to save checkpoint. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            CheckPoints
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
              onClick={() => router.push('/admin/checkpoint')}
            >
              CheckPoints
            </span>

            <span>&gt;</span>

            <span className="text-gray-500">
              New
            </span>
          </nav>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="bg-white rounded shadow-sm border border-gray-100 p-6 max-w-7xl mx-auto">

        <h2 className="text-sm font-semibold text-slate-900 mb-6">
          Enter CheckPoints Details
        </h2>

        <form
          onSubmit={handleSaveCheckpoint}
          className="space-y-5"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

            {/* NAME */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Name
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gray-500 placeholder-gray-300"
                required
              />
            </div>

            {/* CHECKPOINT TYPE */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                CheckPoint Type
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
                required
              >
                <option value="">Select...</option>
                <option value="Main">Main Checkpoint</option>
                <option value="Sub">Sub Checkpoint</option>
                <option value="Mobile">Mobile Unit</option>
              </select>
            </div>

          
{/* STATE */}
<div>
  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
    State
    <span className="text-red-500 font-bold ml-0.5">*</span>
  </label>

  <select
    name="state"
    value={formData.state}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        state: e.target.value,
        district: '',
      }))
    }
    className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
    required
  >
    <option value="">Select...</option>
    <option value="Bagmati Province (P3)">Bagmati Province (P3)</option>
    <option value="Gandaki Province (P4)">Gandaki Province (P4)</option>
    <option value="Koshi Province (P1)">Koshi Province (P1)</option>
    <option value="Lumbini Province (P5)">Lumbini Province (P5)</option>
    <option value="Karnali Province (P6)">Karnali Province (P6)</option>
    <option value="Madhesh Province (P2)">Madhesh Province (P2)</option>
    <option value="Sudurpashchim Province (P7)">Sudurpashchim Province (P7)</option>
  </select>
</div>

            

  
            {/* DISTRICT */}
            <div>
              

              <DistrictSelect
  state={formData.state}
  value={formData.district}
  onChange={(district) =>
    setFormData((prev) => ({
      ...prev,
      district,
    }))
  }
/>
            </div>

            {/* REGION */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Region
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>

              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
                required
              >
                <option value="">Select...</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
                <option value="Highway">Highway</option>
              </select>
            </div>

            {/* GEO LOCATION */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Geo Location
              </label>

              <input
                type="text"
                name="geoLocation"
                placeholder="Enter Geo Location"
                value={formData.geoLocation}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gray-500 placeholder-gray-300"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Email
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-gray-500 placeholder-gray-300"
                required
              />
            </div>

          </div>

          {/* FORM ACTIONS */}
          <div className="flex justify-end items-center gap-3 pt-5 border-t border-gray-100">

            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 border border-gray-300 text-gray-600 text-xs font-semibold rounded hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded shadow-sm transition"
            >
              Save
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
