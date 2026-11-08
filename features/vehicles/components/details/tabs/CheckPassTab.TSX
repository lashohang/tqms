
import DetailSection from "../DetailSection";

export default function CheckPassTab() {
  return (
    <DetailSection
      title="Check Pass Details"
      items={[
        { label: "Check Pass Number" },
        { label: "Issue Date" },
        { label: "Expiry Date" },
        { label: "Status" },
      ]}
    />
  );
}
