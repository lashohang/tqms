'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NarrationLog {
  id: number;
  narrationText: string;
}

function EditFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logId = searchParams.get('id');
  
  const [narration, setNarration] = useState('');
  const [currentLogs, setCurrentLogs] = useState<NarrationLog[]>([]);

  // Find the target record from localStorage array entries matching the target ID
  useEffect(() => {
    const saved = localStorage.getItem('tqms_narrations');
    if (saved && logId) {
      const parsedLogs: NarrationLog[] = JSON.parse(saved);
      setCurrentLogs(parsedLogs);
      
      const targetItem = parsedLogs.find(l => l.id === Number(logId));
      if (targetItem) {
        setNarration(targetItem.narrationText);
        return;
      }
    }
    // Fallback default state matching your exact text screenshot layout
    setNarration('Hello sir. How do you do?');
  }, [logId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logId) return;

    // Map out modified fields parameters and commit them back into local storage
    const updatedLogs = currentLogs.map(log => 
      log.id === Number(logId) ? { ...log, narrationText: narration } : log
    );

    localStorage.setItem('tqms_narrations', JSON.stringify(updatedLogs));
    router.push('/admin/narration'); // Redirect back to update data table list view instantly
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb Strings Row */}
      <div className="text-xs text-amber-700 font-medium flex items-center gap-1 select-none pt-2">
        <span className="hover:underline cursor-pointer" onClick={() => router.push('/admin/narration')}>Narration</span>
        <span className="text-gray-400 font-light">&gt;</span>
        <span className="text-gray-400 font-normal">Edit</span>
      </div>

      {/* Main Details Form Sheet Container Card Frame */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 md:p-10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Narration Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2 max-w-sm">
            <label className="text-sm font-semibold text-gray-700">Narration*</label>
            <input
              type="text"
              required
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm text-gray-700 focus:border-amber-600 transition shadow-inner"
            />
          </div>

          {/* Form Action Controls matching your screenshot layout coordinates */}
          <div className="flex items-center justify-end gap-6 pt-4 mt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/narration')}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition cursor-pointer select-none focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#b06000] hover:bg-[#905000] text-white text-sm font-semibold rounded shadow-sm cursor-pointer select-none transition focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NarrationEditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading details...</div>}>
      <EditFormContent />
    </Suspense>
  );
}
