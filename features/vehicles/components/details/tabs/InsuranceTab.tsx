
import DetailSection from "../DetailSection";

export default function InsuranceTab() {
  return (
    <DetailSection
      title="Insurance Details"
      items={[
        { label: "Insurance Company" },
        { label: "Policy Type" },
        { label: "Policy Number" },
        { label: "Policy Start Date" },
        { label: "Policy Expiry Date" },
      ]}
    />
  );
}
