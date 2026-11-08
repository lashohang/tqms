
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isCheckpointsOpen, setIsCheckpointsOpen] = useState(
    pathname.startsWith('/admin/checkpoints') ||
    pathname.startsWith('/admin/narration')
  );

  const [isVehicleOpen, setIsVehicleOpen] = useState(
    pathname.startsWith('/admin/vehicle')
  );

  const [isReportsOpen, setIsReportsOpen] = useState(
    pathname.startsWith('/admin/report')
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Automatically collapse sidebar on small screens.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleScreenChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarCollapsed(event.matches);
    };

    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener('change', handleScreenChange);

    return () => {
      mediaQuery.removeEventListener('change', handleScreenChange);
    };
  }, []);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Automatically open the relevant submenu for the current page.
  useEffect(() => {
    if (
      pathname.startsWith('/admin/checkpoints') ||
      pathname.startsWith('/admin/narration')
    ) {
      setIsCheckpointsOpen(true);
    }

    if (pathname.startsWith('/admin/vehicle')) {
      setIsVehicleOpen(true);
    }

    if (pathname.startsWith('/admin/report')) {
      setIsReportsOpen(true);
    }
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);

    // Redirect to the login page.
    // Connect your authentication provider's sign-out function here
    // if your application uses server-side authentication.
    router.push('/');
  };

  const scrollNavigation = (direction: 'up' | 'down') => {
    navRef.current?.scrollBy({
      top: direction === 'up' ? -150 : 150,
      behavior: 'smooth',
    });
  };

  const navLinkClass = (active: boolean) =>
    `relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 ${
      active
        ? 'text-amber-700 bg-amber-50/70 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  const subLinkClass = (active: boolean) =>
    `block px-3 py-2 rounded-md text-[12px] font-medium transition-colors ${
      active
        ? 'text-amber-700 bg-amber-50/60 font-semibold'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`;

  const Arrow = ({ open }: { open: boolean }) => (
    <svg
      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-800 font-sans">

      {/* MOBILE SIDEBAR BACKDROP */}
      {!isSidebarCollapsed && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-56 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out ${
          isSidebarCollapsed
            ? '-translate-x-full'
            : 'translate-x-0'
        }`}
      >

        {/* SIDEBAR BRANDING */}
        <div className="h-16 px-5 flex items-center shrink-0 border-b border-gray-100">
          <Link
            href="/admin/dashboard"
            onClick={closeMobileSidebar}
            className="flex items-center"
          >
            <Image
              src="/Logo.png"
              alt="Lodbod Checkpoint Logo"
              width={105}
              height={40}
              className="object-contain max-h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* NAVIGATION AREA */}
        <div className="relative flex-1 min-h-0 flex flex-col">

          {/* TOP SCROLL ARROW */}
          

          <nav
            ref={navRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 pb-3 space-y-1 select-none
              [scrollbar-width:thin]
              [scrollbar-color:#d1d5db_transparent]
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-300"
          >
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-3 pb-2">
              Navigation
            </p>

            {/* 1. CHECKPOINT */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsCheckpointsOpen(!isCheckpointsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition ${
                  pathname.startsWith('/admin/checkpoints') ||
                  pathname.startsWith('/admin/narration')
                    ? 'text-amber-700 bg-amber-50/70'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">👤</span>
                  <span>Checkpoint</span>
                </span>

                <Arrow open={isCheckpointsOpen} />
              </button>

              {isCheckpointsOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 space-y-1">
                  <Link
                    href="/admin/checkpoints/check-user"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      pathname === '/admin/checkpoints/check-user'
                    )}
                  >
                    Check User
                  </Link>

                  <Link
                    href="/admin/narration"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      pathname === '/admin/narration'
                    )}
                  >
                    Narration
                  </Link>
                </div>
              )}
            </div>

            {/* 2. QUEUE */}
            <Link
              href="/admin/queue"
              onClick={closeMobileSidebar}
              className={navLinkClass(isActive('/admin/queue'))}
            >
              <span className="text-base">🕒</span>
              <span>Queue</span>
              {isActive('/admin/queue') && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-amber-600" />
              )}
            </Link>

            {/* 3. ADD NEW QUEUE */}
            <Link
              href="/admin/add-new-queue"
              onClick={closeMobileSidebar}
              className={navLinkClass(
                pathname === '/admin/add-new-queue'
              )}
            >
              <span className="text-base">📋</span>
              <span>Add New Queue</span>
            </Link>

            {/* 4. VEHICLE */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsVehicleOpen(!isVehicleOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition ${
                  pathname.startsWith('/admin/vehicle')
                    ? 'text-amber-700 bg-amber-50/70'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">🚛</span>
                  <span>Vehicle</span>
                </span>

                <Arrow open={isVehicleOpen} />
              </button>

              {isVehicleOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 space-y-1">

                  <Link
                    href="/admin/vehicle/vehicle-owner"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      isActive('/admin/vehicle/vehicle-owner')
                    )}
                  >
                    Vehicle Owner
                  </Link>

                  <Link
                    href="/admin/vehicle/vehicles"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      isActive('/admin/vehicle/vehicles')
                    )}
                  >
                    Vehicles
                  </Link>

                  <Link
                    href="/admin/vehicle/other-vehicles"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      isActive('/admin/vehicle/other-vehicles')
                    )}
                  >
                    Other Vehicles
                  </Link>

                </div>
              )}
            </div>

            {/* 5. REPORT */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsReportsOpen(!isReportsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition ${
                  pathname.startsWith('/admin/report')
                    ? 'text-amber-700 bg-amber-50/70'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">📊</span>
                  <span>Report</span>
                </span>

                <Arrow open={isReportsOpen} />
              </button>

              {isReportsOpen && (
                <div className="ml-5 pl-3 border-l border-gray-200 space-y-1">

                  <Link
                    href="/admin/report/checkpoint-entry"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      pathname === '/admin/report/checkpoint-entry'
                    )}
                  >
                    Checkpoint Entry
                  </Link>

                  <Link
                    href="/admin/report/detail-entry-report"
                    onClick={closeMobileSidebar}
                    className={subLinkClass(
                      pathname === '/admin/report/detail-entry-report'
                    )}
                  >
                    Detail Entry Report
                  </Link>

                </div>
              )}
            </div>

            {/* 6. GENERATE QR */}
            <Link
              href="/admin/generate-qr"
              onClick={closeMobileSidebar}
              className={navLinkClass(
                pathname === '/admin/generate-qr'
              )}
            >
              <span className="text-base">🔲</span>
              <span>Generate QR</span>
            </Link>

          </nav>

          {/* BOTTOM SCROLL ARROW */}
          
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-0' : 'md:ml-56'
        }`}
      >

        {/* HEADER */}
        <header className="h-16 bg-white flex items-stretch justify-between sticky top-0 z-20 border-b border-gray-100 shadow-sm shrink-0">

          {/* LEFT HEADER SECTION */}
          <div className="flex items-center px-4 md:px-6 gap-3">

            {/* SIDEBAR TOGGLE */}
            <button
              type="button"
              onClick={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
              aria-label="Toggle navigation sidebar"
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-md transition"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

          </div>

          {/* USER PROFILE / HEADER RIGHT SECTION */}
          <div
            ref={dropdownRef}
            className="relative flex items-stretch ml-auto"
          >
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              className="flex items-center gap-3 px-4 md:px-6 h-full border-l border-r border-gray-200 bg-slate-50 hover:bg-gray-100 transition group"
            >

              {/* USER AVATAR */}
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm relative">
                <Image 
                  className="rounded-full object-fill w-full h-full" 
                  src="/Logo.png" 
                  fill 
                  alt="User Profile" 
                  sizes="40px"
                />
              </div>

              {/* USER NAME */}
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[13px] font-semibold text-gray-800 group-hover:text-amber-700 transition">
                  lodbod checkpoint
                </span>

                <span className="text-[11px] text-gray-400 mt-1">
                  Checkpoint
                </span>
              </div>

              <span className="text-gray-400 ml-1">
                <Arrow open={isDropdownOpen} />
              </span>
            </button>

            {/* PROFILE DROPDOWN */}
            {isDropdownOpen && (
              <div className="absolute right-2 top-[calc(100%+8px)] w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">

                {/* WELCOME - NOT CLICKABLE */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Welcome!
                  </p>

                 
                </div>

                {/* MY PROFILE */}
                <Link
                  href="/admin/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-amber-700 transition"
                >
                  <span>👤</span>
                  <span>My Profile</span>
                </Link>

                {/* CHANGE PASSWORD */}
                <Link
                  href="/admin/change-password"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:text-amber-700 transition"
                >
                  <span>🔒</span>
                  <span>Change Password</span>
                </Link>

                <div className="border-t border-gray-100 my-1" />

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition text-left"
                >
                  <span>↪</span>
                  <span>Logout</span>
                </button>

              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 bg-[#F9FAFB]">
          {children}
        </main>

      </div>
    </div>
  );
}
