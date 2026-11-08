
"use client";

interface Props {
  vehicle: any;
}

export default function GeneralTab({ vehicle }: Props) {
  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-50">
      <span className="text-[11px] text-gray-500 shrink-0">
        {label}
      </span>

      <span className="text-[11px] font-semibold text-gray-800 text-right break-all">
        {value !== undefined && value !== null && value !== ""
          ? value
          : "—"}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">

      {/* Section Header */}
      <div className="bg-slate-50/70 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
        <span className="text-gray-500 text-xs">ⓘ</span>

        <h2 className="text-xs font-semibold text-slate-800">
          Vehicle Details
        </h2>
      </div>

      {/* Complete Vehicle Details */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-2">

        {/* Left Column */}
        <div>
          <DetailRow
            label="Engine Number"
            value={vehicle.engineNumber}
          />

          <DetailRow
            label="Chassis Number"
            value={vehicle.chassisNumber}
          />

          <DetailRow
            label="Model No."
            value={vehicle.modelNo}
          />

          <DetailRow
            label="Plate Type"
            value={vehicle.plateType}
          />

          <DetailRow
            label="Company Name"
            value={vehicle.companyName}
          />

          <DetailRow
            label="Plate Color"
            value={vehicle.plateColor}
          />

          <DetailRow
            label="Owner Name"
            value={vehicle.vehicleOwner}
          />

          <DetailRow
            label="Sthaniyasangh"
            value={vehicle.sthaniyasangh}
          />
        </div>

        {/* Right Column */}
        <div>
          <DetailRow
            label="Vehicle Type"
            value={vehicle.vehicleType}
          />

          <DetailRow
            label="Plate Vehicle Type"
            value={vehicle.plateVehicleType}
          />

          <DetailRow
            label="Lot Number"
            value={
              vehicle.plateType === "Embossed"
                ? ""
                : vehicle.lotNo
            }
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

          <DetailRow
            label="Formatted Plate Number"
            value={vehicle.plateNo}
          />
        </div>
      </div>
    </div>
  );
}
