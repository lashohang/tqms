
'use client';

import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

import { VehicleFormInputs } from '../types';
import { PROVINCES, VEHICLE_TYPES } from '../constants/vehicleOptions';

interface Props {
  register: UseFormRegister<VehicleFormInputs>;
  watch: UseFormWatch<VehicleFormInputs>;
  errors: FieldErrors<VehicleFormInputs>;
}

export default function EmbossedPlateForm({
  register,
  watch,
  errors,
}: Props) {
  const state = watch('state');
  const vehicleType = watch('plateVehicleType');
  const vaic = watch('embossedVAIC');
  const vehicleNumber = watch('embossedVehicleNumber');

  const province = PROVINCES.find((p) => p.value === state);

  const formattedNumber = state
    ? `State-${province?.code || ''}-${vehicleNumber || ''}`
    : 'State---';

  const isComplete =
    !!state &&
    !!vehicleType &&
    !!vaic?.trim() &&
    /^\d{4}$/.test(vehicleNumber || '');

  return (
    <div className="space-y-5 pt-4 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-800">
        Enter Plate Number Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">State*</label>
          <select
            {...register('state')}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-[#F0F2F5]/40"
          >
            <option value="">Select State...</option>
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {errors.state && <span className="text-[11px] text-red-500">{errors.state.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Vehicle Type*</label>
          <select
            {...register('plateVehicleType')}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-[#F0F2F5]/40"
          >
            <option value="">Select...</option>
            {VEHICLE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.plateVehicleType && <span className="text-[11px] text-red-500">{errors.plateVehicleType.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Embossed VAIC*</label>
          <input
            type="text"
            placeholder="Enter Embossed VAIC"
            {...register('embossedVAIC')}
            className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
              errors.embossedVAIC ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.embossedVAIC && <span className="text-[11px] text-red-500">{errors.embossedVAIC.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600">Vehicle Number*</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter 4 digit number"
            {...register('embossedVehicleNumber', {
              setValueAs: (v) => String(v ?? '').replace(/\D/g, '').slice(0, 4),
            })}
            className={`w-full px-3 py-1.5 border rounded text-xs outline-none focus:border-amber-600 ${
              errors.embossedVehicleNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.embossedVehicleNumber && <span className="text-[11px] text-red-500">{errors.embossedVehicleNumber.message}</span>}
        </div>

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
