import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { ContractSignatures } from "@/components/contract-view/ContractSignatures";
import { NoraxLogo } from "@/components/brand/NoraxLogo";

interface ContractDocumentProps {
  data: ContractViewData;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-[11px] font-bold tracking-[0.12em] text-[#18181b] uppercase mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-[11px] leading-relaxed text-[#3f3f46]">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function ContractDocument({ data }: ContractDocumentProps) {
  return (
    <div className="mx-auto w-full max-w-[210mm]">
      <article className="bg-white text-[#18181b] shadow-[0_8px_40px_rgba(0,0,0,0.35)] rounded-sm overflow-hidden">
        <div className="px-8 sm:px-12 py-10 sm:py-14 min-h-[297mm]">
          {/* Cabeçalho do documento */}
          <header className="text-center border-b border-[#e4e4e7] pb-8 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-[#18181b] flex items-center justify-center overflow-hidden">
                <NoraxLogo invert className="h-5 w-auto" />
              </div>
              <p className="text-sm font-semibold text-[#18181b]">{data.company.name}</p>
              <p className="text-[10px] text-[#71717a]">{data.company.legalName}</p>
            </div>

            <h1 className="mt-8 text-base sm:text-lg font-bold tracking-wide text-[#18181b] uppercase">
              Contrato de Prestação de Serviços
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-left max-w-md mx-auto text-[10px]">
              <div>
                <span className="text-[#a1a1aa]">Número:</span>{" "}
                <span className="font-mono font-medium">{data.number}</span>
              </div>
              <div>
                <span className="text-[#a1a1aa]">Data:</span>{" "}
                <span className="font-medium">{data.contractDate}</span>
              </div>
              <div>
                <span className="text-[#a1a1aa]">Cliente:</span>{" "}
                <span className="font-medium">{data.client.name}</span>
              </div>
              <div>
                <span className="text-[#a1a1aa]">Empresa:</span>{" "}
                <span className="font-medium">{data.client.company}</span>
              </div>
            </div>
          </header>

          <Section title="1. Contratante">
            <P>
              <strong>{data.client.company}</strong>, inscrita no CNPJ sob nº{" "}
              <strong>{data.client.cpfCnpj}</strong>, com sede em {data.client.address},{" "}
              {data.client.city}, representada por <strong>{data.client.representative}</strong>,
              e-mail <strong>{data.client.email}</strong>, telefone{" "}
              <strong>{data.client.phone}</strong>, doravante denominada <strong>CONTRATANTE</strong>.
            </P>
          </Section>

          <Section title="2. Contratada">
            <P>
              <strong>{data.company.legalName}</strong>, inscrita no CNPJ sob nº{" "}
              <strong>{data.company.cnpj}</strong>, com sede em {data.company.address},{" "}
              {data.company.city}, representada por <strong>{data.company.representative}</strong>,
              e-mail <strong>{data.company.email}</strong>, telefone{" "}
              <strong>{data.company.phone}</strong>, doravante denominada <strong>CONTRATADA</strong>.
            </P>
          </Section>

          <Section title="Objeto">
            <P>
              O presente contrato tem por objeto a prestação de serviços de desenvolvimento de site
              institucional, conforme escopo, entregáveis e especificações acordadas entre as partes,
              incluindo design, implementação, testes e publicação do website da CONTRATANTE.
            </P>
          </Section>

          <Section title="Prazos">
            <P>
              O prazo para execução dos serviços será de <strong>{data.deadline}</strong>, contados a
              partir da assinatura deste instrumento e confirmação do pagamento inicial, quando
              aplicável.
            </P>
          </Section>

          <Section title="Valores">
            <P>
              Pelos serviços descritos, a CONTRATANTE pagará à CONTRATADA o valor total de{" "}
              <strong>{data.value}</strong>, conforme condições estabelecidas na cláusula de pagamento.
            </P>
          </Section>

          <Section title="Responsabilidades">
            <P>
              A CONTRATADA compromete-se a executar os serviços com zelo, diligência e observância das
              melhores práticas do mercado. A CONTRATANTE compromete-se a fornecer informações,
              materiais e aprovações necessárias no prazo acordado.
            </P>
            <P>
              Eventuais atrasos decorrentes da falta de retorno da CONTRATANTE poderão impactar o
              cronograma de entrega, sem responsabilidade da CONTRATADA.
            </P>
          </Section>

          <Section title="Pagamento">
            <P>
              O pagamento será realizado via <strong>{data.paymentMethod}</strong>, em modalidade de{" "}
              <strong>{data.installments.toLowerCase()}</strong>, conforme acordado entre as partes.
            </P>
          </Section>

          <Section title="Garantias">
            <P>
              A CONTRATADA oferece garantia de 30 (trinta) dias para correção de defeitos técnicos
              relacionados ao escopo contratado, contados a partir da entrega final do projeto.
            </P>
          </Section>

          <Section title="Rescisão">
            <P>
              O presente contrato poderá ser rescindido por qualquer das partes mediante comunicação
              escrita com antecedência mínima de 15 (quinze) dias, respeitadas as obrigações já
              assumidas e valores devidos até a data da rescisão.
            </P>
          </Section>

          <Section title="Assinaturas">
            <P>
              E por estarem assim justas e contratadas, as partes assinam o presente instrumento em
              meio eletrônico, com validade jurídica nos termos da legislação vigente.
            </P>
            <ContractSignatures signatures={data.signatures} />
          </Section>
        </div>
      </article>
    </div>
  );
}
