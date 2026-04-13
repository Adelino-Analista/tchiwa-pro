import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";

export default function MinhaFrequencia() {
  const { data: presencas } = trpc.presencas.list.useQuery({});

  const total = presencas?.length ?? 0;
  const presentes = (presencas ?? []).filter(p => p.presenca.presente).length;
  const taxa = total > 0 ? Math.round((presentes / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Minha Frequência"
        subtitle="Histórico de presenças nas aulas"
        icon={<ClipboardList className="h-5 w-5" />}
      />
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Presenças</p>
            <p className="text-2xl font-bold text-emerald-400">{presentes}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Ausências</p>
            <p className="text-2xl font-bold text-red-400">{total - presentes}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Taxa</p>
            <p className="text-2xl font-bold text-primary">{taxa}%</p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        {(presencas ?? []).map(({ presenca, turma }) => (
          <div key={presenca.id} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border/60">
            {presenca.presente
              ? <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              : <XCircle className="h-5 w-5 text-red-400 shrink-0" />
            }
            <div className="flex-1">
              <p className="text-sm font-medium">{turma?.nome ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{String(presenca.data ?? "")}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${presenca.presente ? "status-ativo" : "status-atrasado"}`}>
              {presenca.presente ? "Presente" : "Ausente"}
            </span>
          </div>
        ))}
        {(presencas ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Sem registos de frequência</p>
          </div>
        )}
      </div>
    </div>
  );
}
