import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import { Award, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const BELT_CLASSES: Record<string, string> = {
  branca: "belt-branca", cinza: "belt-cinza", azul: "belt-azul",
  roxa: "belt-roxa", marrom: "belt-marrom", preta: "belt-preta",
  amarela: "belt-amarela", laranja: "belt-laranja", vermelha: "belt-vermelha", verde: "belt-verde",
};

export default function Graduacoes() {
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { data: graduacoes, refetch } = trpc.graduacoes.list.useQuery({});
  const { data: alunos } = trpc.alunos.list.useQuery({});
  const { data: modalidades } = trpc.modalidades.list.useQuery();
  const { data: professores } = trpc.professores.list.useQuery();

  const createMutation = trpc.graduacoes.create.useMutation({
    onSuccess: () => { toast.success("Graduação registada!"); setShowModal(false); refetch(); resetForm(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    alunoId: "", modalidadeId: "", faixaAnterior: "", faixaNova: "",
    corFaixa: "", dataGraduacao: "", avaliadorId: "", observacoes: "",
  });
  const resetForm = () => setForm({ alunoId: "", modalidadeId: "", faixaAnterior: "", faixaNova: "", corFaixa: "", dataGraduacao: "", avaliadorId: "", observacoes: "" });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sistema de Graduações"
        subtitle="Controlo de evolução técnica e faixas dos alunos"
        icon={<Award className="h-5 w-5" />}
        action={
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Nova Graduação
          </Button>
        }
      />

      <div className="space-y-2">
        {(graduacoes ?? []).map(({ graduacao, aluno, modalidade, avaliador }) => (
          <Card key={graduacao.id} className="border-border/60 bg-card/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 shrink-0">
                  {graduacao.faixaAnterior && (
                    <>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${BELT_CLASSES[graduacao.faixaAnterior.toLowerCase()] ?? "bg-muted text-foreground"}`}>
                        {graduacao.faixaAnterior}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${BELT_CLASSES[graduacao.faixaNova.toLowerCase()] ?? "bg-primary text-primary-foreground"}`}>
                    {graduacao.faixaNova}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setLocation(`/alunos/${aluno?.id}`)}
                  >
                    {aluno?.nome ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">{modalidade?.nome} {avaliador ? `· Avaliador: ${avaliador.nome}` : ""}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{String(graduacao.dataGraduacao ?? "")}</p>
                </div>
              </div>
              {graduacao.observacoes && (
                <p className="text-xs text-muted-foreground mt-2 pl-2 border-l border-border">{graduacao.observacoes}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {(graduacoes ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Award className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Sem graduações registadas</p>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova Graduação</DialogTitle></DialogHeader>
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
              <Label className="text-xs">Modalidade *</Label>
              <Select value={form.modalidadeId} onValueChange={v => setForm(f => ({...f, modalidadeId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {(modalidades ?? []).map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Faixa Anterior</Label>
                <Input value={form.faixaAnterior} onChange={e => setForm(f => ({...f, faixaAnterior: e.target.value}))} placeholder="ex: Branca" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Faixa Nova *</Label>
                <Input value={form.faixaNova} onChange={e => setForm(f => ({...f, faixaNova: e.target.value}))} placeholder="ex: Azul" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Data da Graduação *</Label>
              <Input value={form.dataGraduacao} onChange={e => setForm(f => ({...f, dataGraduacao: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Avaliador</Label>
              <Select value={form.avaliadorId} onValueChange={v => setForm(f => ({...f, avaliadorId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Professor avaliador" /></SelectTrigger>
                <SelectContent>
                  {(professores ?? []).map(({ professor }) => <SelectItem key={professor.id} value={String(professor.id)}>{professor.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Observações</Label>
              <Input value={form.observacoes} onChange={e => setForm(f => ({...f, observacoes: e.target.value}))} placeholder="Notas sobre a graduação" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!form.alunoId || !form.faixaNova || !form.dataGraduacao || !form.modalidadeId) { toast.error("Preencha os campos obrigatórios"); return; }
                createMutation.mutate({
                  alunoId: Number(form.alunoId), modalidadeId: Number(form.modalidadeId),
                  faixaNova: form.faixaNova, dataGraduacao: form.dataGraduacao,
                  faixaAnterior: form.faixaAnterior || undefined,
                  avaliadorId: form.avaliadorId ? Number(form.avaliadorId) : undefined,
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
