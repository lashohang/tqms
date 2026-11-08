
'use client';

import React, { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useForm,
  SubmitHandler
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// -----------------------------------------
// INTERFACES
// -----------------------------------------

interface VehicleLog {
  id: number;
  vehicleNo: string;
  vehicleType?: string;
  plateNo?: string;
  vehicleNumber?: string;
  lotNo?: string;
  plateType?: string;
}

interface QueueItem {
  id: number | string;
  serialNo?: number;
  vehicleNo: string;
  registeredVehicleNo?: string;
  from?: string;
  to?: string;
  grossWeight?: number;
  entryDate?: string;
  companyName?: string;
  loadDetails?: string;
  material?: string;
  narration?: string;
  driversPhone?: string;
  checkpointEntry?: string;
  status?: 'pending' | 'in_job';
  queueNo?: string;
  vehicleType?: string;
  feeAmount?: string;
  [key: string]: any;
}

// -----------------------------------------
// DEFAULT VEHICLES
// -----------------------------------------

const DEFAULT_VEHICLES: VehicleLog[] = [
  {
    id: 1,
    vehicleNo: 'BA-7-KHA-6666',
    plateNo: 'BA-7-KHA-6666',
    vehicleNumber: '6666',
    lotNo: '96',
    vehicleType: 'Truck 12 Wheeler 21 Ton',
  },
  {
    id: 2,
    vehicleNo: 'BA-7-KHA-5554',
    plateNo: 'BA-7-KHA-5554',
    vehicleNumber: '5554',
    lotNo: '96',
    vehicleType: 'Container 10 Wheeler 17 Ton',
  },
  {
    id: 3,
    vehicleNo: 'BA-7-KHA-3434',
    plateNo: 'BA-7-KHA-3434',
    vehicleNumber: '3434',
    lotNo: '96',
    vehicleType: 'Mini Truck',
  },
];

// -----------------------------------------
// VALIDATION SCHEMA
// -----------------------------------------

const queueSchema = z.object({
  vehicleNo: z.string().min(1, 'Vehicle number is required'),
  from: z.string().min(1, 'From point is required'),
  to: z.string().min(1, 'To point is required'),
  checkpointEntry: z.string().min(1, 'Checkpoint selection required'),
  grossWeight: z.number().min(1, 'Gross Weight must be entered to process'),
  entryDate: z.string().min(1, 'Entry date is required'),
  companyName: z.string().optional(),
  loadDetails: z.string().optional(),
  material: z.string().min(1, 'Material is required'),
  narration: z.string().min(1, 'Remarks are required'),
  driversPhone: z.string().min(10, "Driver's phone number is required"),
});

type QueueFormData = z.infer<typeof queueSchema>;

// -----------------------------------------
// MAIN CHECKPOINT COMPONENT
// -----------------------------------------

function CheckpointQueueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get('editId');

  // ---------------------------------------
  // STATES
  // ---------------------------------------

  const [vehicleOptions, setVehicleOptions] = useState<VehicleLog[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLog | null>(null);

  const [selectedFee, setSelectedFee] = useState('100');
  const [currentSystemTime, setCurrentSystemTime] = useState('');
  const [currentSystemDate, setCurrentSystemDate] = useState('');

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState('');

  const [hasActiveQueue, setHasActiveQueue] = useState(false);

  // ---------------------------------------
  // FORM INITIALIZATION
  // ---------------------------------------

  const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isSubmitting }
} = useForm<QueueFormData>({
  resolver: zodResolver(queueSchema),
  defaultValues: {
    vehicleNo: '',
    from: 'Maiwakhola',
    to: 'Sidingba',
    checkpointEntry: 'First Checkpoint',
    grossWeight: '' as unknown as number,
    entryDate: '',
    companyName: '',
    loadDetails: '',
    material: 'Pen',
    narration: 'Hello sir. How do you do?',
    driversPhone: ''
  }
});

  // Watched form values
  const watchedVehicleNo = watch('vehicleNo');
  const watchedNarration = watch('narration');
  const watchedGrossWeight = watch('grossWeight');
  const watchedMaterial = watch('material');

  // ---------------------------------------
  // LOAD SYSTEM DATE AND VEHICLES
  // ---------------------------------------

  useEffect(() => {
    const now = new Date();

    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    setCurrentSystemTime(formattedTime);
    setCurrentSystemDate(formattedDate);
    setValue('entryDate', formattedDate);

    loadVehicles();
  }, [setValue]);

  // ---------------------------------------
  // LOAD REGISTERED VEHICLES
  // ---------------------------------------

  const loadVehicles = () => {
    try {
      const savedVehicles = localStorage.getItem('tqms_vehicles_list');

      if (!savedVehicles) {
        setVehicleOptions(DEFAULT_VEHICLES);
        return;
      }

      const parsedVehicles = JSON.parse(savedVehicles);

      if (!Array.isArray(parsedVehicles) || parsedVehicles.length === 0) {
        setVehicleOptions(DEFAULT_VEHICLES);
        return;
      }

      const formattedVehicles: VehicleLog[] = parsedVehicles.map(
        (vehicle: any, index: number) => ({
          id: Number(vehicle.id) || index + 1,
          vehicleNo:
            vehicle.plateNo ||
            vehicle.vehicleNumber ||
            vehicle.vehicleNo ||
            '',
          plateNo: vehicle.plateNo || '',
          vehicleNumber: vehicle.vehicleNumber || '',
          lotNo: vehicle.lotNo || '',
          plateType: vehicle.plateType || '',
          vehicleType: vehicle.vehicleType || '',
        })
      );

      const validVehicles = formattedVehicles.filter(
        (vehicle) => vehicle.vehicleNo
      );

      setVehicleOptions(
        validVehicles.length > 0 ? validVehicles : DEFAULT_VEHICLES
      );
    } catch (error) {
      console.error('Error loading registered vehicles:', error);
      setVehicleOptions(DEFAULT_VEHICLES);
    }
  };

  // ---------------------------------------
  // LOAD ORIGINAL QUEUE
  // ---------------------------------------

  useEffect(() => {
    if (!editId) return;

    try {
      const saved = localStorage.getItem('tqms_live_queues');

      if (!saved) return;

      const items: QueueItem[] = JSON.parse(saved);

      const match = items.find(
        (item) => String(item.id) === String(editId)
      );

      if (!match) {
        alert('Queue record not found.');
        return;
      }

      // Keep the original sequential Vehicle No.
      setValue('vehicleNo', String(match.serialNo ?? ''));

      setValue('from', match.from || 'Maiwakhola');
      setValue('to', match.to || 'Sidingba');

      // Admin enters these fields manually
      setValue('grossWeight', '' as unknown as number);
      setValue('driversPhone', '');

      setValue(
        'checkpointEntry',
        match.checkpointEntry || 'First Checkpoint'
      );

      setValue('material', match.material || 'Pen');

      setValue(
        'narration',
        match.narration || 'Hello sir. How do you do?'
      );

      if (match.feeAmount) {
        setSelectedFee(String(match.feeAmount));
      }

    } catch (error) {
      console.error('Error loading queue:', error);
    }
  }, [editId, setValue]);

  // ---------------------------------------
  // RESTORE PREVIOUSLY SELECTED VEHICLE
  // ---------------------------------------

  useEffect(() => {
    if (!editId || vehicleOptions.length === 0) return;

    try {
      const saved = localStorage.getItem('tqms_live_queues');

      const items: QueueItem[] = saved ? JSON.parse(saved) : [];

      const match = items.find(
        (item) => String(item.id) === String(editId)
      );

      if (!match) return;

      const savedVehicleNo = String(
        match.registeredVehicleNo || ''
      )
        .trim()
        .toLowerCase();

      if (!savedVehicleNo) {
        setSelectedVehicle(null);
        return;
      }

      const existingVehicle = vehicleOptions.find((vehicle) => {
        const possibleNumbers = [
          vehicle.vehicleNo,
          vehicle.plateNo,
          vehicle.vehicleNumber,
        ];

        return possibleNumbers.some(
          (number) =>
            String(number || '').trim().toLowerCase() === savedVehicleNo
        );
      });

      setSelectedVehicle(existingVehicle || null);

      if (existingVehicle) {
        const queues: QueueItem[] = saved ? JSON.parse(saved) : [];

        const activeQueue = queues.some((item) => {
          const sameVehicle =
            item.registeredVehicleNo === existingVehicle.vehicleNo ||
            item.vehicleNo === existingVehicle.vehicleNo;

          return (
            sameVehicle &&
            item.status === 'in_job' &&
            String(item.id) !== String(editId)
          );
        });

        setHasActiveQueue(activeQueue);
      }

    } catch (error) {
      console.error('Error restoring matched vehicle:', error);
    }
  }, [editId, vehicleOptions]);

  // ---------------------------------------
  // FILTER VEHICLES
  // ---------------------------------------

  const filteredVehicles = vehicleOptions.filter((vehicle) =>
    String(vehicle.vehicleNo || '')
      .toLowerCase()
      .includes(vehicleSearch.toLowerCase())
  );

  // ---------------------------------------
  // CHECK WHETHER VEHICLE HAS ACTIVE QUEUE
  // ---------------------------------------

  const checkVehicleActiveQueue = (registrationNo: string) => {
    try {
      const saved = localStorage.getItem('tqms_live_queues');

      const queues: QueueItem[] = saved ? JSON.parse(saved) : [];

      return queues.some((item) => {
        const sameVehicle =
          item.registeredVehicleNo === registrationNo ||
          item.vehicleNo === registrationNo;

        return sameVehicle && item.status === 'in_job';
      });

    } catch (error) {
      console.error('Error checking active queue:', error);
      return false;
    }
  };

  // ---------------------------------------
  // SELECT REGISTERED VEHICLE
  // ---------------------------------------

  const handleVehicleSelect = (vehicle: VehicleLog) => {
    setSelectedVehicle(vehicle);

    const activeQueue = checkVehicleActiveQueue(vehicle.vehicleNo);

    setHasActiveQueue(activeQueue);

    // If there is no active queue, start at first checkpoint
    if (!activeQueue) {
      setValue('checkpointEntry', 'First Checkpoint', {
        shouldValidate: true
      });
    }

    setShowVehicleModal(false);
    setVehicleSearch('');
  };

  // ---------------------------------------
  // SUBMIT AND UPDATE QUEUE
  // ---------------------------------------

  const onQueueSubmit: SubmitHandler<QueueFormData> = async (formData) => {
    if (!editId) {
      alert('Pending queue ID is missing.');
      return;
    }

    if (!selectedVehicle) {
      alert('Please select a registered vehicle first.');
      return;
    }

    try {
      const saved = localStorage.getItem('tqms_live_queues');

      const currentList: QueueItem[] = saved ? JSON.parse(saved) : [];

      const existingItem = currentList.find(
        (item) => String(item.id) === String(editId)
      );

      if (!existingItem) {
        alert('Pending queue record not found.');
        return;
      }

      const updatedList = currentList.map((item) => {
        if (String(item.id) === String(editId)) {
          return {
            ...item,

            // Preserve the original sequential Vehicle No.
            serialNo: item.serialNo,

            // Save selected registration separately
            registeredVehicleNo: selectedVehicle.vehicleNo,

            // Save the selected vehicle type
            vehicleType:
              selectedVehicle.vehicleType ||
              item.vehicleType ||
              'truck 12 wheeler 21 ton',

            from: formData.from,
            to: formData.to,
            checkpointEntry: formData.checkpointEntry,
            grossWeight: formData.grossWeight,
            entryDate: currentSystemDate,
            material: formData.material,
            narration: formData.narration,
            driversPhone: formData.driversPhone,

            status: 'in_job' as const,

            queueNo:
              item.queueNo ||
              String(Math.floor(100000 + Math.random() * 900000)),

            feeAmount: selectedFee
          };
        }

        return item;
      });

      localStorage.setItem(
        'tqms_live_queues',
        JSON.stringify(updatedList)
      );

      alert('Queue successfully moved to In Job!');

      router.push(`/admin/edit/receipt?id=${editId}`);

    } catch (error) {
      console.error('Queue update failed:', error);
      alert('Unable to update queue. Please try again.');
    }
  };

  // ---------------------------------------
  // RECEIPT CALCULATIONS
  // ---------------------------------------

  const grossWeight = Number(watchedGrossWeight || 0);
  const feeAmount = Number(selectedFee || 0);

  // ---------------------------------------
  // JSX
  // ---------------------------------------

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 p-2 animate-in fade-in duration-200">

      {/* PAGE HEADER */}

      <div className="select-none">
        <h1 className="text-base font-bold text-gray-800 tracking-tight">
          Approved New Queue
        </h1>

        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
          <span
            className="text-amber-600 cursor-pointer"
            onClick={() => router.push('/admin/dashboard')}
          >
            Dashboard
          </span>

          <span>&gt;</span>

          <span
            className="text-amber-600 cursor-pointer"
            onClick={() => router.push('/admin/queue')}
          >
            Queue
          </span>

          <span>&gt;</span>

          <span>{watchedVehicleNo || '---'}</span>
        </div>
      </div>

      {/* MAIN FORM */}

      <form onSubmit={handleSubmit(onQueueSubmit)}>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">

          {/* LEFT COLUMN */}

          <div className="lg:col-span-6 space-y-5">

            {/* VEHICLE NUMBER AND ACTIVE QUEUE NOTICE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">

              <div className="flex flex-col gap-1.5 max-w-sm">
                <label className="text-xs font-bold text-gray-700">
                  Vehicle No.*
                </label>

                <input
                  type="text"
                  readOnly
                  {...register('vehicleNo')}
                  className="w-full px-3 py-1.5 border border-gray-300 bg-gray-50 text-gray-800 rounded text-xs font-semibold outline-none"
                />
              </div>

              {selectedVehicle && !hasActiveQueue && (
                <div className="text-center rounded-md px-3 py-2">
                  <p className="text-[9px] font-bold text-gray-800">
                    There is no active queue for this vehicle.
                  </p>

                  <p className="text-[9px] text-amber-700 mt-1">
                    Note: Checkpoint entry should be placed on first checkpoint.
                  </p>
                </div>
              )}

            </div>

            <div className="flex flex-wrap items-end gap-3">

              {/* REGISTERED VEHICLE */}

              {selectedVehicle && (
                <div className="flex flex-col gap-1.5 flex-1 min-w-[180px] max-w-sm">
                  <label className="text-xs font-bold text-gray-700">
                    Registered Vehicle No.*
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={selectedVehicle.vehicleNo}
                      readOnly
                      className="w-full px-3 py-2 pr-10 border border-emerald-300 bg-emerald-50 text-gray-800 rounded text-xs font-semibold outline-none"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">
                      ✓
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  loadVehicles();
                  setShowVehicleModal(true);
                }}
                className="w-24 h-11 bg-[#b06000] hover:bg-[#914e00] rounded text-white flex flex-col items-center justify-center text-center font-bold text-[10px] uppercase tracking-wider shadow-sm transition-colors"
              >
                <span>Matched</span>
                <span>Vehicle</span>
              </button>

            </div>

            {/* FROM AND TO */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  From*
                </label>

                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-700 outline-none"
                  {...register('from')}
                >
                  <option value="Maiwakhola">Maiwakhola</option>
                  <option value="Kathmandu">Kathmandu</option>
                </select>

                {errors.from && (
                  <p className="text-red-500 text-[10px]">
                    {errors.from.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  To*
                </label>

                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-700 outline-none"
                  {...register('to')}
                >
                  <option value="Sidingba">Sidingba</option>
                  <option value="Makawanpur">Makawanpur</option>
                </select>

                {errors.to && (
                  <p className="text-red-500 text-[10px]">
                    {errors.to.message}
                  </p>
                )}
              </div>

            </div>

            {/* CHECKPOINT AND WEIGHT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Checkpoint Entry*
                </label>

                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-700 font-semibold outline-none"
                  {...register('checkpointEntry')}
                >
                  <option value="First Checkpoint">
                    First Checkpoint
                  </option>

                  <option value="Second Checkpoint">
                    Second Checkpoint
                  </option>

                  <option value="Third Checkpoint">
                    Third Checkpoint
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Gross Weight (KG)*
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  className={`w-full px-3 py-1.5 border rounded text-xs outline-none ${
                    errors.grossWeight
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-amber-600'
                  }`}
                  {...register('grossWeight', { valueAsNumber: true })}
                />

                {errors.grossWeight && (
                  <p className="text-red-500 text-[10px]">
                    {errors.grossWeight.message}
                  </p>
                )}
              </div>

            </div>

            {/* MATERIAL */}

            <div className="flex flex-col gap-1.5 max-w-sm">
              <label className="text-xs font-bold text-gray-700">
                Material*
              </label>

              <div className="relative flex items-center">
                <select
                  className="w-full px-3 py-1.5 border border-emerald-300 rounded text-xs bg-white text-gray-800 outline-none font-semibold pr-10"
                  {...register('material')}
                >
                  <option value="Pen">Pen</option>
                  <option value="Wood">Wood</option>
                  <option value="Cement">Cement</option>
                </select>

                <span className="absolute right-8 text-emerald-500 font-bold text-xs select-none">
                  ✓
                </span>
              </div>

              {errors.material && (
                <p className="text-red-500 text-[10px]">
                  {errors.material.message}
                </p>
              )}
            </div>

            {/* REMARKS */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                Remarks*
              </label>

              <textarea
                rows={2}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none text-gray-700"
                {...register('narration')}
              />

              {errors.narration && (
                <p className="text-red-500 text-[10px]">
                  {errors.narration.message}
                </p>
              )}
            </div>

            {/* DRIVER PHONE */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                Driver's Phone*
              </label>

              <input
                type="tel"
                placeholder="Enter driver's phone number"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none ${
                  errors.driversPhone
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-amber-600'
                }`}
                {...register('driversPhone')}
              />

              {errors.driversPhone && (
                <p className="text-red-500 text-[10px]">
                  {errors.driversPhone.message}
                </p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN - RECEIPT PANEL */}

          <div className="lg:col-span-6 flex flex-col gap-4">

            {/* SAVE BUTTON */}

            <div className="flex justify-end w-full select-none">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded text-xs font-bold shadow-sm transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>

            {/* RECEIPT */}

            <div className="bg-white border border-gray-300 shadow-sm p-5 sm:p-7 font-mono text-gray-800">

              {/* RECEIPT HEADER */}

              <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-4">

                <p className="text-[10px] mb-1">
                  नेपाल ट्रक यातायात व्यवसायी महासंघ
                </p>

                <h2 className="text-lg font-bold tracking-tight">
                  Loadboard Sthानीय
                </h2>

                <p className="text-[10px] mt-1">
                  फोन नं: 01-9863333, 013-5555555
                </p>

              </div>

              {/* RECEIPT DETAILS */}

              <div className="space-y-2 text-[10px]">

                <div className="flex justify-between gap-2">
                  <span>पान नं: 852100017</span>
                  <span>रसिद नं: INX_2026_2_7</span>
                </div>

                <div className="flex justify-between gap-2">
                  <span>मिति: {currentSystemDate}</span>
                  <span>समय: {currentSystemTime}</span>
                </div>

                <div className="flex justify-between">
                  <span>तौलस्थान:</span>
                  <span>Loadboard Checkpoint</span>
                </div>

                <div className="flex justify-between">
                  <span>सवारी नं:</span>
                  <strong>{watchedVehicleNo || '---'}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Registered Vehicle:</span>
                  <strong>{selectedVehicle?.vehicleNo || '---'}</strong>
                </div>

                <div className="flex justify-between">
                  <span>सामान:</span>
                  <strong>{watchedMaterial || 'Pen'}</strong>
                </div>

                <div className="flex justify-between">
                  <span>तौल:</span>
                  <strong>{grossWeight.toFixed(2)} KG</strong>
                </div>

                <div className="border-t border-dashed border-gray-400 pt-2">
                  <span>विवरण:</span>
                  <p className="mt-1 break-words">
                    "{watchedNarration}"
                  </p>
                </div>

              </div>

              {/* FEE DETAILS */}

              <div className="mt-5 border-t border-dashed border-gray-400 pt-3">

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold mb-3">
                  <span>विवरण</span>
                  <span className="text-right">रकम (रू.)</span>
                </div>

                <div className="flex justify-between items-center text-xs mb-3">
                  <span>काटा शुल्क</span>

                  <div className="w-24">
                    <select
                      value={selectedFee}
                      onChange={(e) => setSelectedFee(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 bg-white font-mono font-bold outline-none text-xs"
                    >
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                      <option value="250">250</option>
                      <option value="300">300</option>
                      <option value="500">500</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between border-t border-gray-300 pt-3 font-bold text-sm">
                  <span>जम्मा शुल्क</span>
                  <span>{feeAmount.toFixed(2)}</span>
                </div>

              </div>

              {/* RECEIPT FOOTER */}

              <div className="text-center border-t border-dashed border-gray-400 mt-5 pt-4 text-[10px]">
                <p>धन्यवाद!</p>
                <p className="mt-1">
                  सुरक्षित यात्रा गर्नुहोस्।
                </p>
              </div>

            </div>

          </div>

        </div>

      </form>

      {/* =====================================
          REGISTERED VEHICLE SELECTION MODAL
      ===================================== */}

      {showVehicleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVehicleModal(false);
              setVehicleSearch('');
            }
          }}
        >
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Select Registered Vehicle
                </h2>

                <p className="text-[10px] text-gray-500 mt-1">
                  Choose a vehicle from the registered vehicle list.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowVehicleModal(false);
                  setVehicleSearch('');
                }}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* SEARCH */}

            <div className="p-4">

              <input
                type="text"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                placeholder="Search vehicle number..."
                autoFocus
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-amber-600"
              />

              {/* VEHICLE LIST */}

              <div className="mt-3 max-h-64 overflow-y-auto space-y-2">

                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle, index) => (
                    <button
                      key={vehicle.id ?? `${vehicle.vehicleNo}-${index}`}
                      type="button"
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`w-full flex items-center justify-between border rounded px-3 py-3 text-left transition-colors ${
                        selectedVehicle?.vehicleNo === vehicle.vehicleNo
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-400 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          {vehicle.vehicleNo}
                        </p>

                        <p className="text-[10px] text-gray-500 mt-1">
                          {vehicle.vehicleType || 'Vehicle type not specified'}
                        </p>
                      </div>

                      {selectedVehicle?.vehicleNo === vehicle.vehicleNo && (
                        <span className="text-emerald-600 text-xs font-bold">
                          ✓ Selected
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs font-semibold text-gray-500">
                      No registered vehicles found.
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      Try searching with another vehicle number.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-between items-center border-t px-4 py-3">

              <span className="text-[10px] text-gray-400">
                {filteredVehicles.length} vehicle(s) found
              </span>

              <button
                type="button"
                onClick={() => {
                  setShowVehicleModal(false);
                  setVehicleSearch('');
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// -----------------------------------------
// PAGE EXPORT WITH SUSPENSE
// -----------------------------------------

export default function AdminCheckpointPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px] text-sm text-gray-500">
          Loading checkout forms...
        </div>
      }
    >
      <CheckpointQueueContent />
    </Suspense>
  );
}
