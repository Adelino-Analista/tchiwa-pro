import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { LayoutDashboard, DollarSign, ClipboardList, Award, User } from "lucide-react";

const BELT_CLASSES: Record<string, string> = {
  branca: "belt-branca", cinza: "belt-cinza", azul: "belt-azul",
  roxa: "belt-roxa", marrom: "belt-marrom", preta: "belt-preta",
  amarela: "belt-amarela", laranja: "belt-laranja", vermelha: "belt-vermelha", verde: "belt-verde",
};

export default function MeuPainel() {
  const { user } = useAuth();
  const { data: stats } = trpc.dashboard.stats.useQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${user?.name?.split(" ")[0] ?? "Aluno"}!`}
        subtitle="Bem-vindo ao seu painel pessoal"
        icon={<LayoutDashboard className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-bold text-emerald-400">Ativo</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Frequência</p>
              <p className="text-sm font-bold">{stats?.frequencia?.taxa ?? "—"}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 col-span-2 lg:col-span-1">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Graduação</p>
              <p className="text-sm font-bold">Ver histórico</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardContent className="p-6 text-center">
          <Award className="h-12 w-12 mx-auto mb-3 text-primary/30" />
          <p className="text-sm text-muted-foreground">
            Use o menu lateral para aceder às suas mensalidades, frequência e graduações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
