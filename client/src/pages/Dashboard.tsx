import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import {
  Users, DollarSign, TrendingUp, AlertTriangle,
  LayoutDashboard, Activity, Calendar, Award,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { useLocation } from "wouter";

const BELT_COLORS: Record<string, string> = {
  branca: "#ffffff", cinza: "#9ca3af", azul: "#3b82f6",
  roxa: "#8b5cf6", marrom: "#92400e", preta: "#374151",
  amarela: "#eab308", laranja: "#f97316", vermelha: "#ef4444", verde: "#22c55e",
};

function MetricCard({
  title, value, subtitle, icon: Icon, trend, color = "primary",
}: {
  title: string; value: string | number; subtitle?: string;
  icon: any; trend?: string; color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "text-primary bg-primary/10 border-primary/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };
  return (
    <Card className="metric-card border-border/60 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && <p className="text-xs text-emerald-400 mt-1 font-medium">{trend}</p>}
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${colorMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const { data: faturamento } = trpc.dashboard.faturamentoMensal.useQuery();
  const { data: inadimplentes } = trpc.dashboard.inadimplentes.useQuery();
  const { data: horarios } = trpc.horarios.list.useQuery();

  const faturamentoChart = (faturamento ?? [])
    .slice(0, 6)
    .reverse()
    .map(f => ({
      mes: f.mes ? MONTH_LABELS[f.mes.split("-")[1]] ?? f.mes : "—",
      valor: Number(f.total ?? 0),
    }));

  const hoje = new Date();
  const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  const diaHoje = diasSemana[hoje.getDay()];
  const aulasHoje = (horarios ?? []).filter(h => h.horario.diaSemana === diaHoje);

  const faturamentoMes = stats?.faturamentoMes;
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Visão geral da academia — ${hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" } as Intl.DateTimeFormatOptions)}`}
        icon={<LayoutDashboard className="h-5 w-5" />}
      />

      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Alunos Ativos"
          value={stats?.alunosAtivos ?? "—"}
          subtitle="Total matriculados"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Faturamento Mês"
          value={faturamentoMes ? `AOA ${Number(faturamentoMes.pago).toLocaleString("pt-AO")}` : "—"}
          subtitle={`Pendente: AOA ${Number(faturamentoMes?.pendente ?? 0).toLocaleString("pt-AO")}`}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Taxa de Frequência"
          value={stats?.frequencia ? `${stats.frequencia.taxa}%` : "—"}
          subtitle="Últimos 30 dias"
          icon={Activity}
          color="primary"
        />
        <MetricCard
          title="Inadimplentes"
          value={stats?.inadimplentes ?? "—"}
          subtitle="Mensalidades em atraso"
          icon={AlertTriangle}
          color={stats?.inadimplentes ? "red" : "green"}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Faturamento */}
        <Card className="lg:col-span-2 border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Faturamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faturamentoChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={faturamentoChart}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.014 240)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.55 0.012 240)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.55 0.012 240)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "oklch(0.13 0.014 240)", border: "1px solid oklch(0.22 0.014 240)", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v: number) => [`AOA ${v.toLocaleString("pt-AO")}`, "Faturamento"]}
                  />
                  <Area type="monotone" dataKey="valor" stroke="oklch(0.68 0.18 45)" strokeWidth={2} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Sem dados de faturamento ainda
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aulas de hoje */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Aulas de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aulasHoje.length > 0 ? (
              <div className="space-y-2">
                {aulasHoje.slice(0, 5).map(h => (
                  <div key={h.horario.id} className="flex items-center gap-3 p-2 rounded-lg bg-accent/30">
                    <div className="text-center shrink-0">
                      <p className="text-xs font-bold text-primary">{h.horario.horaInicio}</p>
                      <p className="text-[10px] text-muted-foreground">{h.horario.horaFim}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{h.turma?.nome ?? "Turma"}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{h.professor?.nome ?? "—"}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[180px] flex flex-col items-center justify-center text-muted-foreground">
                <Calendar className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">Sem aulas hoje</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inadimplentes */}
      {(inadimplentes?.length ?? 0) > 0 && (
        <Card className="border-red-500/20 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              Alunos com Mensalidades em Atraso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(inadimplentes ?? []).slice(0, 5).map(item => (
                <div
                  key={item.pagamento.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10 cursor-pointer hover:bg-red-500/10 transition-colors"
                  onClick={() => setLocation(`/alunos/${item.aluno?.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium">{item.aluno?.nome ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{item.pagamento.descricao}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-400">AOA {Number(item.pagamento.valor).toLocaleString("pt-AO")}</p>
                    <p className="text-xs text-muted-foreground">Venc. {String(item.pagamento.dataVencimento ?? '')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
