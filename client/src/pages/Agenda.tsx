import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { CalendarDays, Plus, Clock, Users } from "lucide-react";
import { toast } from "sonner";

const DIAS: { value: string; label: string }[] = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

const DIA_ORDEM = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

export default function Agenda() {
  const [showTurmaModal, setShowTurmaModal] = useState(false);
  const [showHorarioModal, setShowHorarioModal] = useState(false);

  const { data: horarios, refetch: refetchHorarios } = trpc.horarios.list.useQuery();
  const { data: turmas, refetch: refetchTurmas } = trpc.turmas.list.useQuery();
  const { data: professores } = trpc.professores.list.useQuery();
  const { data: modalidades } = trpc.modalidades.list.useQuery();

  const createTurma = trpc.turmas.create.useMutation({
    onSuccess: () => { toast.success("Turma criada!"); setShowTurmaModal(false); refetchTurmas(); resetTurmaForm(); },
    onError: (e) => toast.error(e.message),
  });

  const createHorario = trpc.horarios.create.useMutation({
    onSuccess: () => { toast.success("Horário criado!"); setShowHorarioModal(false); refetchHorarios(); resetHorarioForm(); },
    onError: (e) => toast.error(e.message),
  });

  const [turmaForm, setTurmaForm] = useState({ nome: "", modalidadeId: "", professorId: "", capacidadeMaxima: "30", nivel: "iniciante" as const, descricao: "" });
  const [horarioForm, setHorarioForm] = useState({ turmaId: "", professorId: "", diaSemana: "", horaInicio: "", horaFim: "", sala: "" });

  const resetTurmaForm = () => setTurmaForm({ nome: "", modalidadeId: "", professorId: "", capacidadeMaxima: "30", nivel: "iniciante", descricao: "" });
  const resetHorarioForm = () => setHorarioForm({ turmaId: "", professorId: "", diaSemana: "", horaInicio: "", horaFim: "", sala: "" });

  // Agrupar horários por dia da semana
  const horariosPorDia: Record<string, typeof horarios> = {};
  (horarios ?? []).forEach(h => {
    const dia = h.horario.diaSemana;
    if (!horariosPorDia[dia]) horariosPorDia[dia] = [];
    horariosPorDia[dia]!.push(h);
  });

  const diasComAulas = DIA_ORDEM.filter(d => horariosPorDia[d] && horariosPorDia[d]!.length > 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agenda de Aulas"
        subtitle="Horários, turmas e professores"
        icon={<CalendarDays className="h-5 w-5" />}
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowTurmaModal(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Nova Turma
            </Button>
            <Button size="sm" onClick={() => setShowHorarioModal(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Horário
            </Button>
          </div>
        }
      />

      {/* Turmas */}
      {(turmas ?? []).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Turmas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {(turmas ?? []).map(({ turma, modalidade, professor }) => (
              <Card key={turma.id} className="border-border/60 bg-card/80">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{turma.nome}</p>
                      {modalidade && <p className="text-xs text-primary/80">{modalidade.nome}</p>}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${turma.ativo ? "status-ativo" : "status-inativo"}`}>
                      {turma.ativo ? "ativa" : "inativa"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {professor && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /><span>{professor.nome}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" /><span>Capacidade: {turma.capacidade ?? "—"}</span>
                    </div>
                    {turma.nivel && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                        {turma.nivel}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Horários por dia */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Horários Semanais</h2>
        {diasComAulas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {diasComAulas.map(dia => (
              <Card key={dia} className="border-border/60 bg-card/80">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold capitalize">
                    {DIAS.find(d => d.value === dia)?.label ?? dia}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2">
                  {(horariosPorDia[dia] ?? [])
                    .sort((a, b) => a.horario.horaInicio.localeCompare(b.horario.horaInicio))
                    .map(h => (
                      <div key={h.horario.id} className="flex items-center gap-3 p-2 rounded-lg bg-accent/20 border border-border/30">
                        <div className="text-center shrink-0 w-16">
                          <p className="text-xs font-bold text-primary">{h.horario.horaInicio}</p>
                          <p className="text-[10px] text-muted-foreground">{h.horario.horaFim}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{h.turma?.nome ?? "—"}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{h.professor?.nome ?? "—"}</p>
                          {h.horario.local && <p className="text-[10px] text-muted-foreground">{h.horario.local}</p>}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Nenhum horário cadastrado</p>
            <p className="text-xs mt-1">Crie turmas e adicione horários</p>
          </div>
        )}
      </div>

      {/* Modal Nova Turma */}
      <Dialog open={showTurmaModal} onOpenChange={setShowTurmaModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova Turma</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Nome da Turma *</Label>
              <Input value={turmaForm.nome} onChange={e => setTurmaForm(f => ({...f, nome: e.target.value}))} placeholder="ex: Jiu-Jitsu Adulto A" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Modalidade</Label>
              <Select value={turmaForm.modalidadeId} onValueChange={v => setTurmaForm(f => ({...f, modalidadeId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {(modalidades ?? []).map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Professor</Label>
              <Select value={turmaForm.professorId} onValueChange={v => setTurmaForm(f => ({...f, professorId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar professor" /></SelectTrigger>
                <SelectContent>
                  {(professores ?? []).map(({ professor }) => <SelectItem key={professor.id} value={String(professor.id)}>{professor.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Capacidade</Label>
                <Input value={turmaForm.capacidadeMaxima} onChange={e => setTurmaForm(f => ({...f, capacidadeMaxima: e.target.value}))} type="number" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Nível</Label>
                <Select value={turmaForm.nivel} onValueChange={v => setTurmaForm(f => ({...f, nivel: v as any}))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTurmaModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!turmaForm.nome.trim()) { toast.error("Nome é obrigatório"); return; }
                createTurma.mutate({
                  nome: turmaForm.nome, nivel: turmaForm.nivel,
                  capacidade: Number(turmaForm.capacidadeMaxima),
                  modalidadeId: turmaForm.modalidadeId ? Number(turmaForm.modalidadeId) : undefined,
                  professorId: turmaForm.professorId ? Number(turmaForm.professorId) : undefined,
                  descricao: turmaForm.descricao || undefined,
                });
              }}
              disabled={createTurma.isPending}
            >
              Criar Turma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Horário */}
      <Dialog open={showHorarioModal} onOpenChange={setShowHorarioModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Novo Horário</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Turma *</Label>
              <Select value={horarioForm.turmaId} onValueChange={v => setHorarioForm(f => ({...f, turmaId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar turma" /></SelectTrigger>
                <SelectContent>
                  {(turmas ?? []).map(({ turma }) => <SelectItem key={turma.id} value={String(turma.id)}>{turma.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Professor</Label>
              <Select value={horarioForm.professorId} onValueChange={v => setHorarioForm(f => ({...f, professorId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar professor" /></SelectTrigger>
                <SelectContent>
                  {(professores ?? []).map(({ professor }) => <SelectItem key={professor.id} value={String(professor.id)}>{professor.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Dia da Semana *</Label>
              <Select value={horarioForm.diaSemana} onValueChange={v => setHorarioForm(f => ({...f, diaSemana: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar dia" /></SelectTrigger>
                <SelectContent>
                  {DIAS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Hora Início *</Label>
                <Input value={horarioForm.horaInicio} onChange={e => setHorarioForm(f => ({...f, horaInicio: e.target.value}))} type="time" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Hora Fim *</Label>
                <Input value={horarioForm.horaFim} onChange={e => setHorarioForm(f => ({...f, horaFim: e.target.value}))} type="time" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Sala / Local</Label>
              <Input value={horarioForm.sala} onChange={e => setHorarioForm(f => ({...f, sala: e.target.value}))} placeholder="ex: Tatame Principal" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHorarioModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!horarioForm.turmaId || !horarioForm.diaSemana || !horarioForm.horaInicio || !horarioForm.horaFim) { toast.error("Preencha os campos obrigatórios"); return; }
                createHorario.mutate({
                  turmaId: Number(horarioForm.turmaId),
                  diaSemana: horarioForm.diaSemana as "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo",
                  horaInicio: horarioForm.horaInicio, horaFim: horarioForm.horaFim,
                  local: horarioForm.sala || undefined,
                });
              }}
              disabled={createHorario.isPending}
            >
              Criar Horário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
