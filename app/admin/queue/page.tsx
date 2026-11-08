
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface QueueItem {
  checkpointEntry?:
    | string
    | {
        date: string;
        time: string;
        grossWeight: number;
        kataFee: number;
      }
    | null;

  checkpointSaved?: boolean;

  id: string;
  vehicleNo: string;
  serialNo?: number;
  from: string;
  to: string;
  grossWeight: number | null;
  entryDate: string;
  companyName?: string;
  loadDetails?: string;
  narration?: string;
  driversPhone?: string;
  status: 'pending' | 'in_job';
  queueNo?: string;
  vehicleType?: string;
}

export default function AdminQueueDashboardPage() {
  const router = useRouter();

  const isCheckpointSaved = (item: QueueItem): boolean => {
    return item.checkpointSaved === true;
  };

  const [data, setData] = useState<QueueItem[]>([]);
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<
    'All' | 'In Job' | 'In Queue' | 'Unregistered' | 'Payment Pending'
  >('All');

  // Search states
  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchCardType, setSearchCardType] = useState('');
  const [searchVehicleType, setSearchVehicleType] = useState('');
  const [searchApplied, setSearchApplied] = useState(false);

  // Load saved queues
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tqms_live_queues');

      if (saved) {
        const parsed: QueueItem[] = JSON.parse(saved);
        setData(parsed);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error loading queues:', error);
      setData([]);
    }
  }, []);

  // Save all queue data
  const saveQueues = (updated: QueueItem[]) => {
    localStorage.setItem(
      'tqms_live_queues',
      JSON.stringify(updated)
    );

    setData(updated);
  };

  // Separate Pending Queue
  const pendingQueues = useMemo(() => {
    return data.filter((item) => item.status === 'pending');
  }, [data]);

  // Save weight and move queue to In Job
  const handleSaveWeight = (id: string) => {
    const weightValue = weights[id];

    if (!weightValue || Number(weightValue) <= 0) {
      alert('Please enter a valid weight before saving.');
      return;
    }

    const queue = data.find((item) => item.id === id);

    if (!queue || queue.status !== 'pending') {
      return;
    }

    const updated = data.map((item) =>
      item.id === id
        ? {
            ...item,
            grossWeight: Number(weightValue),
            status: 'in_job' as const,
          }
        : item
    );

    saveQueues(updated);

    setWeights((prev) => {
      const newWeights = { ...prev };
      delete newWeights[id];
      return newWeights;
    });
  };

  // Filter In Job records
  const inJobQueues = useMemo(() => {
    return data.filter((item) => {
      if (item.status !== 'in_job') return false;

      if (activeTab === 'In Queue') return false;
      if (activeTab === 'Unregistered') return false;
      if (activeTab === 'Payment Pending') return false;

      if (
        searchApplied &&
        searchVehicle &&
        !item.vehicleNo.toLowerCase().includes(
          searchVehicle.toLowerCase()
        ) &&
        !String(item.serialNo ?? '').includes(searchVehicle)
      ) {
        return false;
      }

      if (
        searchApplied &&
        searchVehicleType &&
        !(item.vehicleType || '').toLowerCase().includes(
          searchVehicleType.toLowerCase()
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    data,
    activeTab,
    searchVehicle,
    searchVehicleType,
    searchApplied,
  ]);

  // Search button
  const handleSearch = () => {
    setSearchApplied(true);
  };

  // Delete queue
  const handleDelete = (id: string) => {
    if (
      confirm('Are you sure you want to remove this queue record?')
    ) {
      const updated = data.filter((item) => item.id !== id);
      saveQueues(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">

      {/* PENDING QUEUE SECTION */}

      <div className="space-y-4">

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-wide">
              Queue List
            </h1>

            <div className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1 select-none">
              <span
                className="text-amber-600 cursor-pointer hover:underline"
                onClick={() => router.push('/admin/dashboard')}
              >
                Dashboard
              </span>
              <span>&gt;</span>
              <span className="text-gray-400">Queue List</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/admin/add-new-queue')}
            className="px-5 py-2.5 bg-[#b06000] hover:bg-[#905000] text-white text-sm font-semibold rounded-md shadow-sm transition cursor-pointer"
          >
            + Add New Queue
          </button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <h2 className="text-base font-bold text-gray-700 tracking-wide">
            Pending Queue ({pendingQueues.length})
          </h2>

          <button
            type="button"
            className="w-10 h-9 bg-slate-500 text-white rounded flex items-center justify-center text-sm"
          >
            🎛️
          </button>
        </div>

        {pendingQueues.length === 0 ? (
          <div className="bg-white rounded border border-gray-100 py-12 text-center text-gray-400 text-sm shadow-sm">
            No entries pending inside the tracking channel registry pipeline yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 gap-2">

            {pendingQueues.map((item) => (
              <div
                key={item.id}
                className="bg-[#F6F5EE] border border-gray-200 rounded p-4 flex flex-col justify-between shadow-sm"
              >

                <div className="flex justify-between items-start border-b border-gray-200 pb-1">

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm uppercase text-black-100">
                      Vehicle No:
                    </span>

                    <span className="text-sm text-gray-700 truncate">
                      {item.serialNo ?? item.vehicleNo}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm hover:text-red-600"
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/edit/queue?editId=${encodeURIComponent(item.id)}`
                        )
                      }
                      className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm hover:text-amber-700"
                    >
                      View
                    </button>

                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs font-medium text-gray-600">

                  

                  <p>
                    <span className="text-gray-400 text-[10px] uppercase block">
                      Route:
                    </span>
                    {item.from} - {item.to}
                  </p>

                  <p>
                    <span className="text-gray-400 text-[10px] uppercase block">
                      Entry Date:
                    </span>
                    <span className="font-mono">
                      {item.entryDate}
                    </span>
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* IN JOB SECTION */}

      <div className="space-y-4 pt-4 border-t border-gray-100">

        {/* STATUS TABS */}

        <div className="flex flex-wrap items-center justify-end gap-2 bg-slate-100/60 p-1.5 rounded-lg max-w-2xl ml-auto">

          {(
            [
              'All',
              'In Job',
              'In Queue',
              'Unregistered',
              'Payment Pending',
            ] as const
          ).map((tab) => (

            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#b06000] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-slate-200/50'
              }`}
            >
              {tab}
            </button>

          ))}

          <div className="flex border-l border-gray-300 pl-2 gap-1">
            <button className="p-1 bg-white border rounded text-xs shadow-sm">
              📊
            </button>

            <button className="p-1 bg-slate-500 border rounded text-white text-xs shadow-sm">
              🎛️
            </button>
          </div>

        </div>

        {/* SEARCH PANEL */}

        <div className="bg-white rounded border border-gray-100 p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              Vehicle Name*
            </label>

            <input
              type="text"
              placeholder="Select a vehicle..."
              value={searchVehicle}
              onChange={(e) => setSearchVehicle(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#b06000]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              Card Type*
            </label>

            <select
              value={searchCardType}
              onChange={(e) => setSearchCardType(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none bg-slate-50/50 text-gray-500"
            >
              <option value="">Select...</option>
              <option value="in_job">In Job</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">
              Vehicle Type*
            </label>

            <input
              type="text"
              placeholder="Select..."
              value={searchVehicleType}
              onChange={(e) => setSearchVehicleType(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#b06000]"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full py-2 bg-[#b06000] text-white text-xs font-bold rounded shadow transition hover:bg-[#905000] cursor-pointer"
          >
            Search
          </button>

        </div>

        {/* IN JOB CARDS */}

        {inJobQueues.length === 0 ? (

          <div className="bg-white rounded border border-gray-100 py-12 text-center text-gray-400 text-sm shadow-sm">
            No processed logs currently cataloged inside the active job array.
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 p-4">

            {inJobQueues.map((item) => (

              <div key={item.id}
                className="bg-gray-100 border-t-4 border-slate-50 rounded shadow-md p-4 flex flex-col justify-between relative group">

                <div className="flex flex-nowrap items-center justify-end gap-2 ml-auto w-fit">

  {isCheckpointSaved(item) ? (
    <button
      type="button"
      onClick={() =>
        router.push(
          `/admin/edit/receipt?id=${encodeURIComponent(item.id)}`
        )
      }
      className="shrink-0 text-[9px] font-bold border rounded-full px-3 py-1 bg-green-600 text-white hover:bg-green-700"
    >
      Receipt
    </button>
  ) : (
    <button
      type="button"
      onClick={() =>
        router.push(
          `/admin/edit/view?editId=${encodeURIComponent(item.id)}`
        )
      }
      className="shrink-0 text-[9px] font-bold border rounded-full px-3 py-1 bg-amber-600 text-white hover:bg-amber-700"
    >
      + Check In
    </button>
  )}

  <button
    type="button"
    onClick={() =>
      router.push(`/admin/queue/view?id=${encodeURIComponent(item.id)}`)
    }
    className="shrink-0 text-[9px] font-bold border rounded-full px-3 py-1 bg-gray-50 text-gray-600"
  >
    View
  </button>

  <button
    type="button"
    onClick={() => handleDelete(item.id)}
    className="shrink-0 text-[9px] font-bold border rounded-full px-3 py-1 bg-gray-50 text-red-600"
  >
    End Journey
  </button>

</div>


                    <span className="px-1.5 py-0.5 bg-cyan-200 text-white font-extrabold text-[9px] rounded uppercase self-start mb-2">
                      In Job
                    </span>

                    <span className="text-[10px] font-bold text-gray-400">
                      Queue No: {item.queueNo || item.id.slice(0, 8)}
                    </span>

              
                    <p className="text-[10px] text-gray-500">
                       {item.vehicleNo}
                    </p>

                <div className="mt-2 space-y-2 text-xs text-gray-600">

                  <p>
                    <span className="text-gray-400 block text-[9px] uppercase">
                      Route:
                    </span>
                    {item.from} - {item.to}
                  </p>

                  

                  <p>
                    <span className="text-gray-400 block text-[9px] uppercase">
                      Last CheckPoint:
                    </span>
                    <span className="text-gray-700 text-[9px]">
            {/* ✅ DYNAMIC FIELD HOOK BINDS DIRECTLY TO USER FORM DATA SELECTIONS */}
            {item.checkpointEntry || '2026-11-07'}
          </span>
                  </p>

                 

                  

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
