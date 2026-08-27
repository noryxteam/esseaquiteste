"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useModal, type ModalType } from "@/contexts/modal-context";
import { Input, Textarea, Select, FieldLabel } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const modalTitles: Record<Exclude<ModalType, null>, string> = {
  "novo-cliente": "Novo cliente",
  "editar-cliente": "Editar cliente",
  "nova-negociacao": "Nova negociação",
  qualificar: "Qualificar / Descartar",
  escopo: "Registrar escopo",
  proposta: "Proposta comercial",
  resposta: "Registrar resposta",
  contrato: "Contrato",
  pagamento: "Registrar pagamento inicial",
  "converter-projeto": "Converter em projeto",
  interacao: "Registrar interação",
  kickoff: "Realizar kickoff",
  material: "Registrar material",
  bloqueio: "Registrar bloqueio",
  apresentar: "Apresentar ao cliente",
  feedback: "Registrar feedback",
  aprovacao: "Aprovação final",
  entrega: "Executar entrega",
  garantia: "Chamado de garantia",
  "registrar-pagamento": "Registrar pagamento",
};

function ModalForm({ type }: { type: Exclude<ModalType, null> }) {
  const router = useRouter();
  const { closeModal, modalData } = useModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    if (type === "converter-projeto") {
      router.push("/projetos/proj-1");
    } else if (type === "novo-cliente") {
      router.push("/clientes/cli-3");
    } else if (type === "nova-negociacao") {
      router.push("/comercial/neg-3");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(type === "novo-cliente" || type === "editar-cliente") && (
        <>
          <Field label="Nome" defaultValue={modalData.name ?? ""} />
          <Field label="Contato" defaultValue={modalData.contact ?? ""} />
          <Field label="Telefone" />
          <Field label="Email" type="email" />
        </>
      )}

      {type === "nova-negociacao" && (
        <>
          <Field label="Cliente" placeholder="Buscar cliente..." />
          <Field label="Título" placeholder="Site institucional — Cliente" />
          <Field label="Tipo de serviço" asSelect options={["Site", "Landing page", "Sistema web"]} />
        </>
      )}

      {type === "qualificar" && (
        <>
          <Field label="Notas de qualificação" asTextarea />
          <Field label="Motivo (se descartar)" asTextarea />
        </>
      )}

      {type === "escopo" && (
        <>
          <Field label="Objetivo" asTextarea />
          <Field label="Entregáveis" asTextarea placeholder="Um por linha" />
          <Field label="Não inclui" asTextarea />
          <Field label="Prazo estimado" defaultValue="45 dias" />
          <Field label="Valor" defaultValue="8000" />
        </>
      )}

      {(type === "proposta" || type === "resposta") && (
        <>
          <Field label="Valor" defaultValue="8000" />
          <Field label="Validade" defaultValue="15/07/2026" />
          {type === "resposta" && (
            <Field label="Decisão" asSelect options={["Aprovada", "Em negociação", "Recusada"]} />
          )}
        </>
      )}

      {(type === "contrato" || type === "pagamento" || type === "registrar-pagamento") && (
        <>
          <Field label="Valor" />
          <Field label="Data" defaultValue="06/07/2026" />
          <Field label="Método" asSelect options={["PIX", "Transferência", "Boleto"]} />
          <Field label="Comprovante" asSelect options={["Upload simulado"]} />
        </>
      )}

      {type === "converter-projeto" && (
        <div className="rounded-lg bg-surface-elevated p-4 text-sm space-y-2">
          <p><strong>Cliente:</strong> Empresa ABC</p>
          <p><strong>Escopo:</strong> Site institucional</p>
          <p><strong>Valor:</strong> R$ 8.000</p>
          <Field label="Nome do projeto" defaultValue="Site Institucional" />
        </div>
      )}

      {type === "interacao" && (
        <>
          <Field label="Tipo" asSelect options={["Ligação", "Email", "WhatsApp", "Reunião"]} />
          <Field label="Resumo" asTextarea />
        </>
      )}

      {(type === "kickoff" || type === "material" || type === "bloqueio") && (
        <>
          {type === "bloqueio" && (
            <Field label="Tipo" asSelect options={["Aguardando cliente", "Aguardando interno"]} />
          )}
          <Field label={type === "material" ? "Material recebido" : "Notas"} asTextarea />
        </>
      )}

      {(type === "apresentar" || type === "feedback" || type === "aprovacao" || type === "entrega") && (
        <>
          <Field label="URL preview" placeholder="https://preview.norax.dev/..." />
          {type === "feedback" && <Field label="Itens de ajuste" asTextarea />}
          {type === "aprovacao" && <Field label="Comprovante" asSelect options={["Upload simulado"]} />}
          {type === "entrega" && (
            <>
              <Field label="URL produção" />
              <Field label="Dados de hospedagem" asTextarea />
            </>
          )}
        </>
      )}

      {type === "garantia" && (
        <>
          <Field label="Descrição do problema" asTextarea />
          <Field label="Tipo" asSelect options={["Bug", "Ajuste de escopo", "Fora de escopo"]} />
        </>
      )}

      <div className="flex justify-end gap-2 pt-5 mt-2 border-t border-border">
        <Button type="button" variant="ghost" size="sm" onClick={closeModal}>
          Cancelar
        </Button>
        <Button type="submit" size="sm">Confirmar</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
  type = "text",
  asTextarea,
  asSelect,
  options,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  asTextarea?: boolean;
  asSelect?: boolean;
  options?: string[];
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      {asTextarea ? (
        <Textarea defaultValue={defaultValue} placeholder={placeholder} />
      ) : asSelect ? (
        <Select defaultValue={options?.[0]}>
          {options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </Select>
      ) : (
        <Input type={type} defaultValue={defaultValue} placeholder={placeholder} />
      )}
    </label>
  );
}

export function ModalHost() {
  const { modal, closeModal } = useModal();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (modal) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, closeModal]);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-xl border border-border-strong bg-surface shadow-2xl animate-slide-up">
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-border bg-surface/95 backdrop-blur-sm">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{modalTitles[modal]}</h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <ModalForm type={modal} />
        </div>
      </div>
    </div>
  );
}
