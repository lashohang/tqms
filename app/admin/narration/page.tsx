'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';


interface NarrationLog {
  id: number;
  narrationText: string;
}

export default function NarrationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<NarrationLog[]>([]);
  
  // Pull narrative logs dynamically from browser storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tqms_narrations');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      // Default matching test row from your screenshot if storage is empty
      const defaultLog = [{ id: 1, narrationText: 'Hello' }];
      localStorage.setItem('tqms_narrations', JSON.stringify(defaultLog));
      setLogs(defaultLog);
    }
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.narrationText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  // Routes to edit folder and passes the unique item ID along the query parameters
  const handleEditRedirect = (id: number) => {
    router.push(`/admin/narration/edit?id=${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">Checkpoint Narration</h1>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 select-none">
            <span className="text-amber-600 cursor-pointer hover:underline" onClick={() => router.push('/admin/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-gray-400">Narration</span>
          </div>
        </div>
      </div>

      {/* Main Table Panel Box */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        
        {/* Search Field Controls */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded outline-none text-sm text-gray-700 focus:border-[#b06000] transition"
          />
          <button className="px-5 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-sm font-medium rounded transition shadow-sm cursor-pointer focus:outline-none">
            Search
          </button>
        </div>

        {/* Structured Data Matrix Layout */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 select-none tracking-wider">
                <th className="pb-3 px-4 font-bold w-24">S.N</th>
                <th className="pb-3 px-4 font-bold">Narration</th>
                <th className="pb-3 px-4 font-bold text-right pr-12 w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                    No matching narrative log records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-600">{log.id}</td>
                    <td className="py-4 px-4 font-medium text-slate-500">{log.narrationText}</td>
                    <td className="py-4 px-4 text-right pr-12">
                      <button 
                        type="button"
                        onClick={() => handleEditRedirect(log.id)}
                        className="text-blue-500 hover:text-blue-700 transition cursor-pointer font-medium flex items-center justify-end ml-auto text-base focus:outline-none"
                        title="Edit Narration"
                      >
                        📝
                      </button>
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
