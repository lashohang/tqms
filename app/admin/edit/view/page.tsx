'use client';

import React, { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// =========================================================================
// VALIDATION SCHEMA
// =========================================================================

const checkpointSchema = z.object({
  grossWeight: z.coerce
    .number()
    .min(1, 'Gross Weight (Kg) must be entered to process'),
  kataFee: z.coerce.number().min(0, 'Fee must be a positive number'),
});

type CheckpointFormInputs = z.infer<typeof checkpointSchema>;

// =========================================================================
// QUEUE INTERFACE
// =========================================================================

interface QueueItem {
  id: string | number;

  // Sequential dashboard number: 1, 2, 3...
  serialNo?: number;

  // Actual vehicle registration number
  vehicleNo: string;
  registeredVehicleNo?: string;

  from?: string;
  to?: string;
  grossWeight?: number;
  entryDate?: string;
  companyName?: string;
  loadDetails?: string;
  narration?: string;
  driversPhone?: string;

  status: 'pending' | 'in_job';
  queueNo?: string;
  vehicleType?: string;
  checkpointEntry?: string;
  checkpointSaved?: boolean;
  feeAmount?: string;
  material?: string;

  [key: string]: any;
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================

function CheckpointProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get('editId');

  // -----------------------------------------------------------------------
  // STATES
  // -----------------------------------------------------------------------

  const [targetVehicle, setTargetVehicle] = useState('—');
  const [registeredVehicle, setRegisteredVehicle] = useState('—');
  const [currentSystemTime, setCurrentSystemTime] = useState('');
  const [currentSystemDate, setCurrentSystemDate] = useState('');

  const [queueDetails, setQueueDetails] = useState<QueueItem | null>(null);

  // -----------------------------------------------------------------------
  // FORM
  // -----------------------------------------------------------------------

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckpointFormInputs>({
    resolver: zodResolver(checkpointSchema),
    defaultValues: {
      grossWeight: 0,
      kataFee: 50,
    },
  });

  const watchedGrossWeight = watch('grossWeight');
  const watchedKataFee = watch('kataFee');

  // -----------------------------------------------------------------------
  // DATE AND TIME
  // -----------------------------------------------------------------------

  useEffect(() => {
    const now = new Date();

    setCurrentSystemTime(
      now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    setCurrentSystemDate(`${year}-${month}-${day}`);
  }, []);

  // -----------------------------------------------------------------------
  // LOAD QUEUE DETAILS
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!editId) {
      alert('Queue ID is missing.');
      return;
    }

    try {
      const saved = localStorage.getItem('tqms_live_queues');

      if (!saved) {
        alert('No queue records found.');
        return;
      }

      const items: QueueItem[] = JSON.parse(saved);

      const match = items.find(
        (item) => String(item.id) === String(editId)
      );

      if (!match) {
        alert('Queue record not found.');
        return;
      }

      setQueueDetails(match);

      // Display the sequential Vehicle No.
      setTargetVehicle(
        match.serialNo !== undefined && match.serialNo !== null
          ? String(match.serialNo)
          : '—'
      );

      // Display the actual registration separately.
      setRegisteredVehicle(
        match.registeredVehicleNo || match.vehicleNo || '—'
      );

      // Load existing values into the form.
      setValue('grossWeight', Number(match.grossWeight) || 0);
      setValue('kataFee', Number(match.feeAmount ?? 50));
    } catch (error) {
      console.error('Error loading queue:', error);
      alert('Unable to load queue details.');
    }
  }, [editId, setValue]);

  // -----------------------------------------------------------------------
  // SUBMIT CHECKPOINT PROCESSING
  // -----------------------------------------------------------------------

  const onProcessSubmit: SubmitHandler<CheckpointFormInputs> = async (
    formData
  ) => {
    if (!editId) {
      alert('Queue ID is missing.');
      return;
    }

    try {
      const saved = localStorage.getItem('tqms_live_queues');

      if (!saved) {
        alert('Queue records not found.');
        return;
      }

      const currentList: QueueItem[] = JSON.parse(saved);

      const existingItem = currentList.find(
        (item) => String(item.id) === String(editId)
      );

      if (!existingItem) {
        alert('Queue record not found.');
        return;
      }

      // Keep an existing queue number, or generate a stable one.
      const stableQueueNo =
        existingItem.queueNo ||
        `Q-${String(existingItem.serialNo ?? existingItem.id)}`;

      const updatedList = currentList.map((item) => {
        if (String(item.id) !== String(editId)) {
          return item;
        }

        return {
          ...item,

          // Preserve the original queue ID.
          id: existingItem.id,

          // Preserve the sequential dashboard Vehicle No.
          serialNo: existingItem.serialNo,

          // Preserve the actual vehicle registration.
          vehicleNo: existingItem.vehicleNo,
          registeredVehicleNo:
            existingItem.registeredVehicleNo || existingItem.vehicleNo,

          // Save checkpoint information.
          grossWeight: formData.grossWeight,
          feeAmount: String(formData.kataFee),

          // Mark this specific queue as processed.
          checkpointSaved: true,

          // Preserve the existing status.
          status: 'in_job' as const,

          // Preserve or generate the queue number.
          queueNo: stableQueueNo,

          // Preserve the vehicle type.
          vehicleType: existingItem.vehicleType || '',

          // Checkpoint name.
          checkpointEntry: 'Jhapa Checkpoint',
        };
      });

      // Persist the updated queue list.
      localStorage.setItem(
        'tqms_live_queues',
        JSON.stringify(updatedList)
      );

      // Notify any mounted dashboard listening for queue updates.
      window.dispatchEvent(new Event('queuesUpdated'));

      alert('Checkpoint processed successfully!');

      // Open the receipt for this exact queue.
      router.push(
        `/admin/edit/receipt?id=${encodeURIComponent(String(editId))}`
      );
    } catch (error) {
      console.error('Checkpoint processing failed:', error);
      alert('Unable to process checkpoint. Please try again.');
    }
  };

  // =========================================================================
  // UI
  // =========================================================================

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 p-2 animate-in fade-in duration-200 text-gray-800">

      {/* PAGE HEADER */}

      <div className="select-none">
        <h1 className="text-base font-bold text-gray-800 tracking-tight">
          Checkpoint Entry
        </h1>

        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
          <span>Dashboard</span>
          <span>&gt;</span>
          <span>Queue</span>
          <span>&gt;</span>
          <span>New</span>
          <span>&gt;</span>

          <span className="text-amber-700 font-bold">
            {targetVehicle}
          </span>
        </div>
      </div>

      {/* MAIN FORM */}

      <form onSubmit={handleSubmit(onProcessSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">

          {/* LEFT PANEL */}

          <div className="lg:col-span-6 space-y-6 bg-white rounded border border-gray-100 p-6 shadow-sm">

            {/* GROSS WEIGHT */}

            <div className="flex flex-col gap-1.5 max-w-sm">
              <label className="text-xs font-bold text-gray-700">
                Gross Weight (Kg)*
              </label>

              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter gross weight"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none text-gray-700 focus:border-amber-600 font-mono font-bold ${
                  errors.grossWeight
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('grossWeight')}
              />

              {errors.grossWeight && (
                <span className="text-[10px] text-red-500 font-bold">
                  {errors.grossWeight.message}
                </span>
              )}
            </div>

            {/* QUEUE STATUS */}

            <div className="space-y-2 text-xs">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-1 select-none">
                Queue Status
              </h3>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Vehicle No.</span>
                <span className="text-right font-bold text-gray-700">
                  {targetVehicle}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Queue Number</span>
                <span className="text-right font-bold text-gray-700">
                  {queueDetails?.queueNo || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Entry Date</span>
                <span className="text-right font-mono text-gray-500 font-bold">
                  {queueDetails?.entryDate || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Last CheckPoint</span>
                <span className="text-right font-bold text-gray-700">
                  {queueDetails?.checkpointEntry || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Route</span>
                <span className="text-right font-bold text-gray-700 truncate">
                  {queueDetails
                    ? `${queueDetails.from} - ${queueDetails.to}`
                    : '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Transport Company</span>
                <span className="text-right font-mono text-gray-500">
                  {queueDetails?.companyName || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Load Details</span>
                <span className="text-right font-bold text-gray-700">
                  {queueDetails?.loadDetails || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">
                  Previous Weight (Kg)
                </span>
                <span className="text-right font-mono font-bold text-gray-700">
                  {queueDetails?.grossWeight ?? '—'}
                </span>
              </div>
            </div>

            {/* VEHICLE STATUS */}

            <div className="space-y-2 text-xs pt-2 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-1 select-none">
                Vehicle Status
              </h3>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Registered Vehicle No.</span>
                <span className="text-right font-bold text-gray-700">
                  {registeredVehicle}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Type</span>
                <span className="text-right font-bold text-gray-700">
                  {queueDetails?.vehicleType || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Is Registered</span>
                <span className="text-right font-bold text-emerald-600">
                  Yes
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">
                  Card Registered/Sthaniya
                </span>
                <span className="text-right font-bold text-gray-700">
                  Loadboard sthaniya
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Owner Name</span>
                <span className="text-right font-bold text-gray-700">
                  {queueDetails?.companyName || '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 py-0.5">
                <span className="text-gray-400">Driver Phone</span>
                <span className="text-right font-mono text-gray-500">
                  {queueDetails?.driversPhone || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - RECEIPT PREVIEW */}

          <div className="lg:col-span-6 flex flex-col gap-4">

            {/* SAVE BUTTON */}

            <div className="flex justify-end select-none w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded-full shadow transition duration-150 focus:outline-none cursor-pointer tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Save'}
              </button>
            </div>

            {/* RECEIPT BOX */}

            <div className="bg-white rounded border border-gray-200/90 shadow-md p-6 font-sans text-[11px] text-gray-700 space-y-4">

              {/* TOP METADATA */}

              <div className="flex justify-between items-start text-[9px] font-mono text-gray-400 select-none">
                <span>Loadboard Checkpoint</span>
                <span>पान नं: 852100017</span>
              </div>

              {/* ORGANIZATION HEADER */}

              <div className="text-center space-y-0.5">
                <h3 className="text-base font-extrabold text-gray-800 tracking-wide">
                  नेपाल ट्रक यातायात व्यवसायी महासंघ
                </h3>

                <p className="text-[11px] font-bold text-gray-500">
                  Loadboard sthानीय
                </p>

                <p className="text-[9px] text-gray-400 font-mono">
                  फोन नं: 01-9863333, 013-5555555
                </p>
              </div>

              {/* RECEIPT DETAILS */}

              <div className="grid grid-cols-12 gap-y-2 border-y border-dashed border-gray-300 py-3 text-gray-600 font-medium">

                <div className="col-span-4">रसिद नं:</div>

                <div className="col-span-8 text-right font-mono font-bold text-gray-900">
                  {queueDetails?.queueNo || '—'}
                </div>

                <div className="col-span-4">मिति:</div>

                <div className="col-span-3 font-mono font-bold text-gray-900">
                  {currentSystemDate || '—'}
                </div>

                <div className="col-span-2 text-right">समय:</div>

                <div className="col-span-3 text-right font-mono font-bold text-gray-900">
                  {currentSystemTime || '—'}
                </div>

                <div className="col-span-4">तौलस्थान:</div>

                <div className="col-span-8 text-right font-bold text-gray-900">
                  Jhapa Checkpoint
                </div>

                <div className="col-span-4">सवारी नं:</div>

                <div className="col-span-8 text-right font-bold text-gray-900">
                  {targetVehicle}
                </div>

                <div className="col-span-4">Registered Vehicle:</div>

                <div className="col-span-8 text-right font-bold text-gray-900">
                  {registeredVehicle}
                </div>

                <div className="col-span-4">सामान:</div>

                <div className="col-span-8 text-right font-bold text-gray-900">
                  {queueDetails?.material || '—'}
                </div>

                <div className="col-span-4">विवरण:</div>

                <div className="col-span-8 text-right font-bold text-gray-900 break-words">
                  {queueDetails?.narration || '—'}
                </div>

                <div className="col-span-4">तौल:</div>

                <div className="col-span-8 text-right font-bold text-gray-900">
                  {Number(watchedGrossWeight || 0).toLocaleString()} Kg
                </div>
              </div>

              {/* FEE TABLE */}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold border-b border-gray-200 pb-2">
                  <span>विवरण</span>
                  <span className="text-right">रकम (रू.)</span>
                </div>

                <div className="grid grid-cols-2 items-center gap-2">
                  <span className="font-medium">काटा शुल्क</span>

                  <div className="flex justify-end">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`w-24 border rounded px-2 py-1 bg-white text-xs font-mono font-bold text-gray-800 text-right outline-none focus:border-amber-600 ${
                        errors.kataFee
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      {...register('kataFee')}
                    />
                  </div>
                </div>

                {errors.kataFee && (
                  <p className="text-[10px] text-red-500 text-right">
                    {errors.kataFee.message}
                  </p>
                )}

                <div className="flex justify-between border-t border-gray-300 pt-3 font-bold text-sm">
                  <span>जम्मा शुल्क</span>
                  <span>
                    {Number(watchedKataFee || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* RECEIPT FOOTER */}

              <div className="text-center border-t border-dashed border-gray-300 pt-4 text-[10px] text-gray-500">
                <p>धन्यवाद!</p>
                <p className="mt-1">
                  सुरक्षित यात्रा गर्नुहोस्।
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// =========================================================================
// PAGE EXPORT WITH SUSPENSE
// =========================================================================

export default function CheckpointProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px] text-sm text-gray-500">
          Loading checkpoint data...
        </div>
      }
    >
      <CheckpointProcessingContent />
    </Suspense>
  );
}