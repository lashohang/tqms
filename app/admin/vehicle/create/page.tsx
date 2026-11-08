
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface OwnerOption {
  id: number;
  name: string;
}

// =========================================================================
// VALIDATION SCHEMA
// =========================================================================
const vehicleFormSchema = z.object({
  sthaniyasangh: z.string().min(1, 'Sthaniyasangh is required'),
  vehicleOwner: z.string().min(1, 'Vehicle Owner selection is required'),
  vehicleType: z.string().min(1, 'Vehicle Type selection is required'),
  plateColor: z.string().min(1, 'Plate Color selection is required'),
  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  companyName: z.string().optional(),
  modelNo: z.string().optional(),
  plateType: z.string().min(1, 'Plate Type selection is required'),
  state: z.string().optional(),
plateVehicleType: z.string().optional(),
embossedVAIC: z.string().optional(),
embossedVehicleNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.plateType === 'Embossed') {
    if (!data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['state'],
        message: 'State is required',
      });
    }

    if (!data.plateVehicleType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['plateVehicleType'],
        message: 'Vehicle Type is required',
      });
    }

    if (!data.embossedVAIC?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['embossedVAIC'],
        message: 'Embossed VAIC is required',
      });
    }

    if (!/^\d{4}$/.test(data.embossedVehicleNumber || '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['embossedVehicleNumber'],
        message: 'Vehicle Number must contain exactly 4 digits',
      });
    }
  }
});

type VehicleFormInputs = z.infer<typeof vehicleFormSchema>;

export default function AdminAddNewVehiclePage() {
  const router = useRouter();

  const [ownerOptions, setOwnerOptions] = useState<OwnerOption[]>([]);

  // Load registered vehicle owners
  useEffect(() => {
    const savedOwners = localStorage.getItem('tqms_vehicle_owners');

    if (savedOwners) {
      try {
        const parsedOwners: OwnerOption[] = JSON.parse(savedOwners);
        setOwnerOptions(Array.isArray(parsedOwners) ? parsedOwners : []);
      } catch {
        setOwnerOptions([]);
      }
    } else {
      setOwnerOptions([]);
    }
  }, []);
  const PROVINCE_CODES: Record<string, string> = {
  Koshi: '1',
  Madhesh: '2',
  Bagmati: '3',
  Gandaki: '4',
  Lumbini: '5',
  Karnali: '6',
  Sudurpashchim: '7',
};
  const {
  register,
  handleSubmit,
  reset,
  watch,
  formState: { errors, isSubmitting },
} = useForm<VehicleFormInputs>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      embossedVAIC: '',
      embossedVehicleNumber: '',
      state: '',
      plateVehicleType: '',
      sthaniyasangh: '',
      vehicleOwner: '',
      vehicleType: '',
      plateColor: '',
      engineNumber: '',
      chassisNumber: '',
      companyName: '',
      modelNo: '',
      plateType: '',
    },
  })
  ;
  const watchedPlateVehicleType = watch('plateVehicleType');
const watchedEmbossedVAIC = watch('embossedVAIC');
  const VEHICLE_TYPES = [
  { value: 'mini truck 6 wheler 4 ton', label: 'Mini Truck 6 Wheeler 4 Ton' },
  { value: 'Mini Truck Type', label: 'Mini Truck Type' },
  { value: 'Truck 12 chakke 21 ton', label: 'Truck 12 Chakke 21 Ton' },
  { value: 'Trailer 14 wheeler 27 Ton', label: 'Trailer 14 Wheeler 27 Ton' },
  { value: 'Medium Truck', label: 'Medium Truck' },
];
  const watchedPlateType = watch('plateType');
const watchedState = watch('state');
const watchedEmbossedVehicleNumber = watch('embossedVehicleNumber');

const formattedNumber =
  watchedState && watchedEmbossedVehicleNumber
    ? `State-${PROVINCE_CODES[watchedState] || ''}-${watchedEmbossedVehicleNumber}`
    : watchedState
      ? `State-${PROVINCE_CODES[watchedState] || ''}-`
      : 'State---';

