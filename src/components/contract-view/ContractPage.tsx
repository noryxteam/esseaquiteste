"use client";

import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractHeader } from "@/components/contract-view/ContractHeader";
import { ContractFooter } from "@/components/contract-view/ContractFooter";
import { ContractSection } from "@/components/contract-view/ContractSection";
import { ContractSignature } from "@/components/contract-view/ContractSignature";
import { ContractCertificate } from "@/components/contract-view/ContractCertificate";
import { ContractSummary } from "@/components/contract-view/ContractSummary";
import { NoraxLogo } from "@/components/brand/NoraxLogo";
import type { ContractPageContent } from "@/lib/mock-data/contract-document-types";
import { cn } from "@/lib/utils";

interface ContractPageProps {
  data: ContractDocumentData;
  page: ContractPageContent;
  pageNumber: number;
  textScale?: number;
  thumbnail?: boolean;
  forPrint?: boolean;
  onRequestSign?: (role: "norax" | "cliente") => void;
}

export function ContractPage({
  data,
  page,
  pageNumber,
  textScale = 100,
  thumbnail,
  forPrint,
  onRequestSign,
}: ContractPageProps) {
  const titleSize = (14 * textScale) / 100;

  return (
    <article
      className={cn(
        "relative bg-white text-[#18181b] flex flex-col overflow-hidden",
        thumbnail
          ? "w-full aspect-[210/297]"
          : forPrint
            ? "w-[210mm] h-[297mm] max-h-[297mm]"
            : "w-full max-w-[210mm] min-h-[297mm] rounded-[8px]"
      )}
    >
      {/* Marca d'água */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <NoraxLogo
          watermark
          className="h-44 w-auto rotate-[-12deg]"
        />
      </div>

      <div
        className={cn(
          "relative flex flex-col flex-1",
          thumbnail
            ? "p-3 scale-[0.35] origin-top-left w-[285%]"
            : forPrint
              ? "px-12 py-10"
              : "px-10 py-8 sm:px-12 sm:py-10"
        )}
      >        <ContractHeader data={data} compact={thumbnail} />

        {page.type === "cover" && (
          <>
            <h1
              className="text-center font-bold tracking-wide uppercase text-[#18181b] mt-6 mb-6"
              style={{ fontSize: `${titleSize}px` }}
            >
              Contrato de Prestação de Serviços
            </h1>
            <ContractSummary data={data} compact={thumbnail} />
            {page.sections?.map((s) => (
              <ContractSection key={s.number} section={s} textScale={textScale} />
            ))}
          </>
        )}

        {page.type === "content" &&
          page.sections?.map((s) => (
            <ContractSection key={s.number} section={s} textScale={textScale} />
          ))}

        {page.type === "signatures" && (
          <div className="flex-1 flex flex-col">
            <ContractSignature
              data={data}
              textScale={textScale}
              onRequestSign={thumbnail ? undefined : onRequestSign}
            />
            <ContractCertificate data={data} textScale={textScale} embedded />
          </div>
        )}

        {page.type === "certificate" && (
          <ContractCertificate data={data} textScale={textScale} />
        )}

        <ContractFooter
          data={data}
          page={pageNumber}
          total={data.totalPages}
          compact={thumbnail}
        />
      </div>
    </article>
  );
}
