
'use client';

import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

import { VehicleFormInputs } from '../types';
import {
  PROVINCES,
  SYMBOL_OPTIONS,
} from '../constants/vehicleOptions';

interface Props {
  register: UseFormRegister<VehicleFormInputs>;
  watch: UseFormWatch<VehicleFormInputs>;
  errors: FieldErrors<VehicleFormInputs>;
}

export default function ProvincialPlateForm({
  register,
  watch,
  errors,
}: Props) {
  const state = watch('state');
  const registeredOffice = watch('registeredOffice');
  const lotNumber = watch('lotNumber');
  const symbolNo = watch('symbolNo');
  const vehicleNumber = watch('provincialVehicleNumber');

  const province = PROVINCES.find((p) => p.value === state);

  const formattedNumber = !state
    ? 'State------'
    : `${province?.short || 'State'}-${registeredOffice || ''}-${lotNumber || ''}-${symbolNo || ''}-${vehicleNumber || ''}`;

  const isComplete =
    !!state &&
    /^\d{2}$/.test(registeredOffice || '') &&
    /^\d{1,3}$/.test(lotNumber || '') &&
    !!symbolNo &&
    /^\d{1,4}$/.test(vehicleNumber || '');

  return (
    <div className="space-y-5 pt-4 border-t border-gray-200">

      <h3 className="text-sm font-bold text-gray-800">
        Enter Provincial Plate Number Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">State*</label>

          <select
            {...register('state')}
            className={`w-full px-3 py-1.5 border rounded text-xs bg-[#F0F2F5]/40 ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select State...</option>
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {errors.state && <span className="text-[11px] text-red-500">{errors.state.message}</span>}
        </div>

        {/* Registered Office */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Registered Office</label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="Enter 2 digits"
            {...register('registeredOffice', {
              setValueAs: (v) => String(v ?? '').replace(/\D/g, '').slice(0, 2),
            })}
            className={`w-full px-3 py-1.5 border rounded text-xs ${
              errors.registeredOffice ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          {errors.registeredOffice && <span className="text-[11px] text-red-500">{errors.registeredOffice.message}</span>}
        </div>

        {/* Lot Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Lot Number</label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={3}
            placeholder="Enter up to 3 digits"
            {...register('lotNumber', {
              setValueAs: (v) => String(v ?? '').replace(/\D/g, '').slice(0, 3),
            })}
            className={`w-full px-3 py-1.5 border rounded text-xs ${
              errors.lotNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          {errors.lotNumber && <span className="text-[11px] text-red-500">{errors.lotNumber.message}</span>}
        </div>

        {/* Symbol Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Symbol No*</label>

          <select
            {...register('symbolNo')}
            className={`w-full px-3 py-1.5 border rounded text-xs bg-[#F0F2F5]/40 ${
              errors.symbolNo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select...</option>
            {SYMBOL_OPTIONS.map((symbol) => (
              <option key={symbol.value} value={symbol.value}>{symbol.label}</option>
            ))}
          </select>

          {errors.symbolNo && <span className="text-[11px] text-red-500">{errors.symbolNo.message}</span>}
        </div>

        {/* Vehicle Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Vehicle Number*</label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter up to 4 digits"
            {...register('provincialVehicleNumber', {
              setValueAs: (v) => String(v ?? '').replace(/\D/g, '').slice(0, 4),
            })}
            className={`w-full px-3 py-1.5 border rounded text-xs ${
              errors.provincialVehicleNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          {errors.provincialVehicleNumber && <span className="text-[11px] text-red-500">{errors.provincialVehicleNumber.message}</span>}
        </div>

        {/* Formatted Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Formatted Number</label>

          <div className={`w-full flex items-center justify-between px-3 py-1.5 border rounded text-xs font-semibold transition-all ${
            isComplete
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-gray-100 border-gray-300 text-gray-500'
          }`}>
            <span>{formattedNumber}</span>
            {isComplete && <span className="text-green-600 font-bold text-sm">✓</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
