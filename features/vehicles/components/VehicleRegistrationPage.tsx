
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  vehicleFormSchema,
  VehicleFormInputs,
  VehicleFormData,
} from '../schemas/vehicleFormSchema';

import { VEHICLE_TYPES, PROVINCES } from '../constants/vehicleOptions';

import EmbossedPlateForm from './EmbossedPlateForm';
import ProvincialPlateForm from './ProvincialPlateForm';

interface OwnerOption {
  id: number;
  name: string;
}

interface VehicleRecord {
  id: number;
  plateNo: string;
  lotNo: string;
  vehicleNumber: string;
  vehicleType: string;

  plateVehicleType?: string;
  sthaniyasangh?: string;
  vehicleOwner?: string;
  plateColor?: string;
  plateType?: string;

  state?: string;
  registeredOffice?: string;
  symbolNo?: string;
  embossedVAIC?: string;
  embossedVehicleNumber?: string;
  provincialVehicleNumber?: string;

  engineNumber?: string;
  chassisNumber?: string;
  companyName?: string;
  modelNo?: string;

  [key: string]: any;
}

export default function VehicleRegistrationPage() {
  const router = useRouter();

  const [ownerOptions, setOwnerOptions] = useState<OwnerOption[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Load vehicle owners
  useEffect(() => {
    const savedOwners = localStorage.getItem('tqms_vehicle_owners');

    if (savedOwners) {
      try {
        const parsed = JSON.parse(savedOwners);
        setOwnerOptions(Array.isArray(parsed) ? parsed : []);
      } catch {
        setOwnerOptions([]);
      }
    } else {
      setOwnerOptions([]);
    }
  }, []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormInputs, any, VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      sthaniyasangh: '',
      vehicleOwner: '',
      vehicleType: '',
      plateColor: '',
      engineNumber: '',
      chassisNumber: '',
      companyName: '',
      modelNo: '',
      plateType: '',

      state: '',
      plateVehicleType: '',
      embossedVAIC: '',
      embossedVehicleNumber: '',

      registeredOffice: '',
      lotNumber: '',
      symbolNo: '',
      provincialVehicleNumber: '',
    },
  });

  const watchedPlateType = watch('plateType');

  // Load existing vehicle details when editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedEditId = params.get('editId');

    setEditId(selectedEditId);

    if (!selectedEditId) {
      return;
    }

    try {
      const savedRaw = localStorage.getItem('tqms_vehicles_list');
      const parsed: VehicleRecord[] = savedRaw ? JSON.parse(savedRaw) : [];

      const currentList = Array.isArray(parsed) ? parsed : [];

      const selectedVehicle = currentList.find(
        (vehicle) => String(vehicle.id) === selectedEditId
      );

      if (!selectedVehicle) {
        alert('Vehicle record not found.');
        router.push('/admin/vehicle/vehicles');
        return;
      }

      // Populate form with existing vehicle details
      reset({
        sthaniyasangh: selectedVehicle.sthaniyasangh || '',
        vehicleOwner: selectedVehicle.vehicleOwner || '',
        vehicleType: selectedVehicle.vehicleType || '',
        plateColor: selectedVehicle.plateColor || '',

        engineNumber: selectedVehicle.engineNumber || '',
        chassisNumber: selectedVehicle.chassisNumber || '',
        companyName: selectedVehicle.companyName || '',
        modelNo: selectedVehicle.modelNo || '',

        plateType: selectedVehicle.plateType || '',

        state: selectedVehicle.state || '',
        plateVehicleType: selectedVehicle.plateVehicleType || '',

        embossedVAIC: selectedVehicle.embossedVAIC || '',
        embossedVehicleNumber:
          selectedVehicle.embossedVehicleNumber || '',

        registeredOffice: selectedVehicle.registeredOffice || '',

        lotNumber:
          selectedVehicle.lotNumber ||
          selectedVehicle.lotNo ||
          '',

        symbolNo: selectedVehicle.symbolNo || '',

        provincialVehicleNumber:
          selectedVehicle.provincialVehicleNumber || '',
      });
    } catch (error) {
      console.error('Error loading vehicle details:', error);
      alert('Unable to load vehicle details.');
      router.push('/admin/vehicle/vehicles');
    }
  }, [reset, router]);

  // Generate formatted plate number
  const getFormattedNumber = (data: VehicleFormData): string => {
    const province = PROVINCES.find(
      (p) => p.value === data.state
    );

    if (data.plateType === 'Provincial') {
      return `${province?.short || ''}-${data.registeredOffice || ''}-${data.lotNumber || ''}-${data.symbolNo || ''}-${data.provincialVehicleNumber || ''}`;
    }

    if (data.plateType === 'Embossed') {
      return `State-${province?.code || ''}-${data.embossedVehicleNumber || ''}`;
    }

    return `BA-96-GHA-${data.modelNo || '1010'}`;
  };

  // Save new vehicle or update existing vehicle
  const onVehicleFormSubmit: SubmitHandler<VehicleFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const savedRaw = localStorage.getItem('tqms_vehicles_list');

    let currentList: VehicleRecord[] = [];

    try {
      const parsed = savedRaw ? JSON.parse(savedRaw) : [];
      currentList = Array.isArray(parsed) ? parsed : [];
    } catch {
      currentList = [];
    }

    const formattedNumber = getFormattedNumber(data);

    // Find existing vehicle when editing
    const existingVehicle = editId
      ? currentList.find(
          (vehicle) => String(vehicle.id) === editId
        )
      : undefined;

    if (editId && !existingVehicle) {
      alert('Vehicle record not found. Please return to the vehicle list.');
      router.push('/admin/vehicle/vehicles');
      return;
    }

    // Generate ID only when creating a new vehicle
    const nextId =
      currentList.length > 0
        ? Math.max(
            ...currentList.map((vehicle) => Number(vehicle.id) || 0)
          ) + 1
        : 1;

    const vehicleRecord: VehicleRecord = {
      // Preserve existing data when updating
      ...(existingVehicle || {}),

      id: editId ? Number(editId) : nextId,

      plateNo: formattedNumber,

      // Embossed vehicles do not have a Lot Number
      lotNo:
        data.plateType === 'Embossed'
          ? ''
          : data.lotNumber ||
            (data.modelNo
              ? String(data.modelNo).slice(0, 2)
              : '96'),

      vehicleNumber:
        data.provincialVehicleNumber ||
        data.embossedVehicleNumber ||
        data.modelNo ||
        '1010',

      vehicleType: data.vehicleType,
      plateVehicleType: data.plateVehicleType || '',

      sthaniyasangh: data.sthaniyasangh,
      vehicleOwner: data.vehicleOwner,
      plateColor: data.plateColor,
      plateType: data.plateType,

      state: data.state || '',
      registeredOffice: data.registeredOffice || '',
      symbolNo: data.symbolNo || '',

      embossedVAIC: data.embossedVAIC || '',
      embossedVehicleNumber: data.embossedVehicleNumber || '',

      provincialVehicleNumber:
        data.provincialVehicleNumber || '',

      engineNumber: data.engineNumber || '',
      chassisNumber: data.chassisNumber || '',
      companyName: data.companyName || '',
      modelNo: data.modelNo || '',
    };

    let updatedList: VehicleRecord[];

    if (editId) {
      // UPDATE: Replace existing vehicle instead of adding a duplicate
      updatedList = currentList.map((vehicle) =>
        String(vehicle.id) === editId
          ? vehicleRecord
          : vehicle
      );
    } else {
      // CREATE: Add new vehicle
      updatedList = [...currentList, vehicleRecord];
    }

    localStorage.setItem(
      'tqms_vehicles_list',
      JSON.stringify(updatedList)
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

        <span className="text-gray-400 font-normal">
          {editId ? 'Edit' : 'New'}
        </span>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">

        <div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight select-none">
            {editId ? 'Edit Vehicle' : 'Vehicle'}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onVehicleFormSubmit)}
          className="space-y-5"
        >

          {/* Sthaniyasangh */}
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
              <span className="text-[11px] text-red-500">
                {errors.sthaniyasangh.message}
              </span>
            )}
          </div>

          {/* Owner, Vehicle Type, Plate Color */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Vehicle Owner*
              </label>

              <select
                {...register('vehicleOwner')}
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.vehicleOwner
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
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
                {...register('vehicleType')}
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.vehicleType
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
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
                {...register('plateColor')}
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.plateColor
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
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

          {/* Engine, Chassis, Company */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Engine Number
              </label>

              <input
                type="text"
                placeholder="Enter Engine Number"
                {...register('engineNumber')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Chassis Number
              </label>

              <input
                type="text"
                placeholder="Enter Chassis No."
                {...register('chassisNumber')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Company Name
              </label>

              <input
                type="text"
                placeholder="Enter Company Name"
                {...register('companyName')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Model Number and Plate Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Model No.
              </label>

              <input
                type="text"
                placeholder="Enter Model No."
                {...register('modelNo')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Plate Type*
              </label>

              <select
                {...register('plateType')}
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-[#F0F2F5]/40 text-gray-600 font-medium cursor-pointer ${
                  errors.plateType
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select...</option>
                <option value="Embossed">Embossed</option>
                <option value="Provincial">Provincial</option>
                <option value="Zonal">Zonal</option>
              </select>

              {errors.plateType && (
                <span className="text-[11px] text-red-500">
                  {errors.plateType.message}
                </span>
              )}
            </div>
          </div>

          {/* Conditional Plate Forms */}
          {watchedPlateType === 'Embossed' && (
            <EmbossedPlateForm
              register={register}
              watch={watch}
              errors={errors}
            />
          )}

          {watchedPlateType === 'Provincial' && (
            <ProvincialPlateForm
              register={register}
              watch={watch}
              errors={errors}
            />
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
              {isSubmitting
                ? 'Saving...'
                : editId
                  ? 'Update'
                  : 'Save'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
