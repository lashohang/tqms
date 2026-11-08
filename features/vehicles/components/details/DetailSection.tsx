
interface DetailItem {
  label: string;
  value?: string | number | null;
}

interface DetailSectionProps {
  title: string;
  items: DetailItem[];
}

export default function DetailSection({
  title,
  items,
}: DetailSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="border-b border-gray-100 pb-2"
          >
            <p className="text-[10px] text-gray-500 mb-1">
              {item.label}
            </p>

            <p className="text-xs font-medium text-gray-800 break-words">
              {item.value !== undefined &&
              item.value !== null &&
              item.value !== ""
                ? item.value
                : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
