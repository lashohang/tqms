
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useForm,
  SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// ============================================================
// IMAGE PREVIEW COMPONENT
// ============================================================

const ImagePreview = ({
  file,
  title,
}: {
  file: File | null;
  title: string;
}) => {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [file]);

  if (!file) return null;

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-xs font-bold text-gray-600">
        {title}
      </h4>

      {preview && (
        <img
          src={preview}
          alt={title}
          className="w-32 h-28 object-contain border border-gray-300 rounded-md bg-white p-1"
        />
      )}

      <p className="text-[10px] text-gray-500">
        {file.name}
      </p>
    </div>
  );
};

// ============================================================
// CUSTOM FILE INPUT COMPONENT
// ============================================================

const CustomFileInput = ({
  label,
  onChange,
}: {
  label: string;
  onChange: (file: File | null) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
    onChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        aria-label={label}
        onChange={handleChange}
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
      />

      {selectedFile && (
        <span className="text-[10px] text-gray-500">
          Selected: {selectedFile.name}
        </span>
      )}
    </div>
  );
};

// ============================================================
// NEPAL GEOGRAPHY MAP
// ============================================================

const NEPAL_GEOGRAPHY_MAP: Record<string, string[]> = {
  'Koshi Province': [
    'Bhojpur',
    'Dhankuta',
    'Ilam',
    'Jhapa',
    'Khotang',
    'Morang',
    'Okhaldhunga',
    'Panchthar',
    'Sankhuwasabha',
    'Solukhumbu',
    'Sunsari',
    'Taplejung',
    'Terhathum',
    'Udayapur',
  ],

  'Madhesh Province': [
    'Bara',
    'Dhanusha',
    'Mahottari',
    'Parsa',
    'Rautahat',
    'Saptari',
    'Sarlahi',
    'Siraha',
  ],

  'Bagmati Province': [
    'Bhaktapur',
    'Chitwan',
    'Dhading',
    'Dolakha',
    'Kathmandu',
    'Kavrepalanchok',
    'Lalitpur',
    'Makwanpur',
    'Nuwakot',
    'Ramechhap',
    'Rasuwa',
    'Sindhuli',
    'Sindhupalchok',
  ],

  'Gandaki Province': [
    'Baglung',
    'Gorkha',
    'Kaski',
    'Lamjung',
    'Manang',
    'Mustang',
    'Myagdi',
    'Nawalpur',
    'Parbat',
    'Syangja',
    'Tanahun',
  ],

  'Lumbini Province': [
    'Arghakhanchi',
    'Banke',
    'Bardiya',
    'Dang',
    'Gulmi',
    'Kapilvastu',
    'Parasi',
    'Palpa',
    'Pyuthan',
    'Rolpa',
    'Rukum East',
    'Rupandehi',
  ],

  'Karnali Province': [
    'Dailekh',
    'Dolpa',
    'Humla',
    'Jajarkot',
    'Jumla',
    'Kalikot',
    'Mugu',
    'Salyan',
    'Surkhet',
    'Rukum West',
  ],

  'Sudurpashchim Province': [
    'Achham',
    'Baitadi',
    'Bajhang',
    'Bajura',
    'Dadeldhura',
    'Darchula',
    'Doti',
    'Kailali',
    'Kanchanpur',
  ],
};

// ============================================================
// FORM SCHEMA
// ============================================================

const ownerSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  state: z.string().min(1, 'State selection is required'),

  district: z.string().min(1, 'District selection is required'),

  localLevel: z.string().optional(),

  streetAddress: z.string().optional(),

  email: z
    .string()
    .email('Invalid email address format')
    .or(z.literal('')),

  panNumber: z.string().optional(),

  phoneNo: z
    .string()
    .min(10, 'Phone Number must be at least 10 digits'),

  isIndividual: z.boolean().default(true),

  citizenshipNo: z.string().optional(),

  registrationNo: z.string().optional(),

  contactName: z.string().optional(),

  contactEmail: z.string().optional(),

  contactNumber: z.string().optional(),
});

