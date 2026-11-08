
'use client';

import React, { useEffect, Suspense, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface NarrationLog {
  id: number;
  narrationText: string;
}

interface VehicleLog {
  id: number;
  vehicleNo: string;
  vehicleType?: string;
}

interface QueueRecord {
  id: string;
  vehicleNo: string;
  serialNo?: number;
  from: string;
  to: string;
  grossWeight: number;
  entryDate: string;
  companyName?: string;
  loadDetails?: string;
  narration: string;
  driversPhone?: string;
  status: 'pending' | 'in_job';
  vehicleType?: string;
  queueNo?: string;
  feeAmount?: string;
  [key: string]: any;
}

const queueSchema = z.object({
  vehicleNo: z.string().min(1, 'Vehicle is required'),
  from: z.string().min(1, 'From point is required'),
  to: z.string().min(1, 'To point is required'),
  grossWeight: z.number().min(0, 'Weight cannot be negative'),
  entryDate: z.string().min(1, 'Entry date is required'),
  companyName: z.string().optional(),
  loadDetails: z.string().optional(),
  narration: z.string().min(1, 'Narration is required'),
  driversPhone: z.string().optional(),
});

type QueueFormData = z.infer<typeof queueSchema>;

const DEFAULT_NARRATION = 'Hello sir. How do you do?';
const DEFAULT_ENTRY_DATE = '2083-07-21';

function QueueFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  const [narrationOptions, setNarrationOptions] = useState<NarrationLog[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleLog[]>([]);
  const [selectedFee, setSelectedFee] = useState('50');

  const {
  register,
  handleSubmit,
  watch,
  reset,
  formState: { errors, isSubmitting },
} = useForm<QueueFormData>({
    resolver: zodResolver(queueSchema),
    defaultValues: {
      vehicleNo: '',
      from: '',
      to: '',
      grossWeight: 0,
      entryDate: DEFAULT_ENTRY_DATE,
      companyName: '',
      loadDetails: '',
      narration: DEFAULT_NARRATION,
      driversPhone: '',
    },
  });

  // LOAD VEHICLES AND NARRATIONS
  useEffect(() => {
    try {
      const savedNarrations = localStorage.getItem('tqms_narrations');

      if (savedNarrations) {
        setNarrationOptions(JSON.parse(savedNarrations));
      } else {
        const defaults = [
          { id: 1, narrationText: DEFAULT_NARRATION },
        ];

        localStorage.setItem('tqms_narrations', JSON.stringify(defaults));
        setNarrationOptions(defaults);
      }

      const savedVehicles = localStorage.getItem('tqms_vehicles');

      if (savedVehicles) {
        setVehicleOptions(JSON.parse(savedVehicles));
      } else {
        const defaults = [
          {
            id: 1,
            vehicleNo: 'BA-7-KHA-6666',
            vehicleType: 'Truck 12 Wheeler 21 Ton',
          },
          {
            id: 2,
            vehicleNo: '5554',
            vehicleType: 'Container 10 Wheeler 17 Ton',
          },
          {
            id: 3,
            vehicleNo: '3434',
            vehicleType: 'Mini Truck',
          },
        ];

        localStorage.setItem('tqms_vehicles', JSON.stringify(defaults));
        setVehicleOptions(defaults);
      }
    } catch (error) {
      console.error('Error loading queue form options:', error);
    }
  }, []);

  const watchedVehicleNo = watch('vehicleNo');
  const watchedNarration = watch('narration');
  const watchedGrossWeight = watch('grossWeight');
  const watchedLoadDetails = watch('loadDetails');

  // SELECTED VEHICLE DETAILS
  const selectedVehicleDetails = useMemo(() => {
    return (
      vehicleOptions.find(
        (vehicle) => vehicle.vehicleNo === watchedVehicleNo
      ) || null
    );
  }, [watchedVehicleNo, vehicleOptions]);

  // LOAD EXISTING QUEUE FOR EDITING
  useEffect(() => {
    if (!editId) return;

    try {
      const saved = localStorage.getItem('tqms_live_queues');
      const items: QueueRecord[] = saved ? JSON.parse(saved) : [];

      const match = items.find(
        (item) => String(item.id) === String(editId)
      );

      if (!match) {
        alert('Queue record not found.');
        router.push('/admin/queue');
        return;
      }

      reset({
        vehicleNo: match.vehicleNo || '',
        from: match.from || '',
        to: match.to || '',
        grossWeight: Number(match.grossWeight) || 0,
        entryDate: match.entryDate || DEFAULT_ENTRY_DATE,
        companyName: match.companyName || '',
        loadDetails: match.loadDetails || '',
        narration: match.narration || DEFAULT_NARRATION,
        driversPhone: match.driversPhone || '',
      });

      if (match.feeAmount) {
        setSelectedFee(String(match.feeAmount));
      }
    } catch (error) {
      console.error('Error loading queue record:', error);
      alert('Unable to load queue record.');
    }
  }, [editId, reset, router]);

  // SAVE QUEUE
  const onQueueSubmit: SubmitHandler<QueueFormData> = (formData) => {
    try {
      const saved = localStorage.getItem('tqms_live_queues');

      let currentList: QueueRecord[] = saved
        ? JSON.parse(saved)
        : [];

      if (editId) {
        // WEIGHT IS REQUIRED BEFORE MOVING TO IN JOB
        if (Number(formData.grossWeight) <= 0) {
          alert('Please enter a valid gross weight before saving.');
          return;
        }

        const existingQueue = currentList.find(
          (item) => String(item.id) === String(editId)
        );

        if (!existingQueue) {
          alert('Queue record not found.');
          return;
        }

        currentList = currentList.map((item) => {
          if (String(item.id) !== String(editId)) {
            return item;
          }

          return {
            ...item,
            ...formData,
            id: item.id,
            serialNo: item.serialNo,
            status: 'in_job',
            queueNo:
              item.queueNo ||
              String(Math.floor(100000 + Math.random() * 900000)),
            vehicleType:
              selectedVehicleDetails?.vehicleType ||
              item.vehicleType ||
              'Truck 12 Wheeler 21 Ton',
            feeAmount: selectedFee,
          };
        });
      } else {
        // ASSIGN NUMBERS TO EXISTING RECORDS WITHOUT SERIAL NUMBERS
        const usedSerialNumbers = new Set<number>();

        currentList = currentList.map((item) => {
          const existingSerial = Number(item.serialNo);

          if (
            Number.isInteger(existingSerial) &&
            existingSerial > 0 &&
            !usedSerialNumbers.has(existingSerial)
          ) {
            usedSerialNumbers.add(existingSerial);
            return item;
          }

          let availableSerial = 1;

          while (usedSerialNumbers.has(availableSerial)) {
            availableSerial++;
          }

          usedSerialNumbers.add(availableSerial);

          return {
            ...item,
            serialNo: availableSerial,
          };
        });

        // FIND THE HIGHEST EXISTING SERIAL NUMBER
        const highestExistingSerial = currentList.reduce(
          (max, item) => Math.max(max, Number(item.serialNo) || 0),
          0
        );

        const savedCounter = Number(
          localStorage.getItem('tqms_vehicle_counter') || 0
        );

        const nextSerialNo =
          Math.max(savedCounter, highestExistingSerial) + 1;

        // CREATE NEW PENDING QUEUE
        const newItem: QueueRecord = {
          id: String(Date.now()),
          ...formData,
          serialNo: nextSerialNo,
          status: 'pending',
          vehicleType:
            selectedVehicleDetails?.vehicleType ||
            'Truck 12 Wheeler 21 Ton',
        };

        currentList.push(newItem);

        localStorage.setItem(
          'tqms_vehicle_counter',
          String(nextSerialNo)
        );
      }

      localStorage.setItem(
        'tqms_live_queues',
        JSON.stringify(currentList)
      );

      reset();
      router.push('/admin/queue');
    } catch (error) {
      console.error('Error saving queue:', error);
      alert('Unable to save queue. Please try again.');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 pb-4 space-y-4">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-base font-bold text-gray-800">
          {editId ? 'Update Queue' : 'Create New Queue'}
        </h1>

        <div className="flex gap-1 mt-1 text-[10px] text-gray-400">
          <span
            className="text-amber-600 cursor-pointer hover:underline"
            onClick={() => router.push('/admin/dashboard')}
          >
            Dashboard
          </span>
          <span>&gt;</span>
          <span
            className="text-amber-600 cursor-pointer hover:underline"
            onClick={() => router.push('/admin/queue')}
          >
            Queue
          </span>
          <span>&gt;</span>
          <span>{editId ? 'Update' : 'New'}</span>
        </div>
      </div>

      {/* MAIN FORM */}
      <form
        onSubmit={handleSubmit(onQueueSubmit)}
        className="bg-white border border-gray-100 rounded-sm shadow-sm p-[18px]"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">
            Checkpoint Entry
          </h2>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#a85d00] hover:bg-[#905000] text-white text-xs px-7 py-2 rounded shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px] items-start">

          {/* LEFT: FORM FIELDS */}
          <div className="space-y-[7px]">

            {/* VEHICLE */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1">
              <label className="text-[11px] text-gray-800">
                Vehicle*
              </label>

              <select
                {...register('vehicleNo')}
                disabled={!!editId}
                className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px] bg-white disabled:bg-gray-100"
              >
                <option value="">Select a vehicle</option>

                {vehicleOptions.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.vehicleNo}>
                    {vehicle.vehicleNo}
                  </option>
                ))}
              </select>

              {errors.vehicleNo && (
                <span className="text-red-500 text-[10px]">
                  {errors.vehicleNo.message}
                </span>
              )}
            </div>

            {/* FROM / TO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  From*
                </label>
                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:border-amber-600 outline-none text-gray-700"
                  {...register('from')}
                >
                  <option value="">Select Start Point...</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Phungling">Phungling</option>
                  <option value="Maiwakhola">Maiwakhola</option>
                </select>
                {errors.from && (
                  <span className="text-red-500 text-[10px]">
                    {errors.from.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  To*
                </label>
                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:border-amber-600 outline-none text-gray-700"
                  {...register('to')}
                >
                  <option value="">Select Destination Point...</option>
                  <option value="Makawanpur">Makawanpur</option>
                  <option value="Sidingba">Sidingba</option>
                  <option value="Meringden">Meringden</option>
                </select>
                {errors.to && (
                  <span className="text-red-500 text-[10px]">
                    {errors.to.message}
                  </span>
                )}
              </div>
            </div>

            {/* GROSS WEIGHT */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1">
              <label className="text-[11px]">
                Gross Weight (Kg)*
              </label>
              <input
                type="number"
                min="0"
                step="any"
                {...register('grossWeight', { valueAsNumber: true })}
                className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px]"
              />
              {errors.grossWeight && (
                <span className="text-red-500 text-[10px]">
                  {errors.grossWeight.message}
                </span>
              )}
            </div>

            {/* DATE / COMPANY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              <div className="flex flex-col gap-1">
                <label className="text-[11px]">Entry Date</label>
                <input
                  readOnly
                  {...register('entryDate')}
                  className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px] bg-gray-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px]">
                  Transport Company Name
                </label>
                <input
                  {...register('companyName')}
                  className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px]"
                />
              </div>
            </div>

            {/* LOAD DETAILS */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1">
              <label className="text-[11px]">Load Details*</label>
              <input
                {...register('loadDetails')}
                className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px]"
              />
            </div>

            {/* NARRATION */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px]">Narration*</label>

              <select
                {...register('narration')}
                className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px] bg-white"
              >
                {narrationOptions.map((option) => (
                  <option key={option.id} value={option.narrationText}>
                    {option.narrationText}
                  </option>
                ))}
              </select>

              {errors.narration && (
                <span className="text-red-500 text-[10px]">
                  {errors.narration.message}
                </span>
              )}
            </div>

            {/* DRIVER PHONE */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px]">Driver's Phone</label>
              <input
                type="tel"
                {...register('driversPhone')}
                className="w-full h-[29px] px-2 border border-gray-300 rounded text-[11px]"
              />
            </div>

            {/* VEHICLE STATUS */}
            <div className="pt-2 space-y-1 text-[11px] text-gray-500">
              <h4 className="font-semibold text-gray-800">
                Vehicle Status
              </h4>

              <div className="flex justify-between">
                <span>Vehicle Type</span>
                <span>
                  {selectedVehicleDetails?.vehicleType || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sthaniya Sangh</span>
                <span>N/A</span>
              </div>

              <div className="flex justify-between">
                <span>Owner Name</span>
                <span>N/A</span>
              </div>

              <div className="flex justify-between">
                <span>Tare Weight (Kg)</span>
                <span>N/A</span>
              </div>

              <div className="flex justify-between">
                <span>Net Weight (Kg)</span>
                <span>N/A</span>
              </div>
            </div>
          </div>

          {/* RIGHT: INVOICE */}
          <div className="min-w-0">
            <div className="border border-gray-300 bg-white text-gray-800 p-[18px] text-[11px]">

              <div className="flex justify-between text-[9px] mb-3">
                <span>lalalal: qawesrtyhgfdsadfgh</span>
                <span>पान नं: 852100017</span>
              </div>

              <div className="text-center mb-4">
                <h2 className="font-bold text-sm">
                  नेपाल ट्रक यातायात व्यवसायी महासंघ
                </h2>
                <p className="text-xs mt-1">Loadboard sthaniya</p>
                <p className="text-[10px] mt-1">
                  फोन नं: 01-9863333, 013-5555555
                </p>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>रसिद नं:</span>
                  <span>{editId || 'New Queue'}</span>
                </div>

                <div className="flex justify-between">
                  <span>मिति:</span>
                  <span>{watch('entryDate') || DEFAULT_ENTRY_DATE}</span>
                </div>

                <div className="flex justify-between">
                  <span>तौलस्थान:</span>
                  <span>lodbod checkpoint</span>
                </div>

                <div className="flex justify-between">
                  <span>समय:</span>
                  <span>2:05 PM</span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-3 space-y-1">
                <div className="flex justify-between">
                  <span>सवारी नं:</span>
                  <span>{watchedVehicleNo || '—'}</span>
                </div>

                <div className="flex justify-between">
                  <span>सामान:</span>
                  <span>{watchedLoadDetails || '—'}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <span>विवरण:</span>
                  <span className="text-right">
                    {watchedNarration || DEFAULT_NARRATION}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>तौल:</span>
                  <span>
                    {Number(watchedGrossWeight || 0).toLocaleString()} Kg
                  </span>
                </div>
              </div>

              {/* FEE TABLE */}
              <div className="mt-4">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="border border-gray-200">
                      <th className="text-left p-2 font-semibold">
                        विवरण
                      </th>
                      <th className="text-left p-2 font-semibold">
                        रकम (रू.)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border border-gray-200">
                      <td className="p-2">काटा शुल्क</td>
                      <td className="p-2">
                        <select
                          value={selectedFee}
                          onChange={(event) =>
                            setSelectedFee(event.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 bg-white text-[11px]"
                        >
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border border-gray-200">
                      <td className="p-2 font-bold">जम्मा शुल्क</td>
                      <td className="p-2 font-bold">
                        {Number(selectedFee).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// MAIN PAGE WITH SUSPENSE
export default function AdminCreateQueuePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-gray-500">
          Loading queue form...
        </div>
      }
    >
      <QueueFormContent />
    </Suspense>
  );
}
