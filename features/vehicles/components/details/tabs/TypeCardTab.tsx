
import DetailSection from "../DetailSection";

export default function TypeCardTab() {
  return (
    <DetailSection
      title="Type Card Details"
      items={[
        { label: "Type Card Number" },
        { label: "Issue Date" },
        { label: "Expiry Date" },
        { label: "Status" },
      ]}
    />
  );
}