type OwnerFormInputs = z.infer<typeof ownerSchema>;

// ============================================================
// VEHICLE OWNER TYPE
// ============================================================

interface VehicleOwner {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNo: string;
  isAssigned: 'Assigned' | 'Not Assi';

  state?: string;
  district?: string;
  localLevel?: string;
  streetAddress?: string;
  panNumber?: string;

  isIndividual?: boolean;

  citizenshipNo?: string;
  registrationNo?: string;

  contactName?: string;
  contactEmail?: string;
  contactNumber?: string;
}

// ============================================================
// MAIN VEHICLE OWNER PAGE
// ============================================================

export default function VehicleRegistrationPage() {
  const router = useRouter();

  // ----------------------------------------------------------
  // FILE STATES
  // ----------------------------------------------------------

  const [citizenshipFront, setCitizenshipFront] =
    useState<File | null>(null);

  const [citizenshipBack, setCitizenshipBack] =
    useState<File | null>(null);

  const [registrationDocument, setRegistrationDocument] =
    useState<File | null>(null);

  const [companyLogo, setCompanyLogo] =
    useState<File | null>(null);

  // ----------------------------------------------------------
  // FORM CONFIGURATION
  // ----------------------------------------------------------

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<OwnerFormInputs>({
    resolver: zodResolver(ownerSchema),

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

  // ----------------------------------------------------------
  // WATCHED VALUES
  // ----------------------------------------------------------

  const watchedProvince = watch('state');

  const watchedIsIndividual = watch('isIndividual');

  // ----------------------------------------------------------
  // DISTRICT FILTERING
  // ----------------------------------------------------------

  const availableDistricts = useMemo(() => {
    if (!watchedProvince) return [];

    return NEPAL_GEOGRAPHY_MAP[watchedProvince] || [];
  }, [watchedProvince]);

  // ----------------------------------------------------------
  // SAVE VEHICLE OWNER
  // ----------------------------------------------------------

  const onFormSubmit: SubmitHandler<OwnerFormInputs> = async (
    formData
  ) => {
    try {
      const savedRaw = localStorage.getItem(
        'tqms_vehicle_owners'
      );

      let currentList: VehicleOwner[] = [];

      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);

        if (Array.isArray(parsed)) {
          currentList = parsed;
        }
      }

      const nextId =
        currentList.length > 0
          ? Math.max(
              ...currentList.map((u) => Number(u.id) || 0)
            ) + 1
          : 1;

      const newOwner: VehicleOwner = {
        id: nextId,

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
      };

      localStorage.setItem(
        'tqms_vehicle_owners',
        JSON.stringify([...currentList, newOwner])
      );

      reset();

      setCitizenshipFront(null);
      setCitizenshipBack(null);
      setRegistrationDocument(null);
      setCompanyLogo(null);

      router.push('/admin/vehicle/vehicle-owner');

    } catch (error) {
      console.error('Error saving vehicle owner:', error);

      alert(
        'Unable to save vehicle owner. Please try again.'
      );
    }
  };

  // ==========================================================
  // PAGE JSX
  // ==========================================================

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-200 text-gray-700 font-sans antialiased">

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-8 bg-white border border-gray-100 rounded-md p-6 md:p-10 shadow-sm"
      >

        {/* ==================================================
            SUBSECTION 1: VEHICLE OWNER DETAILS
        ================================================== */}

        <div className="space-y-4">

          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 select-none">
            Enter Vehicle Owner Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            {/* NAME */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold text-gray-600">
                Name*
              </label>

              <input
                type="text"
                placeholder="Enter Name"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
                  errors.name
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('name')}
              />

              {errors.name && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.name.message}
                </span>
              )}

            </div>

            {/* COMPANY LOGO */}

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

            {/* STATE */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold text-gray-600">
                State*
              </label>

              <select
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-white cursor-pointer focus:border-amber-600 ${
                  errors.state
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('state', {
                  onChange: () => setValue('district', ''),
                })}
              >

                <option value="">
                  Select...
                </option>

                {Object.keys(NEPAL_GEOGRAPHY_MAP).map(
                  (province) => (
                    <option
                      key={province}
                      value={province}
                    >
                      {province}
                    </option>
                  )
                )}

              </select>

              {errors.state && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.state.message}
                </span>
              )}

            </div>

            {/* DISTRICT */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold text-gray-600">
                District*
              </label>

              <select
                disabled={!watchedProvince}
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none bg-white focus:border-amber-600 ${
                  errors.district
                    ? 'border-red-500'
                    : 'border-gray-300'
                } disabled:opacity-60`}
                {...register('district')}
              >

                <option value="">
                  {!watchedProvince
                    ? 'Nothing selected'
                    : 'Select District...'}
                </option>

                {availableDistricts.map((district) => (
                  <option
                    key={district}
                    value={district}
                  >
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

            {/* LOCAL LEVEL */}

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

            {/* STREET ADDRESS */}

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

            {/* EMAIL */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold text-gray-600">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('email')}
              />

              {errors.email && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.email.message}
                </span>
              )}

            </div>

            {/* PAN NUMBER */}

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

            {/* PHONE NUMBER */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold text-gray-600">
                Phone Number*
              </label>

              <input
                type="tel"
                className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
                  errors.phoneNo
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                {...register('phoneNo')}
              />

              {errors.phoneNo && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.phoneNo.message}
                </span>
              )}

            </div>

            {/* IS INDIVIDUAL TOGGLE */}

            <div className="flex items-center gap-3 pt-2 md:col-span-2 select-none">

              <span className="text-xs font-bold text-gray-600">
                Is Individual
              </span>

              <button
                type="button"
                onClick={() =>
                  setValue(
                    'isIndividual',
                    !watchedIsIndividual,
                    { shouldValidate: true }
                  )
                }
                className={`w-9 h-5 rounded-full relative transition-colors focus:outline-none cursor-pointer ${
                  watchedIsIndividual
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              >

                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-sm ${
                    watchedIsIndividual
                      ? 'left-[17px]'
                      : 'left-1'
                  }`}
                />

              </button>

            </div>

          </div>
        </div>

        {/* ==================================================
            SUBSECTION 2: CITIZENSHIP DETAILS
        ================================================== */}

        {watchedIsIndividual && (
          <div className="space-y-4">

            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 select-none">
              Enter Citizenship Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

              {/* CITIZENSHIP NUMBER */}

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

              {/* CITIZENSHIP FRONT IMAGE */}

              <div className="flex flex-col gap-1.5">

                <label className="text-xs font-bold text-gray-600">
                  Citizenship Front Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCitizenshipFront(
                      e.target.files?.[0] || null
                    )
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

              {/* CITIZENSHIP BACK IMAGE */}

              <div className="flex flex-col gap-1.5">

                <label className="text-xs font-bold text-gray-600">
                  Citizenship Back Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCitizenshipBack(
                      e.target.files?.[0] || null
                    )
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

        {/* ==================================================
            CONTACT DETAILS - COMPANY
        ================================================== */}

        {!watchedIsIndividual && (
          <div className="space-y-4">

            <h3 className="text-sm font-bold text-gray-700 pb-2">
              Enter Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* CONTACT NAME */}

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

              {/* CONTACT EMAIL */}

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

              {/* CONTACT NUMBER */}

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

        {/* ==================================================
            SUBSECTION 3: REGISTRATION DETAILS
        ================================================== */}

        <div className="space-y-4">

          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 select-none">
            Enter Registration Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            {/* REGISTRATION NUMBER */}

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

            {/* REGISTRATION DOCUMENT */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold text-gray-600">
                Registration Document
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRegistrationDocument(
                    e.target.files?.[0] || null
                  )
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

        {/* ==================================================
            FORM ACTION BUTTONS
        ================================================== */}

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">

          <button
            type="button"
            onClick={() =>
              router.push('/admin/vehicle/vehicle-owner')
            }
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
