'use client';

import React from 'react';


export default function ChangePasswordPage() {
  return (
    
    <div className="max-w-xl bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
        <p className="text-xs text-gray-400 mt-1">Home &gt; Change Password</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition">
            Save
          </button>
          <button type="button" className="px-5 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
