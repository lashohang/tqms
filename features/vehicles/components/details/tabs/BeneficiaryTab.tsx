
import DetailSection from "../DetailSection";

export default function BeneficiaryTab() {
  return (
    <DetailSection
      title="Beneficiary Details"
      items={[
        { label: "Beneficiary Name" },
        { label: "Contact Number" },
        { label: "Address" },
        { label: "Citizenship Number" },
      ]}
    />
  );
}
