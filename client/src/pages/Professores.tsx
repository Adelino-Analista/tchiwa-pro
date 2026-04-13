import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import { UserCheck, Plus, Phone, Mail, Star } from "lucide-react";
import { toast } from "sonner";

export default function Professores() {
  const [showModal, setShowModal] = useState(false);
  const { data: professores, refetch } = trpc.professores.list.useQuery();
  const { data: modalidades } = trpc.modalidades.list.useQuery();

  const createMutation = trpc.professores.create.useMutation({
    onSuccess: () => { toast.success("Professor cadastrado!"); setShowModal(false); refetch(); resetForm(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", cpf: "", especialidades: "",
    faixaGraduacao: "", modalidadeId: "", status: "ativo" as const, bio: "", dataAdmissao: "",
  });
  const resetForm = () => setForm({ nome: "", email: "", telefone: "", cpf: "", especialidades: "", faixaGraduacao: "", modalidadeId: "", status: "ativo", bio: "", dataAdmissao: "" });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gestão de Professores"
        subtitle={`${professores?.length ?? 0} professores cadastrados`}
        icon={<UserCheck className="h-5 w-5" />}
        action={
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Professor
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {(professores ?? []).map(({ professor, modalidade }) => (
          <Card key={professor.id} className="border-border/60 bg-card/80 hover:border-primary/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-primary">{professor.nome.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm truncate">{professor.nome}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${professor.status === "ativo" ? "status-ativo" : "status-inativo"}`}>
                      {professor.status}
                    </span>
                  </div>
                  {modalidade && <p className="text-xs text-primary/80 mb-2">{modalidade.nome}</p>}
                  {professor.faixaGraduacao && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">{professor.faixaGraduacao}</span>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {professor.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" /><span className="truncate">{professor.email}</span>
                      </div>
                    )}
                    {professor.telefone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /><span>{professor.telefone}</span>
                      </div>
                    )}
                  </div>
                  {professor.especialidades && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{professor.especialidades}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(professores ?? []).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
            <UserCheck className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Nenhum professor cadastrado</p>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Cadastrar Professor</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2">
              <Label className="text-xs">Nome Completo *</Label>
              <Input value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))} placeholder="Nome do professor" className="mt-1" />
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
              <Label className="text-xs">Faixa / Graduação</Label>
              <Input value={form.faixaGraduacao} onChange={e => setForm(f => ({...f, faixaGraduacao: e.target.value}))} placeholder="ex: Faixa Preta 3º Dan" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Modalidade Principal</Label>
              <Select value={form.modalidadeId} onValueChange={v => setForm(f => ({...f, modalidadeId: v}))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {(modalidades ?? []).map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Especialidades</Label>
              <Input value={form.especialidades} onChange={e => setForm(f => ({...f, especialidades: e.target.value}))} placeholder="ex: Jiu-Jitsu, Defesa Pessoal, Competição" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Data de Admissão</Label>
              <Input value={form.dataAdmissao} onChange={e => setForm(f => ({...f, dataAdmissao: e.target.value}))} type="date" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v as any}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Bio / Apresentação</Label>
              <Input value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} placeholder="Breve descrição do professor" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
                createMutation.mutate({ ...form, modalidadeId: form.modalidadeId ? Number(form.modalidadeId) : undefined });
              }}
              disabled={createMutation.isPending}
            >
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
