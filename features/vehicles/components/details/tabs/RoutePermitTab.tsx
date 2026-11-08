
import DetailSection from "../DetailSection";

export default function RoutePermitTab() {
  return (
    <DetailSection
      title="Route Permit Details"
      items={[
        { label: "Permit Number" },
        { label: "Route Name" },
        { label: "Issue Date" },
        { label: "Expiry Date" },
        { label: "Permit Status" },
      ]}
    />
  );
}
