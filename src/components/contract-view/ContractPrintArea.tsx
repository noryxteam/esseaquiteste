import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractPage } from "@/components/contract-view/ContractPage";

interface ContractPrintAreaProps {
  data: ContractDocumentData;
}

export function ContractPrintArea({ data }: ContractPrintAreaProps) {
  return (
    <div id="contract-print-area" className="hidden print:block" aria-hidden>
      {data.pages.map((page) => (
        <div key={page.id} className="contract-print-page">
          <ContractPage
            data={data}
            page={page}
            pageNumber={page.id}
            textScale={100}
            forPrint
          />
        </div>
      ))}
    </div>
  );
}
