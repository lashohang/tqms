'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ImagePreview from './ImagePreview';
import CustomFileInput from './CustomFileInput';
import type { SavedDocument } from '../types/vehicleOwner';
import { NEPAL_GEOGRAPHY_MAP } from '../constants/geography';
import { z } from 'zod';

import {
  vehicleOwnerSchema,
} from '../schemas/vehicleOwnerSchema';
type VehicleOwnerFormInput = z.input<typeof vehicleOwnerSchema>;
type VehicleOwnerFormOutput = z.output<typeof vehicleOwnerSchema>;

import { saveVehicleOwner } from '../services/vehicleOwnerStorage';

const convertFileToBase64 = (
  file: File | null
): Promise<SavedDocument | null> => {
  if (!file) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve({
          name: file.name,
          type: file.type,
          dataUrl: reader.result,
        });
      } else {
        reject(new Error(`Could not read ${file.name}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`Could not read ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
};

export default function VehicleOwnerForm() {
  const router = useRouter();

  const [citizenshipFront, setCitizenshipFront] = useState<File | null>(null);
  const [citizenshipBack, setCitizenshipBack] = useState<File | null>(null);
  const [registrationDocument, setRegistrationDocument] =
    useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
  VehicleOwnerFormInput,
  any,
  VehicleOwnerFormOutput
>({
  resolver: zodResolver(vehicleOwnerSchema),
    defaultValues: {
      name: '',
      state: '',
      district: '',
      localLevel: '',
      streetAddress: '',
      email: '',
      panNumber: '',
      phoneNo: '',
      isIndividual: true,
      citizenshipNo: '',
      registrationNo: '',
      contactName: '',
      contactEmail: '',
      contactNumber: '',
    },
  });

  const watchedProvince = watch('state');
  const watchedIsIndividual = watch('isIndividual');

  const availableDistricts = useMemo(() => {
    if (!watchedProvince) return [];

    return NEPAL_GEOGRAPHY_MAP[watchedProvince] || [];
  }, [watchedProvince]);

  // =========================================================
  // SAVE VEHICLE OWNER
  // =========================================================

  
const onFormSubmit: SubmitHandler<VehicleOwnerFormOutput> = async (
  formData
) => {
  try {
    // Convert uploaded files into persistent Base64 data.
    const [
      savedCitizenshipFront,
      savedCitizenshipBack,
      savedRegistrationDocument,
      savedCompanyLogo,
    ] = await Promise.all([
      convertFileToBase64(citizenshipFront),
      convertFileToBase64(citizenshipBack),
      convertFileToBase64(registrationDocument),
      convertFileToBase64(companyLogo),
    ]);

    saveVehicleOwner({
      name: formData.name,
      email: formData.email || '',
      address: [
        formData.state,
        formData.district,
        formData.localLevel,
        formData.streetAddress,
      ]
        .filter(Boolean)
        .join(', '),
      phoneNo: formData.phoneNo,
      isAssigned: 'Not Assi',
      state: formData.state,
      district: formData.district,
      localLevel: formData.localLevel || '',
      streetAddress: formData.streetAddress || '',
      panNumber: formData.panNumber || '',
      isIndividual: formData.isIndividual,
      citizenshipNo: formData.citizenshipNo || '',
      registrationNo: formData.registrationNo || '',
      contactName: formData.contactName || '',
      contactEmail: formData.contactEmail || '',
      contactNumber: formData.contactNumber || '',

      // Save uploaded documents
      citizenshipFront: savedCitizenshipFront,
      citizenshipBack: savedCitizenshipBack,
      registrationDocument: savedRegistrationDocument,
      companyLogo: savedCompanyLogo,
    });

    reset();

    setCitizenshipFront(null);
    setCitizenshipBack(null);
    setRegistrationDocument(null);
    setCompanyLogo(null);

    router.push('/admin/vehicle/vehicle-owner');
  } catch (error) {
    console.error('Error saving vehicle owner:', error);

    alert(
      error instanceof Error
        ? error.message
        : 'Unable to save vehicle owner. Please try again.'
    );
  }
};


      

    

  return (
    <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1 select-none">

        <span
          className="text-amber-600 cursor-pointer hover:underline"
          onClick={() => router.push('/admin/vehicle/vehicles')}
        >
          Home
        </span>
        
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-8 bg-white border border-gray-100 rounded-md p-6 md:p-10 shadow-sm"
      >
        {/* SUBSECTION 1: VEHICLE OWNER DETAILS */}

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 select-none">
            Enter Vehicle Owner Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Name */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Name*
              </label>

              <input
                type="text"
                placeholder="Enter Name"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('name')}
              />

              {errors.name && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Company Logo - Only shown when Is Individual is OFF */}

            {!watchedIsIndividual && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Logo*
                </label>

                <div className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm file:cursor-pointer file:bg-gray-300 file:text-gray-800 file:border-0 file:mr-3 file:px-4 file:py-2 hover:file:bg-gray-400">
                  <CustomFileInput
                    label="Logo"
                    onChange={(file) => setCompanyLogo(file)}
                  />
                </div>

                {companyLogo && (
                  <span className="text-[10px] text-gray-500">
                    Selected: {companyLogo.name}
                  </span>
                )}

                <ImagePreview
                  file={companyLogo}
                  title="Logo Preview"
                />
              </div>
            )}

            {/* State */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                State*
              </label>

              <select
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-white cursor-pointer focus:border-amber-600 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('state', {
                  onChange: () => setValue('district', ''),
                })}
              >
                <option value="">Select...</option>

                {Object.keys(NEPAL_GEOGRAPHY_MAP).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              {errors.state && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.state.message}
                </span>
              )}
            </div>

            {/* District */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                District*
              </label>

              <select
                disabled={!watchedProvince}
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-white focus:border-amber-600 ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                } disabled:opacity-60`}
                {...register('district')}
              >
                <option value="">
                  {!watchedProvince
                    ? 'Nothing selected'
                    : 'Select District...'}
                </option>

                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              {errors.district && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.district.message}
                </span>
              )}
            </div>

            {/* Local Level */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Local Level
              </label>

              <input
                type="text"
                placeholder="Enter LocalLevel"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('localLevel')}
              />
            </div>

            {/* Street Address */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Street Address
              </label>

              <input
                type="text"
                placeholder="Enter Street Address"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('streetAddress')}
              />
            </div>

            {/* Email */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email')}
              />

              {errors.email && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* PAN Number */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                PAN Number
              </label>

              <input
                type="text"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('panNumber')}
              />
            </div>

            {/* Phone Number */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Phone Number*
              </label>

              <input
                type="tel"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
                  errors.phoneNo ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('phoneNo')}
              />

              {errors.phoneNo && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.phoneNo.message}
                </span>
              )}
            </div>

            {/* Is Individual Toggle */}

            <div className="flex items-center gap-3 pt-2 md:col-span-2 select-none">
              <span className="text-xs font-bold text-gray-600">
                Is Individual
              </span>

              <button
                type="button"
                onClick={() =>
                  setValue('isIndividual', !watchedIsIndividual)
                }
                className={`w-9 h-5 rounded-full relative transition-colors focus:outline-none cursor-pointer ${
                  watchedIsIndividual ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${
                    watchedIsIndividual ? 'left-[17px]' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SUBSECTION 2: CITIZENSHIP DETAILS */}

        {watchedIsIndividual && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 select-none">
              Enter Citizenship Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Citizenship Number */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Citizenship Number
                </label>

                <input
                  type="text"
                  placeholder="Enter Citizenship Number"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                  {...register('citizenshipNo')}
                />
              </div>

              {/* Citizenship Front Image */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Citizenship Front Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCitizenshipFront(e.target.files?.[0] || null)
                  }
                  className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm file:cursor-pointer file:bg-gray-300 file:text-gray-800 file:border-0 file:mr-3 file:px-4 file:py-2 hover:file:bg-gray-400"
                />

                {citizenshipFront && (
                  <span className="text-[10px] text-gray-500">
                    Selected: {citizenshipFront.name}
                  </span>
                )}

                <ImagePreview
                  file={citizenshipFront}
                  title="Citizenship Front Preview"
                />
              </div>

              {/* Citizenship Back Image */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Citizenship Back Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCitizenshipBack(e.target.files?.[0] || null)
                  }
                  className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm file:cursor-pointer file:bg-gray-300 file:text-gray-800 file:border-0 file:mr-3 file:px-4 file:py-2 hover:file:bg-gray-400"
                />

                {citizenshipBack && (
                  <span className="text-[10px] text-gray-500">
                    Selected: {citizenshipBack.name}
                  </span>
                )}

                <ImagePreview
                  file={citizenshipBack}
                  title="Citizenship Back Preview"
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTACT DETAILS - ONLY WHEN IS INDIVIDUAL IS OFF */}

        {!watchedIsIndividual && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 pb-2">
              Enter Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Name */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Name
                </label>

                <input
                  {...register('contactName')}
                  placeholder="Enter contact person name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs"
                />
              </div>

              {/* Contact Email */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  {...register('contactEmail')}
                  placeholder="Enter contact email"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs"
                />
              </div>

              {/* Contact Number */}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">
                  Contact Number
                </label>

                <input
                  type="tel"
                  {...register('contactNumber')}
                  placeholder="Enter contact number"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBSECTION 3: REGISTRATION DETAILS */}

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 select-none">
            Enter Registration Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Registration Number */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Registration Number
              </label>

              <input
                type="text"
                placeholder="Enter Registration Number"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-amber-600"
                {...register('registrationNo')}
              />
            </div>

            {/* Registration Document */}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600">
                Registration Document
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRegistrationDocument(e.target.files?.[0] || null)
                }
                className="cursor-pointer bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm file:cursor-pointer file:bg-gray-300 file:text-gray-800 file:border-0 file:mr-3 file:px-4 file:py-2 hover:file:bg-gray-400"
              />

              {registrationDocument && (
                <span className="text-[10px] text-gray-500">
                  Selected: {registrationDocument.name}
                </span>
              )}

              <ImagePreview
                file={registrationDocument}
                title="Registration Document Preview"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM FORM ACTION CONTROLS */}

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => router.push('/admin/vehicle/vehicle-owner')}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 transition focus:outline-none cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#b06000] hover:bg-[#905000] text-white text-xs font-bold rounded shadow-sm transition cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}