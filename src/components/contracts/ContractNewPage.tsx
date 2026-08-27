"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getClients, getProjects, getUsers } from "@/mock";
import { electronicContractService } from "@/modules/electronic-contracts";
import { getContractAdminPath } from "@/lib/contract-routes";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { ArrowLeft } from "lucide-react";

export function ContractNewPage() {
  const router = useRouter();
  const clients = getClients();
  const projects = getProjects();
  const users = getUsers().filter((u) => u.role !== "cliente");

  const [clienteId, setClienteId] = useState(clients[0]?.id ?? "");
  const [projetoId, setProjetoId] = useState(projects[0]?.id ?? "");
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [parcelas, setParcelas] = useState("1");
  const [prazo, setPrazo] = useState("");
  const [responsavelId, setResponsavelId] = useState(users[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const clientProjects = projects.filter((p) => p.clienteId === clienteId);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const project = projects.find((p) => p.id === projetoId);
      const contract = electronicContractService.create({
        clienteId,
        projetoId,
        titulo: titulo || `Contrato — ${project?.nome ?? "Projeto"}`,
        valor: Number(valor) || project?.valor || 0,
        formaPagamento,
        parcelas: Number(parcelas) || 1,
        prazo: prazo || project?.prazo || new Date().toISOString().split("T")[0],
        responsavelId,
      });
      void import("@/modules/electronic-contracts/sync-api").then(
        ({ syncElectronicContractInBackground }) => {
          syncElectronicContractInBackground(contract);
        }
      );
      router.push(getContractAdminPath(contract.id));
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Erro ao criar o contrato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 gap-1 text-muted-foreground">
          <Link href="/contratos">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Novo contrato</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inicie o ciclo de vida do contrato eletrônico.
        </p>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface/40 p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value);
              const first = projects.find((p) => p.clienteId === e.target.value);
              if (first) setProjetoId(first.id);
            }}
            className="mt-1 w-full h-10 rounded-md border border-border-subtle bg-background px-3 text-sm"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.empresa}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Projeto</label>
          <select
            value={projetoId}
            onChange={(e) => setProjetoId(e.target.value)}
            className="mt-1 w-full h-10 rounded-md border border-border-subtle bg-background px-3 text-sm"
          >
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Título</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1 h-10" placeholder="Contrato de prestação de serviços" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Valor (R$)</label>
            <Input value={valor} onChange={(e) => setValor(e.target.value)} type="number" className="mt-1 h-10" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Parcelas</label>
            <Input value={parcelas} onChange={(e) => setParcelas(e.target.value)} type="number" className="mt-1 h-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Forma de pagamento</label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-border-subtle bg-background px-3 text-sm"
            >
              {["PIX", "Boleto", "Cartão", "Transferência"].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Prazo</label>
            <Input value={prazo} onChange={(e) => setPrazo(e.target.value)} type="date" className="mt-1 h-10" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Responsável</label>
          <select
            value={responsavelId}
            onChange={(e) => setResponsavelId(e.target.value)}
            className="mt-1 w-full h-10 rounded-md border border-border-subtle bg-background px-3 text-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="w-full h-11 bg-foreground text-accent-foreground"
        >
          Criar contrato
        </Button>
      </div>
    </div>
  );
}
