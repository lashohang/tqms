'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// =========================================================================
// NEPAL GEOGRAPHY CORRESPONDENCE REGISTRY DATA MAP
// =========================================================================
const NEPAL_GEOGRAPHY_MAP: Record<string, string[]> = {
  'Koshi Province': [
    'Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga',
    'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'
  ],
  'Madhesh Province': [
    'Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'
  ],
  'Bagmati Province': [
    'Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 
    'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'
  ],
  'Gandaki Province': [
    'Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 
    'Nawalpur', 'Parbat', 'Syangja', 'Tanahun'
  ],
  'Lumbini Province': [
    'Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Parasi',
    'Palpa', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'
  ],
  'Karnali Province': [
    'Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Salyan', 'Surkhet', 'Rukum West'
  ],
  'Sudurpashchim Province': [
    'Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur'
  ]
};

// =========================================================================
// STRUCTURED SCHEMA VALIDATION OBJECT DEFINITIONS
// =========================================================================
const staffSchema = z.object({
  staffName: z.string().min(1, 'Staff Name is required'),
  state: z.string().min(1, 'State selection is required'),
  district: z.string().min(1, 'District selection is required'),
  streetAddress: z.string().optional(),
  mobileNumber: z.string().min(10, 'Mobile Number must be at least 10 digits'),
  email: z.string().email('Invalid email address format'),
});

type StaffFormInputs = z.infer<typeof staffSchema>;

export default function AdminAddUserPage() {
  const router = useRouter();

  // 1. Initializing React Hook Form integrated with Zod validation rules
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormInputs>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      staffName: '',
      state: '',
      district: '',
      streetAddress: '',
      mobileNumber: '',
      email: '',
    }
  });

  // 2. Watch active state changes on the Province selector to handle dynamic cascading triggers
  const watchedProvince = watch('state');

  const availableDistricts = useMemo(() => {
    if (!watchedProvince) return [];
    return NEPAL_GEOGRAPHY_MAP[watchedProvince] || [];
  }, [watchedProvince]);

  const onStaffSubmit: SubmitHandler<StaffFormInputs> = async (formData) => {
    // Introduce latency to test operational loading spinners
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Read list metadata state metrics from client storage
    const currentUsersRaw = localStorage.getItem('tqms_users');
    const currentUsers = currentUsersRaw ? JSON.parse(currentUsersRaw) : [];

    // Calculate sequential identification SN marker bounds
    const nextId = currentUsers.length > 0 ? Math.max(...currentUsers.map((u: any) => u.id)) + 1 : 1;
    
    const newUser = {
      id: nextId,
      name: formData.staffName,
      address: formData.streetAddress ? `${formData.streetAddress}, ${formData.district}` : `${formData.district}, ${formData.state}`,
      contact: formData.mobileNumber,
      status: false 
    };

    // Commit modified entity elements array globally and push router window backwards
    localStorage.setItem('tqms_users', JSON.stringify([...currentUsers, newUser]));
    reset();
    router.push('/admin/checkpoints/check-user');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb Row Indicators */}
      <div className="text-xs text-amber-700 font-medium flex items-center gap-1 select-none pt-2">
        <span className="hover:underline cursor-pointer" onClick={() => router.push('/admin/checkpoints/check-user')}>Checkpoint User</span>
        <span>&gt;</span>
        <span className="text-gray-400 cursor-pointer hover:underline" onClick={() => router.push('/admin/checkpoints/check-user')}>User</span>
        <span>&gt;</span>
        <span className="text-gray-400 font-normal">New</span>
      </div>

      {/* Main Core Form Card Wrapper Frame */}
      <div className="bg-white rounded border border-gray-100 shadow-sm p-6 md:p-10 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">CheckPoint Staff</h2>
        </div>
        
        <form onSubmit={handleSubmit(onStaffSubmit)} className="space-y-6">
          
          {/* Form Fields Grid - Arranged into three balanced columns on desktop views */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            
            {/* Input Field 1: Staff Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Staff Name*</label>
              <input 
                type="text" 
                placeholder="Enter Name" 
                className={`w-full px-3 py-2 border rounded outline-none text-sm text-gray-700 transition ${
                  errors.staffName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-amber-600'
                }`}
                {...register('staffName')}
              />
              {errors.staffName && <span className="text-xs text-red-500 font-medium">{errors.staffName.message}</span>}
            </div>

            {/* Input Field 2: State Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">State*</label>
              <select 
                className={`w-full px-3 py-2 border rounded bg-slate-50/50 text-gray-600 outline-none text-sm transition cursor-pointer ${
                  errors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-amber-600'
                }`}
                {...register('state', {
                  onChange: () => setValue('district', '') // Wipe selected district safely if user jumps provinces
                })}
              >
                <option value="">Select...</option>
                {Object.keys(NEPAL_GEOGRAPHY_MAP).map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              {errors.state && <span className="text-xs text-red-500 font-medium">{errors.state.message}</span>}
            </div>

            {/* Input Field 3: Cascading District Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">District*</label>
              <select 
                disabled={!watchedProvince}
                className={`w-full px-3 py-2 border rounded bg-slate-50/50 text-gray-600 outline-none text-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.district ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-amber-600'
                }`}
                {...register('district')}
              >
                <option value="">
                  {!watchedProvince ? 'Nothing selected' : 'Select District...'}
                </option>
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <span className="text-xs text-red-500 font-medium">{errors.district.message}</span>}
            </div>

            {/* Input Field 4: Street Address */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Street Address</label>
              <input 
                type="text" 
                placeholder="Enter Street Address" 
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-sm text-gray-700 focus:border-amber-600 transition"
                {...register('streetAddress')}
              />
            </div>

            {/* Input Field 5: Mobile Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Mobile Number*</label>
              <input 
                type="tel" 
                placeholder="Enter Mobile Number" 
                className={`w-full px-3 py-2 border rounded outline-none text-sm text-gray-700 transition ${
                  errors.mobileNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-amber-600'
                }`}
                {...register('mobileNumber')}
              />
              {errors.mobileNumber && <span className="text-xs text-red-500 font-medium">{errors.mobileNumber.message}</span>}
            </div>

            {/* Input Field 6: Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Email*</label>
              <input 
                type="email" 
                placeholder="Enter Email"
                className={`w-full px-3 py-2 border rounded outline-none text-sm text-gray-700 transition ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-amber-600'
                }`}
                {...register('email')}
              />
              {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
            </div>
          </div>

          {/* Form Bottom Control Buttons Row Layout Action Bar */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => { reset(); router.push('/admin/checkpoints/check-user'); }}
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition cursor-pointer select-none focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-amber-600 text-white rounded text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}