'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface CheckpointUser {
  id: number;
  name: string;
  address: string;
  contact: string;
  status: boolean;
}

export default function AdminCheckUserPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<CheckpointUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync data dynamically with localStorage (starts completely empty until added)
  useEffect(() => {
    const fetchServerData = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 200)); // Simulates network delay
      const saved = localStorage.getItem('tqms_users');
      setData(saved ? JSON.parse(saved) : []);
      setIsLoading(false);
    };
    fetchServerData();
  }, []);

  const toggleStatus = (id: number) => {
    const updated = data.map(u => u.id === id ? { ...u, status: !u.status } : u);
    setData(updated);
    localStorage.setItem('tqms_users', JSON.stringify(updated));
  };

  // Filter rows locally based on search input keywords
  const filteredData = useMemo(() => {
    return data.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Title Header Section Row */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">CheckPoint User</h1>
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 select-none">
            <span className="text-amber-600 cursor-pointer hover:underline" onClick={() => router.push('/admin/dashboard')}>Home</span>
            <span>&gt;</span>
            <span>CheckPoint User</span>
          </div>
        </div>
        
        {/* Navigation Button routing directly to your registration form route */}
        <button 
          type="button" 
          onClick={() => router.push('/admin/checkpoints/check-user/new')} 
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-amber-700 cursor-pointer focus:outline-none"
        >
          <span className="text-lg font-bold">+</span> Add CheckPoint User
        </button>
      </div>

      {/* Main Content Card Box */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex gap-2 max-w-md">
          <input 
            type="text" 
            placeholder="search..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full px-3 py-1.5 border border-gray-300 rounded outline-none text-sm text-gray-700 focus:border-[#b06000] transition" 
          />
          <button type="button" className="px-5 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-sm font-medium rounded shadow-sm focus:outline-none cursor-pointer">
            Search
          </button>
        </div>

        {/* Pure React Responsive Table Data Grid */}
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading user registry database...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm border-t border-gray-100">
              No checkpoint users added yet. Click "+ Add CheckPoint User" to create one.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 tracking-wider select-none">
                  <th className="pb-3 px-2 font-bold w-16">S.N</th>
                  <th className="pb-3 px-2 font-bold">Name</th>
                  <th className="pb-3 px-2 font-bold">Address</th>
                  <th className="pb-3 px-2 font-bold">Contact</th>
                  <th className="pb-3 px-2 font-bold w-32">Status</th>
                  <th className="pb-3 px-2 font-bold w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredData.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 text-gray-600 font-medium">{user.id}</td>
                    <td className="py-4 px-2 text-slate-500 font-medium">{user.name}</td>
                    <td className="py-4 px-2 text-gray-400">{user.address || '—'}</td>
                    <td className="py-4 px-2 text-gray-400">{user.contact}</td>
                    <td className="py-4 px-2">
                      {/* Status Toggle Switch Slider */}
                      <button 
                        type="button" 
                        onClick={() => toggleStatus(user.id)} 
                        className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer focus:outline-none ${
                          user.status ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${
                          user.status ? 'left-5.5' : 'left-1'
                        }`} />
                      </button>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-4 text-blue-500">
                        <button type="button" className="hover:text-blue-700 transition cursor-pointer focus:outline-none">📝</button>
                        <button type="button" className="text-red-400 hover:text-red-600 transition cursor-pointer focus:outline-none">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
