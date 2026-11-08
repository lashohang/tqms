
import DetailSection from "../DetailSection";
interface Props {
  vehicle: any;
}

export default function VehicleOwnerTab({ vehicle }: Props) {
  return (
    <DetailSection
      title="Vehicle Owner Details"
      items={[
        { label: "Vehicle Owner", value: vehicle.vehicleOwner },
        { label: "Sthaniya Sangh", value: vehicle.sthaniyasangh },
        { label: "Vehicle Number", value: vehicle.plateNo || vehicle.vehicleNumber },
      ]}
    />
  );
}
