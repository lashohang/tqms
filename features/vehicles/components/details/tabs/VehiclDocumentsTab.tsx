
import DetailSection from "../DetailSection";

export default function VehicleDocumentsTab() {
  return (
    <DetailSection
      title="Vehicle Documents"
      items={[
        { label: "Vehicle Registration Document", value: "Not uploaded" },
        { label: "Citizenship Document", value: "Not uploaded" },
        { label: "Other Documents", value: "Not uploaded" },
      ]}
    />
  );
}
