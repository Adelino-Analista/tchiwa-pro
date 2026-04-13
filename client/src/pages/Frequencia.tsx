import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { ClipboardList, Plus, CheckCircle, XCircle, Users } from "lucide-react";
import { toast } from "sonner";

export default function Frequencia() {
  const [showModal, setShowModal] = useState(false);
  const [turmaFilter, setTurmaFilter] = useState("todos");

  const { data: presencas, refetch } = trpc.presencas.list.useQuery({
    turmaId: turmaFilter !== "todos" ? Number(turmaFilter) : undefined,
  });
  const { data: turmas } = trpc.turmas.list.useQuery();
  const { data: alunos } = trpc.alunos.list.useQuery({});

  const createMutation = trpc.presencas.create.useMutation({
    onSuccess: () => { toast.success("Presença registada!"); setShowModal(false); refetch(); resetForm(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    alunoId: "", turmaId: "", data: new Date().toISOString().split("T")[0], presente: true, observacoes: "",
  });
  const resetForm = () => setForm({ alunoId: "", turmaId: "", data: new Date().toISOString().split("T")[0], presente: true, observacoes: "" });

  // Estatísticas
  const totalPresencas = (presencas ?? []).filter(p => p.presenca.presente).length;
  const totalAusencias = (presencas ?? []).filter(p => !p.presenca.presente).length;
  const taxaPresenca = presencas && presencas.length > 0
    ? Math.round((totalPresencas / presencas.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Controlo de Frequência"
        subtitle="Registo de presenças e ausências dos alunos"
        icon={<ClipboardList className="h-5 w-5" />}
        action={
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Registar Presença
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Presenças</p>
            <p className="text-2xl font-bold text-emerald-400">{totalPresencas}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Ausências</p>
            <p className="text-2xl font-bold text-red-400">{totalAusencias}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Taxa</p>
            <p className="text-2xl font-bold text-primary">{taxaPresenca}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <Select value={turmaFilter} onValueChange={setTurmaFilter}>
          <SelectTrigger className="w-52 bg-card border-border/60">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as Turmas</SelectItem>
            {(turmas ?? []).map(({ turma }) => (
              <SelectItem key={turma.id} value={String(turma.id)}>{turma.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {(presencas ?? []).slice(0, 50).map(({ presenca, aluno, turma }) => (
          <div key={presenca.id} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border/60">
            {presenca.presente
              ? <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              : <XCircle className="h-5 w-5 text-red-400 shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{aluno?.nome ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{turma?.nome ?? "—"}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">{String(presenca.data ?? "")}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${presenca.presente ? "status-ativo" : "status-atrasado"}`}>
                {presenca.presente ? "Presente" : "Ausente"}
              </span>
            </div>
          </div>
        ))}
        {(presencas ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Nenhuma presença registada</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registar Presença</DialogTitle></DialogHeader>
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
              <Label className="text-xs">Turma *</Label>
              <Select value={form.turmaId} onValueChange={v => setForm(f => ({...f, turmaId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar turma" /></SelectTrigger>
                <SelectContent>
                  {(turmas ?? []).map(({ turma }) => <SelectItem key={turma.id} value={String(turma.id)}>{turma.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Data *</Label>
              <Input value={form.data} onChange={e => setForm(f => ({...f, data: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Situação</Label>
              <Select value={form.presente ? "presente" : "ausente"} onValueChange={v => setForm(f => ({...f, presente: v === "presente"}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="presente">Presente</SelectItem>
                  <SelectItem value="ausente">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Observações</Label>
              <Input value={form.observacoes} onChange={e => setForm(f => ({...f, observacoes: e.target.value}))} placeholder="Opcional" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!form.alunoId || !form.turmaId || !form.data) { toast.error("Preencha os campos obrigatórios"); return; }
                createMutation.mutate({
                  alunoId: Number(form.alunoId), turmaId: Number(form.turmaId),
                  data: form.data, presente: form.presente,
                  observacoes: form.observacoes || undefined,
                });
              }}
              disabled={createMutation.isPending}
            >
              Registar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
