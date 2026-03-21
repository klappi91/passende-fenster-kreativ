import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { humanizeSlug } from "@/lib/katalog";

interface BreadcrumbsProps {
  segments: string[];
  currentLabel?: string;
}

export default function Breadcrumbs({ segments, currentLabel }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm flex-wrap">
      <Link
        href="/katalog"
        className="text-white/60 transition-colors hover:text-white"
      >
        Katalog
      </Link>

      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1;
        const href = `/katalog/${segments.slice(0, i + 1).join("/")}`;
        const label = isLast && currentLabel ? currentLabel : humanizeSlug(segment);

        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            {isLast ? (
              <span className="font-medium text-white">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-white/60 transition-colors hover:text-white"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
