'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCheckpointsOpen, setIsCheckpointsOpen] = useState(true); // Default open to display the subpages sub-menus
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown cleanly if user clicks outside the modal space
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const navItems = [
  { name: 'Queue', href: '/admin/queue', icon: '🕒' },
  { name: 'Add New Queue', href: '/admin/add-new-queue', icon: '📋' },
  { name: 'Report', href: '/admin/report', icon: '📊' },
  { name: 'Generate QR', href: '/admin/generate-qr', icon: '🔲' },
];

{/* ... inside your sidebar navigation loop ... */}
{navItems.map((item) => {
  // ✅ STRICT EXACT MATCHING avoids highlighting both links at the same time
  const isActive = pathname === item.href;
  
  return (
    <Link
      key={item.name}
      href={item.href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group ${
        isActive
          ? 'text-amber-700 font-bold' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {/* ✅ LEFT ACCENT INDICATOR LINE ONLY: Renders selectively on active elements */}
      {isActive && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#b06000] rounded-r-md" />
      )}
      
      <span className="text-base opacity-80 shrink-0">{item.icon}</span>
      <span className="whitespace-nowrap">{item.name}</span>
    </Link>
  );
})}


  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-800 font-sans overflow-hidden w-screen relative">
      
      {/* 1. LEFT VERTICAL SIDEBAR PANEL */}
      <aside 
        className={`bg-white h-screen z-30 flex flex-col shrink-0 border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-[2px_0_8px_rgba(0,0,0,0.03)] fixed md:sticky top-0 bottom-0 left-0 ${
          isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        } w-64`}
      >
        {/* Top Branding Section */}
        <div className="h-20 px-6 flex items-center justify-start overflow-hidden shrink-0 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/logo.png"          
              alt="Logo"
              width={100}               
              height={40}               
              className="object-contain w-auto h-auto" 
              priority
            />
          </Link>
        </div>

        {/* 2. THE CUSTOM SCROLLBAR SLIDE TRACK UTILITY */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* Top Triangle Track Indicator Arrow */}
          <div className="absolute top-0 right-0 w-4 h-6 bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-400 select-none pointer-events-none border-b border-slate-200/40 z-20 rounded-t-full">
            ▲
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden select-none [scrollbar-color:#c1c1c1_#f8f9fa] [&::-webkit-scrollbar]:w-8 [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-button]:h-8 [&::-webkit-scrollbar-button]:bg-[#f8f9fa]">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 whitespace-nowrap">
              Navigation
            </p>

            {/* INTERACTIVE DROPDOWN PARENT MODULE FOR CHECKPOINTS */}
            <div className="space-y-1">
              <button
                onClick={() => setIsCheckpointsOpen(!isCheckpointsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-all focus:outline-none ${
                  pathname === '/admin/checkpoints/check-user' || pathname === '/admin/checkpoints/check-user' || pathname === '/admin/narration'
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base opacity-80 shrink-0">👤</span>
                  <span className="whitespace-nowrap">Checkpoints</span>
                </div>
                
              </button>

              {/* DROPDOWN CHILD SUBPAGE TARGETS LINK LIST */}
              {/* Find the checkpoints subpage links block array inside app/admin/layout.tsx */}
{isCheckpointsOpen && (
  <div className="pl-9 space-y-1 mt-1 transition-all duration-200">
    <Link 
      href="/admin/checkpoints/check-user" 
      className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
        pathname === '/admin/checkpoints/check-user' ? 'text-amber-700 font-semibold bg-amber-50/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      Check User
    </Link>
    
    <Link href="/admin/narration" className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-900">
      Narration
    </Link>
  </div>
)}
          <div className="space-y-1">
  <button
    onClick={() => setIsVehicleOpen(!isVehicleOpen)}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-all focus:outline-none ${
      pathname.startsWith('/admin/vehicle')
        ? 'bg-amber-50 text-amber-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-base opacity-80 shrink-0">🚛</span>
      <span className="whitespace-nowrap">Vehicle</span>
    </div>
  </button>

  {isVehicleOpen && (
    <div className="pl-9 space-y-1 mt-1 transition-all duration-200">

      <Link
        href="/admin/vehicle/vehicle-owner"
        className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
          pathname === '/admin/vehicle/vehicle-owner'
            ? 'text-amber-700 font-semibold bg-amber-50/50'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        Vehicle Owner
      </Link>

      <Link
        href="/admin/vehicle/vehicles"
        className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
          pathname === '/admin/vehicle/vehicles'
            ? 'text-amber-700 font-semibold bg-amber-50/50'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        Vehicles
      </Link>

      <Link
        href="/admin/vehicle/other-vehicles"
        className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
          pathname === '/admin/vehicle/other-vehicles'
            ? 'text-amber-700 font-semibold bg-amber-50/50'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        Other Vehicles
      </Link>

    </div>
  )}
</div>

            </div>

            {/* REST OF THE SIDEBAR NAV LINKS LAYER MAP LOOP */}
            {navItems.map((item) => {
              const isActive =
  pathname === item.href ||
  (item.href === '/admin/queue' &&
    pathname.startsWith('/admin/queue/'));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600 pl-2'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base opacity-80 shrink-0">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Triangle Track Indicator Arrow */}
          <div className="absolute bottom-0 right-0 w-4 h-6 bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-400 select-none pointer-events-none border-t border-slate-200/40 z-20 rounded-b-full">
            ▼
          </div>
        </div>
      </aside>

      {/* 3. RIGHT CONTENT WORKSPACE PANEL AREA */}
      <div 
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out relative z-10 ${
          isSidebarCollapsed ? 'md:-ml-64' : 'ml-0'
        }`}
      >
        {/* GLOBAL HEADER BAR - Styled with flex items-stretch for vertical profile container coverage */}
        <header className="h-20 bg-white flex items-stretch justify-between relative z-20 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border-b border-gray-100 shrink-0">
          
          {/* Hamburger Menu Toggle Button block layout */}
          <div className="flex items-center px-6">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-500 p-2 hover:bg-gray-100 rounded text-xl flex items-center justify-center focus:outline-none cursor-pointer transition select-none"
            >
              ☰
            </button>
          </div>

          {/* User Account Profile Info Area Frame - covers height completely with center item distribution */}
          <div className="relative ml-auto h-full flex items-stretch border-l border-slate-200/60 bg-slate-50 px-6" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3.5 text-left transition focus:outline-none select-none group h-full justify-center"
            >
              {/* Circular Avatar Container forcing an absolute boundary frame */}
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                <Image 
                  className="rounded-full object-fill w-full h-full" 
                  src="/logo.png" 
                  fill 
                  alt="User Profile" 
                  sizes="40px"
                />
              </div>
              
              {/* Profile Identity Labels Group centered vertically inside layout track */}
              <div className="hidden sm:flex flex-col justify-center text-left leading-tight">
                <p className="text-sm font-bold text-gray-800 tracking-wide group-hover:text-amber-700 transition-colors">
                  lodbod checkpoint
                </p>
                <p className="text-xs font-medium text-gray-400 mt-0.5">
                  Checkpoint
                </p>
              </div>
            </button>

            {/* Dropdown Menu Overlays */}
            {isDropdownOpen && (
              <div className="absolute right-6 top-[76px] w-56 bg-white border border-gray-200 rounded shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Welcome !</p>
                </div>
                <Link
                  href="#"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  👤 <span className="flex-1">My Profile</span>
                </Link>
                

              </div>
            )}
          </div>
        </header>

        {/* INNER ROUTE DATA CONTENT PANEL BLOCK CONTAINER */}
        <main className="p-6 md:p-8 flex-1 bg-[#F9FAFB] overflow-y-auto min-h-0">
          {children}
        </main>
      </div>

    </div>
  );
}
