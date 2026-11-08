
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { SavedDocument } from '../../../../../features/vehicle-owner/types/vehicleOwner';

interface VehicleOwner {
  id: number;
  name: string;
  email?: string;
  address?: string;
  phoneNo?: string;
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

  citizenshipFront?: SavedDocument | null;
  citizenshipBack?: SavedDocument | null;
  registrationDocument?: SavedDocument | null;
  companyLogo?: SavedDocument | null;

  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  vehicleCount?: number;
}

type TabType = 'Profile' | 'Bank Details' | 'Vehicle Details';

// DOCUMENT CARD
const DocumentCard = ({
  title,
  document,
}: {
  title: string;
  document?: SavedDocument | null;
}) => (
  <div className="border border-gray-200 rounded-sm p-3 w-full max-w-[520px] min-h-[60px]">
    <p className="text-[11px] text-gray-600 font-semibold mb-3">
      {title}
    </p>

    {!document ? (
      <p className="text-[11px] text-gray-400">
        Document not uploaded
      </p>
    ) : document.type?.startsWith('image/') ? (
      <div>
        <img
          src={document.dataUrl}
          alt={document.name}
          className="max-h-64 max-w-full object-contain rounded border border-gray-100"
        />

        <p className="text-[10px] text-gray-500 mt-2">
          {document.name}
        </p>
      </div>
    ) : (
      <a
        href={document.dataUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-blue-600 hover:underline break-all"
      >
        Open {document.name}
      </a>
    )}
  </div>
);

// MAIN DETAIL CONTENT
function VehicleOwnerDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [owner, setOwner] = useState<VehicleOwner | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem('tqms_vehicle_owners');

      if (saved) {
        const owners: VehicleOwner[] = JSON.parse(saved);

        const selectedOwner = owners.find(
          (item) => String(item.id) === id
        );

        setOwner(selectedOwner || null);
      } else {
        setOwner(null);
      }
    } catch (error) {
      console.error('Error loading vehicle owner:', error);
      setOwner(null);
    }

    setLoading(false);
  }, [id]);

  const handleEdit = () => {
    if (!owner) return;

    router.push(`/admin/vehicle/vehicle-owner/add?editId=${owner.id}`);
  };

  const fullAddress = [
    owner?.localLevel,
    owner?.streetAddress,
  ]
    .filter(Boolean)
    .join(', ');

  const displayAddress =
    fullAddress || owner?.address || '—';

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading vehicle owner details...
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-sm text-gray-600 mb-4">
          Vehicle owner details could not be found.
        </p>

        <button
          onClick={() =>
            router.push('/admin/vehicle/vehicle-owner')
          }
          className="bg-[#b06000] text-white px-4 py-2 rounded text-xs"
        >
          Back to Vehicle Owner List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-sm font-bold text-gray-800">
            VehicleOwner Detail
          </h1>

          <div className="text-[11px] flex items-center gap-2 mt-1">
            <span
              className="text-amber-700 cursor-pointer"
              onClick={() => router.push('/admin/dashboard')}
            >
              Dashboard
            </span>

            <span className="text-gray-300">&gt;</span>

            <span
              className="text-amber-700 cursor-pointer"
              onClick={() =>
                router.push('/admin/vehicle/vehicle-owner')
              }
            >
              Vehicle Owner List
            </span>

            <span className="text-gray-300">&gt;</span>

            <span className="text-gray-400">
              VehicleOwner Profile
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            router.push('/admin/vehicle/vehicle-owner')
          }
          className="bg-[#b06000] hover:bg-[#905000] text-white rounded-full px-4 py-2 text-[11px] font-semibold transition"
        >
          ☷ VehicleOwner List
        </button>
      </div>

      {/* OWNER SUMMARY */}
      <div className="bg-[#ad6100] rounded-sm min-h-[190px] p-6 md:px-10 text-white relative">

        <button
          onClick={handleEdit}
          className="absolute right-5 top-5 bg-white text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-sm text-xs shadow-sm"
        >
          ✎ Edit
        </button>

        <div className="flex items-center gap-8">
          <div className="w-3 h-3 rounded-full bg-white shrink-0" />

          <div className="text-[11px] leading-[17px]">
            <p className="text-black">
              Owner Type : {owner.isIndividual === false ? 'Company' : 'Individual'}
            </p>

            <h2 className="text-sm font-bold text-white mt-1">
              {owner.name}
            </h2>

            <p className="text-white/75">
              Mobile : {owner.phoneNo || '—'}
            </p>

            <p className="text-white/75">
              Email : {owner.email || '—'}
            </p>

            <p className="text-white/75">
              State : {owner.state || '—'}
            </p>

            <p className="text-white/75">
              District : {owner.district || '—'}
            </p>

            <p className="text-white/75">
              Local level : {owner.localLevel || '—'}
            </p>

            <p className="text-white/75">
              Street Address : {owner.streetAddress || owner.address || '—'}
            </p>

            <p className="text-white/75">
              PAN Number : {owner.panNumber || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* DETAIL TABS */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5 md:p-6 min-h-[480px]">

        {/* TAB HEADERS */}
        <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">

          {(['Profile', 'Bank Details', 'Vehicle Details'] as TabType[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[11px] whitespace-nowrap border-b-2 transition ${
                  activeTab === tab
                    ? 'border-[#b06000] text-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            )
          )}

        </div>

        {/* PROFILE TAB */}
        {activeTab === 'Profile' && (
          <div className="space-y-8">

            {/* CITIZENSHIP DETAILS */}
            <section>
              <div className="bg-slate-100 px-3 py-2.5 flex items-center gap-2 mb-3">
                <span className="text-gray-700">♙</span>
                <h3 className="text-[11px] font-bold text-gray-800">
                  Citizenship Details
                </h3>
              </div>

              <p className="text-[11px] text-gray-700 mb-2">
                Citizenship Number : {owner.citizenshipNo || '—'}
              </p>

              <div className="space-y-2">
                <DocumentCard
                  title="Citizenship-FrontImage"
                  document={owner.citizenshipFront}
                />

                <DocumentCard
                  title="Citizenship-BackImage"
                  document={owner.citizenshipBack}
                />
              </div>
            </section>

            {/* REGISTRATION DETAILS */}
            <section>
              <div className="bg-slate-100 px-3 py-2.5 flex items-center gap-2 mb-3">
                <span className="text-gray-700">ⓘ</span>
                <h3 className="text-[11px] font-bold text-gray-800">
                  Registration Details
                </h3>
              </div>

              <div className="text-[11px] text-gray-700 leading-[19px] mb-5">
                <p>
                  Registration Number : {owner.registrationNo || '—'}
                </p>

                <p>
                  Pan No. : {owner.panNumber || '—'}
                </p>

                <p>
                  No. of Vehicle : {owner.vehicleCount ?? 0}
                </p>
              </div>

              <DocumentCard
                title="Company Registration"
                document={owner.registrationDocument}
              />
            </section>

            {/* COMPANY LOGO */}
            {owner.isIndividual === false && (
              <section>
                <div className="bg-slate-100 px-3 py-2.5 mb-3">
                  <h3 className="text-[11px] font-bold text-gray-800">
                    Company Logo
                  </h3>
                </div>

                <DocumentCard
                  title="Company Logo"
                  document={owner.companyLogo}
                />
              </section>
            )}

          </div>
        )}

        {/* BANK DETAILS TAB */}
        {activeTab === 'Bank Details' && (
          <section>
            <div className="bg-slate-100 px-3 py-2.5 mb-4">
              <h3 className="text-[11px] font-bold text-gray-800">
                Bank Details
              </h3>
            </div>

            <div className="text-[11px] text-gray-700 space-y-3">
              <p>
                Bank Name : {owner.bankName || '—'}
              </p>

              <p>
                Account Name : {owner.accountName || '—'}
              </p>

              <p>
                Account Number : {owner.accountNumber || '—'}
              </p>
            </div>
          </section>
        )}

        {/* VEHICLE DETAILS TAB */}
        {activeTab === 'Vehicle Details' && (
          <section>
            <div className="bg-slate-100 px-3 py-2.5 mb-4">
              <h3 className="text-[11px] font-bold text-gray-800">
                Vehicle Details
              </h3>
            </div>

            <p className="text-[11px] text-gray-500">
              No vehicle details are available for this owner.
            </p>
          </section>
        )}

      </div>
    </div>
  );
}

// DEFAULT PAGE WITH SUSPENSE
export default function VehicleOwnerDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-gray-500">
          Loading vehicle owner details...
        </div>
      }
    >
      <VehicleOwnerDetailContent />
    </Suspense>
  );
}
