
import DetailSection from "../DetailSection";

export default function TareWeightTab() {
  return (
    <DetailSection
      title="Tare Weight Details"
      items={[
        { label: "Tare Weight" },
        { label: "Gross Vehicle Weight" },
        { label: "Loading Capacity" },
        { label: "Measurement Date" },
      ]}
    />
  );
}
