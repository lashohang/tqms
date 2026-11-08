'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================
// VEHICLE DATA INTERFACE
// ============================================================

interface VehicleRecord {
  id: string;
  plateNo?: string;
  lotNo?: string;
  vehicleNumber?: string;
  vehicleType?: string;
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
}

// ============================================================
// TABS
// ============================================================

const tabs = [
  'General',
  'Vehicle Documents',
  'Vehicle Owner',
  'Beneficiary',
  'Check Pass',
  'Route Permit',
  'Insurance',
  'Type Card',
  'Bluebook',
  'Tare Weight',
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function VehicleDetailPage() {
  const router = useRouter();

  const [vehicle, setVehicle] = useState<VehicleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('General');

  // ==========================================================
  // LOAD VEHICLE FROM LOCAL STORAGE
  // ==========================================================

  useEffect(() => {
    const loadVehicle = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const vehicleId = params.get('id');

        const storedVehicles = localStorage.getItem('tqms_vehicles_list');

        if (!storedVehicles || !vehicleId) {
          setVehicle(null);
          setLoading(false);
          return;
        }

        const vehicles: VehicleRecord[] = JSON.parse(storedVehicles);

        const selectedVehicle = vehicles.find(
          (item) => String(item.id) === String(vehicleId)
        );

        setVehicle(selectedVehicle || null);
      } catch (error) {
        console.error('Error loading vehicle:', error);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, []);

  // ==========================================================
  // REUSABLE DETAIL ROW
  // ==========================================================

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div className="grid grid-cols-2 gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <p className="text-[11px] font-semibold text-gray-500">
        {label}
      </p>

      <p className="text-[11px] font-medium text-gray-800 break-words">
        {value || '-'}
      </p>
    </div>
  );

  // ==========================================================
  // REUSABLE DETAIL SECTION
  // ==========================================================

  const DetailSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
      <h3 className="text-xs font-bold text-gray-800 mb-4">
        {title}
      </h3>

      {children}
    </div>
  );

  // ==========================================================
  // GENERAL TAB
  // ==========================================================

  const renderGeneralTab = () => {
    if (!vehicle) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* VEHICLE INFORMATION */}

        <DetailSection title="Vehicle Information">
          <DetailRow
            label="Vehicle Number"
            value={vehicle.vehicleNumber}
          />

          <DetailRow
            label="Vehicle Type"
            value={vehicle.vehicleType}
          />

          <DetailRow
            label="Plate Vehicle Type"
            value={vehicle.plateVehicleType}
          />

          <DetailRow
            label="Vehicle Owner"
            value={vehicle.vehicleOwner}
          />

          <DetailRow
            label="Sthaniya Sangh"
            value={vehicle.sthaniyasangh}
          />

          <DetailRow
            label="Company Name"
            value={vehicle.companyName}
          />

          <DetailRow
            label="Model Number"
            value={vehicle.modelNo}
          />
        </DetailSection>

        {/* REGISTRATION INFORMATION */}

        <DetailSection title="Registration Information">
          <DetailRow
            label="Plate Number"
            value={vehicle.plateNo}
          />

          <DetailRow
            label="Lot Number"
            value={vehicle.lotNo}
          />

          <DetailRow
            label="Plate Color"
            value={vehicle.plateColor}
          />

          <DetailRow
            label="Plate Type"
            value={vehicle.plateType}
          />

          <DetailRow
            label="State"
            value={vehicle.state}
          />

          <DetailRow
            label="Registered Office"
            value={vehicle.registeredOffice}
          />

          <DetailRow
            label="Symbol Number"
            value={vehicle.symbolNo}
          />
        </DetailSection>

        {/* EMBOSSED INFORMATION */}

        <DetailSection title="Embossed Plate Information">
          <DetailRow
            label="Embossed VAIC"
            value={vehicle.embossedVAIC}
          />

          <DetailRow
            label="Embossed Vehicle Number"
            value={vehicle.embossedVehicleNumber}
          />

          <DetailRow
            label="Provincial Vehicle Number"
            value={vehicle.provincialVehicleNumber}
          />
        </DetailSection>

        {/* TECHNICAL INFORMATION */}

        <DetailSection title="Technical Information">
          <DetailRow
            label="Engine Number"
            value={vehicle.engineNumber}
          />

          <DetailRow
            label="Chassis Number"
            value={vehicle.chassisNumber}
          />
        </DetailSection>

      </div>
    );
  };

  // ==========================================================
  // VEHICLE OWNER TAB
  // ==========================================================

  const renderVehicleOwnerTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <DetailSection title="Vehicle Owner Information">
        <DetailRow
          label="Owner Name"
          value={vehicle?.vehicleOwner}
        />
      </DetailSection>
    </div>
  );

  // ==========================================================
  // OTHER TAB CONTENT
  // ==========================================================

  const renderEmptyTab = (title: string) => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8">
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <span className="text-gray-400 text-xl">+</span>
        </div>

        <h3 className="text-xs font-bold text-gray-700 mb-1">
          {title}
        </h3>

        <p className="text-[11px] text-gray-400">
          No {title.toLowerCase()} information available.
        </p>
      </div>
    </div>
  );

  // ==========================================================
  // ACTIVE TAB CONTENT
  // ==========================================================

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'General':
        return renderGeneralTab();

      case 'Vehicle Documents':
        return renderEmptyTab('Vehicle Documents');

      case 'Vehicle Owner':
        return renderVehicleOwnerTab();

      case 'Beneficiary':
        return renderEmptyTab('Beneficiary');

      case 'Check Pass':
        return renderEmptyTab('Check Pass');

      case 'Route Permit':
        return renderEmptyTab('Route Permit');

      case 'Insurance':
        return renderEmptyTab('Insurance');

      case 'Type Card':
        return renderEmptyTab('Type Card');

      case 'Bluebook':
        return renderEmptyTab('Bluebook');

      case 'Tare Weight':
        return renderEmptyTab('Tare Weight');

      default:
        return renderGeneralTab();
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Loading vehicle details...
      </div>
    );
  }

  // ==========================================================
  // VEHICLE NOT FOUND
  // ==========================================================

  if (!vehicle) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Vehicle not found
          </p>

          <p className="text-xs text-gray-500 mb-5">
            The vehicle information could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => router.push('/admin/vehicle/vehicles')}
            className="px-4 py-2 rounded-md bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600"
          >
            Back to Vehicle List
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

        <div>
          <h1 className="text-lg font-bold text-gray-800">
            Vehicle Detail
          </h1>

          <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
            <span
                className="text-orange-500 font-semibold cursor-pointer hover:underline"
                onClick={() => router.push('/admin/dashboard')}
              >
                Dashboard
              </span>
            <span
                className="text-orange-500 font-semibold cursor-pointer hover:underline"
                onClick={() => router.push('/admin/vehicle/vehicles')}
              >
                Vehicle List
              </span>
            <span className="text-orange-500 font-semibold">
              Vehicle Profile
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/vehicle/vehicles')}
          className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold"
        >
          Vehicle List
        </button>

      </div>

      {/* ======================================================
          VEHICLE SUMMARY
      ====================================================== */}

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div>
            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              Vehicle Number
            </p>

            <p className="text-xs font-bold text-gray-800">
              {vehicle.vehicleNumber || '-'}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              Name
            </p>

            <p className="text-xs font-bold text-gray-800">
              {vehicle.sthaniyasangh || '-'}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              Owner Name
            </p>

            <p className="text-xs font-bold text-gray-800">
              {vehicle.vehicleOwner || '-'}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-500 mb-1">
              Vehicle Type
            </p>

            <p className="text-xs font-bold text-gray-800">
              {vehicle.vehicleType || '-'}
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

   {/* ======================================================
    SECTION HEADINGS AND VEHICLE INFORMATION
====================================================== */}

<div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-5">

  {/* SECTION HEADINGS */}

  <div className="flex flex-wrap gap-x-7 gap-y-3 border-b border-gray-200 mb-5">

    {tabs.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`
          text-[11px] font-semibold pb-3 transition-all
          ${
            activeTab === tab
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-orange-500'
          }
        `}
      >
        {tab}
      </button>
    ))}

  </div>

  {/* SELECTED SECTION */}

  <h2 className="text-sm font-bold text-gray-800 mb-3">
    {activeTab}
  </h2>

  <div className="border-b border-gray-200 mb-5" />

  {/* VEHICLE INFORMATION */}

  {renderActiveTab()}

</div>

      {/* ======================================================
          BOTTOM ACTION BUTTONS
      ====================================================== */}

      <div className="flex items-center justify-end gap-3">

        <button
          type="button"
          onClick={() => router.push('/admin/vehicle/vehicles')}
          className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-600 text-[11px] font-semibold hover:bg-gray-50"
        >
          Close
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/vehicle/create?editId=${vehicle.id}`
            )
          }
          className="px-5 py-2 rounded-md bg-orange-500 text-white text-[11px] font-semibold hover:bg-orange-600"
        >
          Edit Vehicle
        </button>

      </div>

    </div>
  );
}