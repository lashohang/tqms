
import DetailSection from "../DetailSection";

export default function BluebookTab() {
  return (
    <DetailSection
      title="Bluebook Details"
      items={[
        { label: "Bluebook Number" },
        { label: "Registration Date" },
        { label: "Renewal Date" },
        { label: "Expiry Date" },
      ]}
    />
  );
}
