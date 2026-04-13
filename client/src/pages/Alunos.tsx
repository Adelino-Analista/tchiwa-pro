import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import { Users, Plus, Search, Filter, UserCircle, Phone, Mail, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  ativo: "Ativo", inativo: "Inativo", suspenso: "Suspenso", trancado: "Trancado",
};
const STATUS_CLASSES: Record<string, string> = {
  ativo: "status-ativo", inativo: "status-inativo",
  suspenso: "status-suspenso", trancado: "status-atrasado",
};

export default function Alunos() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [showModal, setShowModal] = useState(false);

  const { data: alunos, refetch } = trpc.alunos.list.useQuery({
    search: search || undefined,
    status: statusFilter !== "todos" ? statusFilter : undefined,
  });
  const { data: modalidades } = trpc.modalidades.list.useQuery();

  const createMutation = trpc.alunos.create.useMutation({
    onSuccess: () => { toast.success("Aluno cadastrado com sucesso!"); setShowModal(false); refetch(); resetForm(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", cpf: "", dataNascimento: "",
    endereco: "", responsavel: "", telefoneResponsavel: "",
    modalidadeId: "", status: "ativo" as const,
    dataMatricula: "", diaVencimento: "10", valorMensalidade: "",
  });

  const resetForm = () => setForm({
    nome: "", email: "", telefone: "", cpf: "", dataNascimento: "",
    endereco: "", responsavel: "", telefoneResponsavel: "",
    modalidadeId: "", status: "ativo", dataMatricula: "",
    diaVencimento: "10", valorMensalidade: "",
  });

  const handleSubmit = () => {
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    createMutation.mutate({
      ...form,
      modalidadeId: form.modalidadeId ? Number(form.modalidadeId) : undefined,
      diaVencimento: Number(form.diaVencimento),
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gestão de Alunos"
        subtitle={`${alunos?.length ?? 0} alunos encontrados`}
        icon={<Users className="h-5 w-5" />}
        action={
          <Button onClick={() => setShowModal(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Novo Aluno
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border/60"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-card border-border/60">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
            <SelectItem value="suspenso">Suspensos</SelectItem>
            <SelectItem value="trancado">Trancados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {(alunos ?? []).map(({ aluno, modalidade }) => (
          <Card
            key={aluno.id}
            className="border-border/60 bg-card/80 cursor-pointer hover:border-primary/30 hover:bg-card transition-all"
            onClick={() => setLocation(`/alunos/${aluno.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {aluno.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{aluno.nome}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_CLASSES[aluno.status]}`}>
                      {STATUS_LABELS[aluno.status]}
                    </span>
                  </div>
                  {modalidade && (
                    <p className="text-xs text-primary/80 mb-1">{modalidade.nome}</p>
                  )}
                  <div className="space-y-0.5">
                    {aluno.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" /><span className="truncate">{aluno.email}</span>
                      </div>
                    )}
                    {aluno.telefone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /><span>{aluno.telefone}</span>
                      </div>
                    )}
                    {aluno.dataMatricula && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Matrícula: {String(aluno.dataMatricula)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(alunos ?? []).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Nenhum aluno encontrado</p>
            <p className="text-xs mt-1">Clique em "Novo Aluno" para cadastrar</p>
          </div>
        )}
      </div>

      {/* Modal Novo Aluno */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Cadastrar Novo Aluno
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2">
              <Label className="text-xs">Nome Completo *</Label>
              <Input value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))} placeholder="Nome do aluno" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="email@exemplo.com" className="mt-1" type="email" />
            </div>
            <div>
              <Label className="text-xs">Telefone</Label>
              <Input value={form.telefone} onChange={e => setForm(f => ({...f, telefone: e.target.value}))} placeholder="+244 900 000 000" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">CPF / BI</Label>
              <Input value={form.cpf} onChange={e => setForm(f => ({...f, cpf: e.target.value}))} placeholder="Número do documento" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Data de Nascimento</Label>
              <Input value={form.dataNascimento} onChange={e => setForm(f => ({...f, dataNascimento: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Endereço</Label>
              <Input value={form.endereco} onChange={e => setForm(f => ({...f, endereco: e.target.value}))} placeholder="Endereço completo" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Responsável</Label>
              <Input value={form.responsavel} onChange={e => setForm(f => ({...f, responsavel: e.target.value}))} placeholder="Nome do responsável" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Tel. Responsável</Label>
              <Input value={form.telefoneResponsavel} onChange={e => setForm(f => ({...f, telefoneResponsavel: e.target.value}))} placeholder="+244 900 000 000" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Modalidade</Label>
              <Select value={form.modalidadeId} onValueChange={v => setForm(f => ({...f, modalidadeId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {(modalidades ?? []).map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v as any}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="trancado">Trancado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Data de Matrícula</Label>
              <Input value={form.dataMatricula} onChange={e => setForm(f => ({...f, dataMatricula: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Dia de Vencimento</Label>
              <Input value={form.diaVencimento} onChange={e => setForm(f => ({...f, diaVencimento: e.target.value}))} type="number" min="1" max="31" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Valor da Mensalidade (AOA)</Label>
              <Input value={form.valorMensalidade} onChange={e => setForm(f => ({...f, valorMensalidade: e.target.value}))} placeholder="0.00" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Salvando..." : "Cadastrar Aluno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
