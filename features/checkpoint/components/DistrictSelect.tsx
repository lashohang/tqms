'use client';

import { DISTRICTS_BY_STATE } from '../constants/districts';

interface DistrictSelectProps {
  state: string;
  value: string;
  onChange: (district: string) => void;
}

export default function DistrictSelect({
  state,
  value,
  onChange,
}: DistrictSelectProps) {
  const districts = DISTRICTS_BY_STATE[state] || [];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={!state}
      required
      className="w-full bg-slate-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-slate-600 focus:outline-none disabled:bg-gray-100"
    >
      <option value="">
        {state ? 'Select District' : 'Select State First'}
      </option>

      {districts.map((district) => (
        <option key={district} value={district}>
          {district}
        </option>
      ))}
    </select>
  );
}