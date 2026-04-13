import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, DollarSign, ClipboardList, Award, Edit, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

const STATUS_CLASSES: Record<string, string> = {
  ativo: "status-ativo", inativo: "status-inativo",
  suspenso: "status-suspenso", trancado: "status-atrasado",
};

const BELT_CLASSES: Record<string, string> = {
  branca: "belt-branca", cinza: "belt-cinza", azul: "belt-azul",
  roxa: "belt-roxa", marrom: "belt-marrom", preta: "belt-preta",
  amarela: "belt-amarela", laranja: "belt-laranja", vermelha: "belt-vermelha", verde: "belt-verde",
};

export default function AlunoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGraduacaoModal, setShowGraduacaoModal] = useState(false);
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);

  const alunoId = Number(id);
  const { data: alunoData, refetch } = trpc.alunos.byId.useQuery({ id: alunoId });
  const { data: pagamentos } = trpc.pagamentos.list.useQuery({ alunoId });
  const { data: presencas } = trpc.presencas.list.useQuery({ alunoId });
  const { data: graduacoes } = trpc.graduacoes.list.useQuery({ alunoId });
  const { data: modalidades } = trpc.modalidades.list.useQuery();
  const { data: professores } = trpc.professores.list.useQuery();

  const updateMutation = trpc.alunos.update.useMutation({
    onSuccess: () => { toast.success("Aluno atualizado!"); setShowEditModal(false); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const createGraduacao = trpc.graduacoes.create.useMutation({
    onSuccess: () => { toast.success("Graduação registada!"); setShowGraduacaoModal(false); },
    onError: (e) => toast.error(e.message),
  });

  const createPagamento = trpc.pagamentos.create.useMutation({
    onSuccess: () => { toast.success("Pagamento registado!"); setShowPagamentoModal(false); },
    onError: (e) => toast.error(e.message),
  });

  const [editForm, setEditForm] = useState({ status: "ativo" as any, observacoes: "" });
  const [gradForm, setGradForm] = useState({ faixaAnterior: "", faixaNova: "", corFaixa: "", dataGraduacao: "", avaliadorId: "", modalidadeId: "", observacoes: "" });
  const [pagForm, setPagForm] = useState({ descricao: "", valor: "", dataVencimento: "", referenciaMes: "", metodoPagamento: "pix" as any, status: "pendente" as any });

  const aluno = alunoData?.aluno;
  const modalidade = alunoData?.modalidade;

  if (!aluno) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Aluno não encontrado</p>
      </div>
    );
  }

  const ultimaGraduacao = (graduacoes ?? [])[0];
  const totalPago = (pagamentos ?? []).filter(p => p.pagamento.status === "pago").reduce((s, p) => s + Number(p.pagamento.valor), 0);
  const totalPendente = (pagamentos ?? []).filter(p => p.pagamento.status === "pendente" || p.pagamento.status === "atrasado").reduce((s, p) => s + Number(p.pagamento.valor), 0);
  const presencasCount = (presencas ?? []).filter(p => p.presenca.presente).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/alunos")} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{aluno.nome}</h1>
          <p className="text-sm text-muted-foreground">{modalidade?.nome ?? "Sem modalidade"}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLASSES[aluno.status]}`}>
            {aluno.status}
          </span>
          <Button size="sm" variant="outline" onClick={() => { setEditForm({ status: aluno.status, observacoes: aluno.observacoes ?? "" }); setShowEditModal(true); }}>
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Faixa Atual</p>
            {ultimaGraduacao ? (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${BELT_CLASSES[ultimaGraduacao.graduacao.faixaNova.toLowerCase()] ?? "bg-muted text-foreground"}`}>
                {ultimaGraduacao.graduacao.faixaNova}
              </span>
            ) : (
              <p className="text-sm font-semibold text-muted-foreground">Sem faixa</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Pago</p>
            <p className="text-sm font-bold text-emerald-400">AOA {totalPago.toLocaleString("pt-AO")}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Pendente</p>
            <p className={`text-sm font-bold ${totalPendente > 0 ? "text-red-400" : "text-muted-foreground"}`}>
              AOA {totalPendente.toLocaleString("pt-AO")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Presenças</p>
            <p className="text-sm font-bold text-primary">{presencasCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="perfil">
        <TabsList className="bg-card border border-border/60">
          <TabsTrigger value="perfil"><User className="h-4 w-4 mr-1.5" />Perfil</TabsTrigger>
          <TabsTrigger value="financeiro"><DollarSign className="h-4 w-4 mr-1.5" />Financeiro</TabsTrigger>
          <TabsTrigger value="presencas"><ClipboardList className="h-4 w-4 mr-1.5" />Frequência</TabsTrigger>
          <TabsTrigger value="graduacoes"><Award className="h-4 w-4 mr-1.5" />Graduações</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil" className="mt-4">
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: "Email", value: aluno.email },
                { icon: Phone, label: "Telefone", value: aluno.telefone },
                { icon: Calendar, label: "Data de Nascimento", value: aluno.dataNascimento ? String(aluno.dataNascimento) : null },
                { icon: MapPin, label: "Endereço", value: aluno.endereco },
                { icon: User, label: "Responsável", value: aluno.responsavel },
                { icon: Phone, label: "Tel. Responsável", value: aluno.telefoneResponsavel },
                { icon: Calendar, label: "Data de Matrícula", value: aluno.dataMatricula ? String(aluno.dataMatricula) : null },
                { icon: DollarSign, label: "Mensalidade", value: aluno.valorMensalidade ? `AOA ${Number(aluno.valorMensalidade).toLocaleString("pt-AO")}` : null },
              ].map(({ icon: Icon, label, value }) => value ? (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ) : null)}
              {aluno.observacoes && (
                <div className="col-span-full">
                  <p className="text-xs text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm bg-accent/30 rounded-lg p-3">{aluno.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financeiro" className="mt-4">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => setShowPagamentoModal(true)} className="gap-2">
              <DollarSign className="h-4 w-4" /> Registar Pagamento
            </Button>
          </div>
          <div className="space-y-2">
            {(pagamentos ?? []).map(({ pagamento }) => (
              <div key={pagamento.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/60">
                <div>
                  <p className="text-sm font-medium">{pagamento.descricao}</p>
                  <p className="text-xs text-muted-foreground">Venc: {String(pagamento.dataVencimento ?? "")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">AOA {Number(pagamento.valor).toLocaleString("pt-AO")}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium status-${pagamento.status}`}>
                    {pagamento.status}
                  </span>
                </div>
              </div>
            ))}
            {(pagamentos ?? []).length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">Sem pagamentos registados</div>
            )}
          </div>
        </TabsContent>

        {/* Presenças */}
        <TabsContent value="presencas" className="mt-4">
          <div className="space-y-2">
            {(presencas ?? []).slice(0, 20).map(({ presenca, turma }) => (
              <div key={presenca.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/60">
                <div>
                  <p className="text-sm font-medium">{turma?.nome ?? "Turma"}</p>
                  <p className="text-xs text-muted-foreground">{String(presenca.data ?? "")}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${presenca.presente ? "status-ativo" : "status-atrasado"}`}>
                  {presenca.presente ? "Presente" : "Ausente"}
                </span>
              </div>
            ))}
            {(presencas ?? []).length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">Sem registos de frequência</div>
            )}
          </div>
        </TabsContent>

        {/* Graduações */}
        <TabsContent value="graduacoes" className="mt-4">
          <div className="flex justify-end mb-3">
            <Button size="sm" onClick={() => setShowGraduacaoModal(true)} className="gap-2">
              <Award className="h-4 w-4" /> Nova Graduação
            </Button>
          </div>
          <div className="space-y-2">
            {(graduacoes ?? []).map(({ graduacao, avaliador, modalidade: mod }) => (
              <div key={graduacao.id} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border/60">
                <div className="flex items-center gap-2">
                  {graduacao.faixaAnterior && (
                    <>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${BELT_CLASSES[graduacao.faixaAnterior.toLowerCase()] ?? "bg-muted"}`}>
                        {graduacao.faixaAnterior}
                      </span>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${BELT_CLASSES[graduacao.faixaNova.toLowerCase()] ?? "bg-primary text-primary-foreground"}`}>
                    {graduacao.faixaNova}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{mod?.nome}</p>
                  {avaliador && <p className="text-xs text-muted-foreground">Avaliador: {avaliador.nome}</p>}
                </div>
                <p className="text-xs text-muted-foreground shrink-0">{String(graduacao.dataGraduacao ?? "")}</p>
              </div>
            ))}
            {(graduacoes ?? []).length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">Sem graduações registadas</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Editar */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Editar Aluno</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={editForm.status} onValueChange={v => setEditForm(f => ({...f, status: v}))}>
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
              <Label className="text-xs">Observações</Label>
              <Input value={editForm.observacoes} onChange={e => setEditForm(f => ({...f, observacoes: e.target.value}))} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancelar</Button>
            <Button onClick={() => updateMutation.mutate({ id: alunoId, ...editForm })} disabled={updateMutation.isPending}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Graduação */}
      <Dialog open={showGraduacaoModal} onOpenChange={setShowGraduacaoModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registar Graduação</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Modalidade *</Label>
              <Select value={gradForm.modalidadeId} onValueChange={v => setGradForm(f => ({...f, modalidadeId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {(modalidades ?? []).map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Faixa Anterior</Label>
                <Input value={gradForm.faixaAnterior} onChange={e => setGradForm(f => ({...f, faixaAnterior: e.target.value}))} placeholder="ex: Branca" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Faixa Nova *</Label>
                <Input value={gradForm.faixaNova} onChange={e => setGradForm(f => ({...f, faixaNova: e.target.value}))} placeholder="ex: Azul" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Data da Graduação *</Label>
              <Input value={gradForm.dataGraduacao} onChange={e => setGradForm(f => ({...f, dataGraduacao: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Avaliador</Label>
              <Select value={gradForm.avaliadorId} onValueChange={v => setGradForm(f => ({...f, avaliadorId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar professor" /></SelectTrigger>
                <SelectContent>
                  {(professores ?? []).map(({ professor }) => <SelectItem key={professor.id} value={String(professor.id)}>{professor.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGraduacaoModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!gradForm.faixaNova || !gradForm.dataGraduacao || !gradForm.modalidadeId) { toast.error("Preencha os campos obrigatórios"); return; }
                createGraduacao.mutate({
                  alunoId, faixaNova: gradForm.faixaNova, dataGraduacao: gradForm.dataGraduacao,
                  modalidadeId: Number(gradForm.modalidadeId),
                  faixaAnterior: gradForm.faixaAnterior || undefined,
                  avaliadorId: gradForm.avaliadorId ? Number(gradForm.avaliadorId) : undefined,
                });
              }}
              disabled={createGraduacao.isPending}
            >
              Registar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Pagamento */}
      <Dialog open={showPagamentoModal} onOpenChange={setShowPagamentoModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registar Pagamento</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Descrição *</Label>
              <Input value={pagForm.descricao} onChange={e => setPagForm(f => ({...f, descricao: e.target.value}))} placeholder="ex: Mensalidade Março/2026" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Valor (AOA) *</Label>
                <Input value={pagForm.valor} onChange={e => setPagForm(f => ({...f, valor: e.target.value}))} placeholder="0.00" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Referência (Mês)</Label>
                <Input value={pagForm.referenciaMes} onChange={e => setPagForm(f => ({...f, referenciaMes: e.target.value}))} placeholder="2026-03" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Data de Vencimento *</Label>
              <Input value={pagForm.dataVencimento} onChange={e => setPagForm(f => ({...f, dataVencimento: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={pagForm.status} onValueChange={v => setPagForm(f => ({...f, status: v as any}))}>
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
                <Select value={pagForm.metodoPagamento} onValueChange={v => setPagForm(f => ({...f, metodoPagamento: v as any}))}>
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
            <Button variant="outline" onClick={() => setShowPagamentoModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!pagForm.descricao || !pagForm.valor || !pagForm.dataVencimento) { toast.error("Preencha os campos obrigatórios"); return; }
                createPagamento.mutate({ alunoId, ...pagForm });
              }}
              disabled={createPagamento.isPending}
            >
              Registar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
