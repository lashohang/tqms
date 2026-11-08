
'use client';

import React, { useEffect, useState } from 'react';

interface CheckpointProfile {
  name: string;
  province: string;
  district: string;
  region: string;
  geoLocation: string;
  status: 'Active' | 'Inactive';
  sthaniyaSangh: string;
  type: string;
}

export default function CheckpointProfilePage() {
  const [email, setEmail] = useState('Loading...');

  const [profile] = useState<CheckpointProfile>({
    name: 'lodbod checkpoint',
    province: 'Koshi Province (P3)',
    district: 'Kathmandu',
    region: 'Koshi Provinces',
    geoLocation: '',
    status: 'Active',
    sthaniyaSangh: 'Loadboard',
    type: 'Checkpoint With Weighing Bridge',
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('tqms_logged_in_email');

    setEmail(savedEmail || 'No email found');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-gray-700 antialiased font-sans">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Profile
        </h1>

        <nav className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <span className="text-orange-600">Home</span>
          <span>&gt;</span>
          <span className="text-gray-500">Profile</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT PROFILE CARD */}
        <div className="bg-white rounded border border-gray-100 shadow-sm p-6 lg:col-span-4 space-y-6 text-xs">

          <div className="flex justify-between items-start py-1.5">
            <span className="text-slate-400 w-24 shrink-0">Province</span>
            <span className="font-bold text-slate-800 text-right">
              {profile.province || '—'}
            </span>
          </div>

          <div className="flex justify-between items-start py-1.5">
            <span className="text-slate-400 w-24 shrink-0">District</span>
            <span className="font-bold text-slate-800 text-right">
              {profile.district || '—'}
            </span>
          </div>

          <div className="flex justify-between items-start py-1.5">
            <span className="text-slate-400 w-24 shrink-0">Region</span>
            <span className="font-bold text-slate-800 text-right">
              {profile.region || '—'}
            </span>
          </div>

          <div className="flex justify-between items-start py-1.5">
            <span className="text-slate-400 w-24 shrink-0">Geo Location</span>
            <span className="font-bold text-slate-800 text-right break-all">
              {profile.geoLocation || '—'}
            </span>
          </div>

          <div className="flex justify-between items-start py-1.5 border-t border-slate-50 pt-4">
            <span className="text-slate-400 w-24 shrink-0">Status</span>
            <span className={`font-bold ${
              profile.status === 'Active'
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}>
              {profile.status}
            </span>
          </div>

        </div>

        {/* RIGHT PROFILE DETAILS */}
        <div className="bg-white rounded border border-gray-100 shadow-sm p-6 lg:col-span-8 text-xs">

          <div className="border-b border-gray-200 pb-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-800">
              CheckPoint Name: {profile.name}
            </h2>
          </div>

          <h3 className="font-bold text-slate-800 tracking-wide mb-4">
            CheckPoint Details
          </h3>

          <div className="divide-y divide-slate-100">

            <div className="flex justify-between items-center py-3">
              <span className="text-slate-400">Sthaniyasangh</span>
              <span className="font-bold text-slate-800">
                {profile.sthaniyaSangh || '—'}
              </span>
            </div>

            <div className="flex justify-between items-center gap-4 py-3">
              <span className="text-slate-400 shrink-0">E-mail</span>
              <span className="font-bold text-slate-800 break-all text-right">
                {email}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-slate-400">Checkpoint Type</span>
              <span className="font-bold text-slate-800 text-right">
                {profile.type || '—'}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
