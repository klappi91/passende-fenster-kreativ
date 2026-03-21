import { CheckCircle } from "lucide-react";

interface SpecListProps {
  specs: string[];
}

export default function SpecList({ specs }: SpecListProps) {
  const unique = [...new Set(specs)];

  if (unique.length === 0) return null;

  return (
    <div>
      <h2 className="heading-sub mb-6">Technische Daten</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {unique.map((spec, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg px-4 py-3 ${
              i % 2 === 0 ? "bg-[var(--brand-light)]" : ""
            }`}
          >
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-primary)]" />
            <span
              className="text-sm text-[var(--brand-text)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {spec}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
