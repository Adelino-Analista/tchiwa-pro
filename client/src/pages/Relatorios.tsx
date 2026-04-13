import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import { BarChart3, TrendingUp, Users, DollarSign, AlertTriangle, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

const PIE_COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#22c55e", "#eab308", "#ef4444"];

export default function Relatorios() {
  const hoje = new Date();
  const [anoFiltro] = useState(hoje.getFullYear());

  const { data: stats } = trpc.dashboard.stats.useQuery();
  const { data: faturamento } = trpc.dashboard.faturamentoMensal.useQuery();
  const { data: inadimplentes } = trpc.dashboard.inadimplentes.useQuery();
  const { data: alunos } = trpc.alunos.list.useQuery({});
  const { data: graduacoes } = trpc.graduacoes.list.useQuery({});

  // Faturamento por mês (últimos 12)
  const faturamentoChart = (faturamento ?? [])
    .slice(0, 12)
    .reverse()
    .map(f => ({
      mes: f.mes ? MONTH_LABELS[f.mes.split("-")[1]] ?? f.mes : "—",
      pago: Number(f.total ?? 0),
      pendente: 0,
    }));

  // Distribuição de status dos alunos
  const statusCounts: Record<string, number> = {};
  (alunos ?? []).forEach(({ aluno }) => {
    statusCounts[aluno.status] = (statusCounts[aluno.status] ?? 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Distribuição de faixas
  const faixaCounts: Record<string, number> = {};
  (graduacoes ?? []).forEach(({ graduacao }) => {
    const faixa = graduacao.faixaNova;
    faixaCounts[faixa] = (faixaCounts[faixa] ?? 0) + 1;
  });
  const faixaData = Object.entries(faixaCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        subtitle="Análises e métricas da academia"
        icon={<BarChart3 className="h-5 w-5" />}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Alunos Ativos", value: stats?.alunosAtivos ?? "—", icon: Users, color: "text-blue-400" },
          { label: "Inadimplentes", value: stats?.inadimplentes ?? "—", icon: AlertTriangle, color: "text-red-400" },
          { label: "Taxa de Frequência", value: stats?.frequencia ? `${stats.frequencia.taxa}%` : "—", icon: Activity, color: "text-primary" },
          { label: "Graduações", value: (graduacoes ?? []).length, icon: TrendingUp, color: "text-emerald-400" },
        ].map(item => (
          <Card key={item.label} className="border-border/60 bg-card/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
                <item.icon className={`h-8 w-8 opacity-20 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Faturamento */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Faturamento Mensal — Pago vs Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faturamentoChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={faturamentoChart} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.014 240)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.55 0.012 240)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.55 0.012 240)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "oklch(0.13 0.014 240)", border: "1px solid oklch(0.22 0.014 240)", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v: number) => [`AOA ${v.toLocaleString("pt-AO")}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="pago" name="Pago" fill="oklch(0.60 0.15 145)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendente" name="Pendente" fill="oklch(0.68 0.18 45)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
              Sem dados de faturamento
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos de pizza */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Status dos Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "oklch(0.13 0.014 240)", border: "1px solid oklch(0.22 0.014 240)", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">Sem dados</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Distribuição de Faixas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {faixaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={faixaData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.014 240)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.55 0.012 240)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.55 0.012 240)" }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: "oklch(0.13 0.014 240)", border: "1px solid oklch(0.22 0.014 240)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="value" name="Alunos" fill="oklch(0.68 0.18 45)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">Sem dados de graduações</div>
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
              Relatório de Inadimplência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(inadimplentes ?? []).map(item => (
                <div key={item.pagamento.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div>
                    <p className="text-sm font-medium">{item.aluno?.nome ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{item.pagamento.descricao}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-400">AOA {Number(item.pagamento.valor).toLocaleString("pt-AO")}</p>
                    <p className="text-xs text-muted-foreground">Venc. {String(item.pagamento.dataVencimento ?? "")}</p>
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
