import type { ContractSection as SectionType } from "@/lib/mock-data/contract-document-types";

interface ContractSectionProps {
  section: SectionType;
  textScale?: number;
}

export function ContractSection({ section, textScale = 100 }: ContractSectionProps) {
  const fontSize = (11 * textScale) / 100;

  return (
    <section className="mt-5 first:mt-0 break-inside-avoid">
      <div className="flex items-stretch gap-3">
        <div
          className="contract-clause-num w-7 shrink-0 flex items-center justify-center"
          style={{ backgroundColor: "#18181b" }}
        >
          <span className="text-[9px] font-bold text-white tabular-nums">{section.number}</span>
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3
            className="font-bold tracking-wide text-[#18181b] uppercase mb-2"
            style={{ fontSize: `${fontSize}px` }}
          >
            {section.title}
          </h3>
          <div className="space-y-2" style={{ fontSize: `${fontSize}px`, lineHeight: 1.65 }}>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="text-[#3f3f46]">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 h-px bg-[#e4e4e7]" />
    </section>
  );
}