const isEmbossedNumberComplete =
  !!watchedState &&
  !!watchedPlateVehicleType &&
  !!watchedEmbossedVAIC?.trim() &&
  /^\d{4}$/.test(watchedEmbossedVehicleNumber || '');

  const onVehicleFormSubmit: SubmitHandler<VehicleFormInputs> = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const savedRaw = localStorage.getItem('tqms_vehicles_list');

    let currentList = [];

    try {
      currentList = savedRaw ? JSON.parse(savedRaw) : [];
      if (!Array.isArray(currentList)) currentList = [];
    } catch {
      currentList = [];
    }

    const nextId =
      currentList.length > 0
        ? Math.max(...currentList.map((v: { id: number }) => v.id)) + 1
        : 1;

    const newVehicleRecord = {
      id: nextId,
      plateNo: `BA-96-GHA-${formData.modelNo || '1010'}`,
      lotNo: formData.modelNo
        ? String(formData.modelNo).slice(0, 2)
        : '96',
      vehicleNumber: formData.modelNo || '1010',
      vehicleType: formData.vehicleType,
    };

    localStorage.setItem(
      'tqms_vehicles_list',
      JSON.stringify([...currentList, newVehicleRecord])
    );

    reset();
    router.push('/admin/vehicle/vehicles');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 p-2 animate-in fade-in duration-200 text-gray-700 font-sans">

      {/* Breadcrumb Navigation */}
      <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 select-none">
        <span
          className="text-amber-600 cursor-pointer hover:underline"
          onClick={() => router.push('/admin/vehicle/vehicles')}
        >
          Home
        </span>

        <span>&gt;</span>

        <span
          className="text-amber-600 cursor-pointer hover:underline"
          onClick={() => router.push('/admin/vehicle/vehicles')}
        >
          Vehicle
        </span>

        <span>&gt;</span>

        <span className="text-gray-400 font-normal">New</span>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">

        <div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight select-none">
            Vehicle
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onVehicleFormSubmit)}
          className="space-y-5"
        >

          {/* Row 1: Sthaniyasangh */}
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="text-xs font-bold text-gray-600">
              Sthaniyasangh*
            </label>

            <input
              type="text"
              className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 transition ${
                errors.sthaniyasangh
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              {...register('sthaniyasangh')}
            />

            {errors.sthaniyasangh && (
              <span className="text-[11px] text-red-500 font-medium">
                {errors.sthaniyasangh.message}
              </span>
            )}
          </div>

          {/* Row 2: Vehicle Owner, Vehicle Type, Plate Color */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Vehicle Owner*
              </label>

              <select
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.vehicleOwner
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('vehicleOwner')}
              >
                <option value="">
                  {ownerOptions.length === 0
                    ? 'No vehicle owners available'
                    : 'Select...'}
                </option>

                {ownerOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>

              {ownerOptions.length === 0 && (
                <span className="text-[10px] text-gray-400">
                  Please add a vehicle owner first.
                </span>
              )}

              {errors.vehicleOwner && (
                <span className="text-[11px] text-red-500">
                  {errors.vehicleOwner.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Vehicle Type*
              </label>

              <select
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.vehicleType
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('vehicleType')}
              >
               <option value="">Select...</option>
{VEHICLE_TYPES.map((type) => (
  <option key={type.value} value={type.value}>
    {type.label}
  </option>
))}
              </select>

              {errors.vehicleType && (
                <span className="text-[11px] text-red-500">
                  {errors.vehicleType.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Plate Color*
              </label>

              <select
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.plateColor
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('plateColor')}
              >
                <option value="">Select...</option>
                <option value="Red">Red</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
              </select>

              {errors.plateColor && (
                <span className="text-[11px] text-red-500">
                  {errors.plateColor.message}
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Engine Number, Chassis Number, Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Engine Number
              </label>

              <input
                type="text"
                placeholder="Enter Engine Number"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('engineNumber')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Chassis Number
              </label>

              <input
                type="text"
                placeholder="Enter Chassis No."
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('chassisNumber')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Company Name
              </label>

              <input
                type="text"
                placeholder="Enter Company Name"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('companyName')}
              />
            </div>
          </div>

          {/* Row 4: Model Number and Plate Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Model No.
              </label>

              <input
                type="text"
                placeholder="Enter Model No."
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('modelNo')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Plate Type*
              </label>

              <select
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.plateType
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('plateType')}
              >
                <option value="">Select...</option>
                <option value="Embossed">Embossed</option>
                <option value="Standard">Provincial</option>
                <option value="Standard">Zonal</option>
              </select>

              {errors.plateType && (
                <span className="text-[11px] text-red-500">
                  {errors.plateType.message}
                </span>
              )}
            </div>
          </div>
              {/* Embossed Plate Number Details */}
{watchedPlateType === 'Embossed' && (
  <div className="space-y-5 pt-4 border-t border-gray-200">

    <h3 className="text-sm font-bold text-gray-800">
      Enter Plate Number Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* State */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-600">
          State*
        </label>

        <select
          {...register('state')}
          className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
            errors.state ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select State...</option>
          <option value="Koshi">Koshi Province 1</option>
          <option value="Madhesh">Madhesh Province 2</option>
          <option value="Bagmati">Bagmati Province 3</option>
          <option value="Gandaki">Gandaki Province 4</option>
          <option value="Lumbini">Lumbini Province 5</option>
          <option value="Karnali">Karnali Province 6</option>
          <option value="Sudurpashchim">Sudurpashchim Province 7</option>
        </select>
      </div>

      {/* Vehicle Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-600">
          Vehicle Type*
        </label>

        <select
          {...register('plateVehicleType')}
          className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
            errors.plateVehicleType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select...</option>
{VEHICLE_TYPES.map((type) => (
  <option key={type.value} value={type.value}>
    {type.label}
  </option>
))}
        </select>
      </div>
{/* Embossed VAIC, Vehicle Number and Formatted Number */}

    </div>
    <div className="grid grid-cols-6 md:grid-cols-3 gap-6">

  {/* Embossed VAIC */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-600">
      Embossed VAIC*
    </label>

    <input
  type="text"
  placeholder="Enter Embossed VAIC"
  {...register('embossedVAIC', {
    setValueAs: (value) => String(value ?? ''),
  })}
  className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
    errors.embossedVAIC ? 'border-red-500' : 'border-gray-300'
  }`}
/>

    {errors.embossedVAIC && (
      <span className="text-[11px] text-red-500">
        {errors.embossedVAIC.message}
      </span>
    )}
  </div>

  {/* Vehicle Number */}
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-600">
      Vehicle Number*
    </label>

    <input
  type="text"
  inputMode="numeric"
  maxLength={4}
  placeholder="Enter 4 digit number"
  {...register('embossedVehicleNumber', {
    setValueAs: (value) =>
      String(value ?? '').replace(/\D/g, '').slice(0, 4),
  })}
  className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
    errors.embossedVehicleNumber
      ? 'border-red-500'
      : 'border-gray-300'
  }`}
/>

    {errors.embossedVehicleNumber && (
      <span className="text-[11px] text-red-500">
        {errors.embossedVehicleNumber.message}
      </span>
    )}
  </div>

  {/* Formatted Number */}
  {/* Formatted Number */}
<div className="flex flex-col gap-1.5">
  <label className="text-xs font-bold text-gray-600">
    Formatted Number
  </label>

  <div
    className={`w-full flex items-center justify-between px-3 py-1.5 border rounded text-xs font-semibold transition-all ${
      isEmbossedNumberComplete
        ? 'bg-green-50 border-green-500 text-green-700'
        : 'bg-gray-100 border-gray-300 text-gray-500'
    }`}
  >
    <span>{formattedNumber}</span>

    {isEmbossedNumberComplete && (
      <span className="text-green-600 font-bold text-sm">
        ✓
      </span>
    )}
  </div>
</div>

</div>
  </div>
)}
          {/* Action Row */}
          <div className="flex items-center justify-end gap-5 pt-4 mt-4 select-none">

            <button
              type="button"
              onClick={() => {
                reset();
                router.push('/admin/vehicle/vehicles');
              }}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition cursor-pointer focus:outline-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-1.5 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-semibold rounded shadow-sm cursor-pointer transition focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
