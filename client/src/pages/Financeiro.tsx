import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { DollarSign, Plus, CheckCircle, Clock, AlertCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const STATUS_LABELS: Record<string, string> = { pago: "Pago", pendente: "Pendente", atrasado: "Atrasado", cancelado: "Cancelado" };
const STATUS_ICONS: Record<string, any> = { pago: CheckCircle, pendente: Clock, atrasado: AlertCircle, cancelado: AlertCircle };
const STATUS_COLORS: Record<string, string> = {
  pago: "text-emerald-400", pendente: "text-amber-400", atrasado: "text-red-400", cancelado: "text-muted-foreground",
};

export default function Financeiro() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<number | null>(null);

  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;

  const { data: pagamentos, refetch } = trpc.pagamentos.list.useQuery({
    status: statusFilter !== "todos" ? statusFilter : undefined,
  });
  const { data: resumo } = trpc.pagamentos.resumoMes.useQuery({ mes: mesAtual });
  const { data: alunos } = trpc.alunos.list.useQuery({});

  const createMutation = trpc.pagamentos.create.useMutation({
    onSuccess: () => { toast.success("Pagamento registado!"); setShowModal(false); refetch(); resetForm(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.pagamentos.update.useMutation({
    onSuccess: () => { toast.success("Pagamento atualizado!"); setShowUpdateModal(null); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    alunoId: "", descricao: "", valor: "", dataVencimento: "",
    referenciaMes: mesAtual, status: "pendente" as const, metodoPagamento: "pix" as const,
  });
  const resetForm = () => setForm({ alunoId: "", descricao: "", valor: "", dataVencimento: "", referenciaMes: mesAtual, status: "pendente", metodoPagamento: "pix" });

  const [updateForm, setUpdateForm] = useState({ status: "pago" as any, dataPagamento: "", metodoPagamento: "pix" as any });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Controlo Financeiro"
        subtitle="Gestão de mensalidades e pagamentos"
        icon={<DollarSign className="h-5 w-5" />}
        action={
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Pagamento
          </Button>
        }
      />

      {/* Resumo do mês */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total do Mês", value: resumo?.total ?? 0, color: "text-foreground" },
          { label: "Recebido", value: resumo?.pago ?? 0, color: "text-emerald-400" },
          { label: "Pendente", value: resumo?.pendente ?? 0, color: "text-amber-400" },
          { label: "Em Atraso", value: resumo?.atrasado ?? 0, color: "text-red-400" },
        ].map(item => (
          <Card key={item.label} className="border-border/60 bg-card/80">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>
                AOA {Number(item.value).toLocaleString("pt-AO")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 bg-card border-border/60">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pago">Pagos</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="atrasado">Atrasados</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {(pagamentos ?? []).map(({ pagamento, aluno }) => {
          const Icon = STATUS_ICONS[pagamento.status] ?? Clock;
          return (
            <Card key={pagamento.id} className="border-border/60 bg-card/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Icon className={`h-5 w-5 shrink-0 ${STATUS_COLORS[pagamento.status]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setLocation(`/alunos/${aluno?.id}`)}
                      >
                        {aluno?.nome ?? "—"}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium status-${pagamento.status}`}>
                        {STATUS_LABELS[pagamento.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pagamento.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      Venc: {String(pagamento.dataVencimento ?? "")}
                      {pagamento.dataPagamento && ` · Pago: ${String(pagamento.dataPagamento)}`}
                      {pagamento.metodoPagamento && ` · ${pagamento.metodoPagamento.replace("_", " ")}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">AOA {Number(pagamento.valor).toLocaleString("pt-AO")}</p>
                    {pagamento.status !== "pago" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 h-7 text-xs"
                        onClick={() => { setUpdateForm({ status: "pago", dataPagamento: new Date().toISOString().split("T")[0], metodoPagamento: "pix" }); setShowUpdateModal(pagamento.id); }}
                      >
                        Marcar Pago
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {(pagamentos ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <DollarSign className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Nenhum pagamento encontrado</p>
          </div>
        )}
      </div>

      {/* Modal Novo Pagamento */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registar Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Aluno *</Label>
              <Select value={form.alunoId} onValueChange={v => setForm(f => ({...f, alunoId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar aluno" /></SelectTrigger>
                <SelectContent>
                  {(alunos ?? []).map(({ aluno }) => <SelectItem key={aluno.id} value={String(aluno.id)}>{aluno.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Descrição *</Label>
              <Input value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))} placeholder="ex: Mensalidade Março/2026" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Valor (AOA) *</Label>
                <Input value={form.valor} onChange={e => setForm(f => ({...f, valor: e.target.value}))} placeholder="0.00" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Referência</Label>
                <Input value={form.referenciaMes} onChange={e => setForm(f => ({...f, referenciaMes: e.target.value}))} placeholder="2026-03" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Data de Vencimento *</Label>
              <Input value={form.dataVencimento} onChange={e => setForm(f => ({...f, dataVencimento: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v as any}))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Método</Label>
                <Select value={form.metodoPagamento} onValueChange={v => setForm(f => ({...f, metodoPagamento: v as any}))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="cartao_credito">Cartão Crédito</SelectItem>
                    <SelectItem value="cartao_debito">Cartão Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!form.alunoId || !form.descricao || !form.valor || !form.dataVencimento) { toast.error("Preencha os campos obrigatórios"); return; }
                const { alunoId: _aid, ...rest } = form;
                createMutation.mutate({ alunoId: Number(form.alunoId), ...rest });
              }}
              disabled={createMutation.isPending}
            >
              Registar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Atualizar Pagamento */}
      <Dialog open={showUpdateModal !== null} onOpenChange={() => setShowUpdateModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Atualizar Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={updateForm.status} onValueChange={v => setUpdateForm(f => ({...f, status: v}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Data de Pagamento</Label>
              <Input value={updateForm.dataPagamento} onChange={e => setUpdateForm(f => ({...f, dataPagamento: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Método de Pagamento</Label>
              <Select value={updateForm.metodoPagamento} onValueChange={v => setUpdateForm(f => ({...f, metodoPagamento: v}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="cartao_credito">Cartão Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateModal(null)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (showUpdateModal) updateMutation.mutate({ id: showUpdateModal, ...updateForm });
              }}
              disabled={updateMutation.isPending}
            >
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
