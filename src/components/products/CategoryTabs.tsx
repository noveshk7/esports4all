type Category =
  | "maps"
  | "pdfs"
  | "sheets"
  | "info-maps"
  | "hq-maps";

const tabs: { label: string; value: Category }[] = [
  { label: "Maps", value: "maps" },
  { label: "PDFs", value: "pdfs" },
  { label: "Sheets", value: "sheets" },
  { label: "Info Maps", value: "info-maps" },
  { label: "HQ Maps", value: "hq-maps" },
];

type Props = {
  active: Category;
  onChange: (value: Category) => void;
};

const CategoryTabs = ({ active, onChange }: Props) => {
  return (
    <div className="inline-flex flex-wrap bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 sm:px-6 py-2 text-sm rounded-md transition ${
            active === tab.value
              ? "bg-black text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
