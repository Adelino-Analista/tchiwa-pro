import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Activity, Target } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const leadsData = [
  { mes: "Jan", novos: 45, convertidos: 12, taxa: "26.7%" },
  { mes: "Fev", novos: 52, convertidos: 18, taxa: "34.6%" },
  { mes: "Mar", novos: 48, convertidos: 15, taxa: "31.2%" },
  { mes: "Abr", novos: 61, convertidos: 22, taxa: "36.1%" },
  { mes: "Mai", novos: 55, convertidos: 19, taxa: "34.5%" },
  { mes: "Jun", novos: 67, convertidos: 26, taxa: "38.8%" },
];

const statusLeads = [
  { name: "Qualificado", value: 34, color: "#10b981" },
  { name: "Em Negociação", value: 28, color: "#f59e0b" },
  { name: "Proposta", value: 18, color: "#3b82f6" },
  { name: "Perdido", value: 12, color: "#ef4444" },
];

const atividades = [
  { tipo: "E-mail", total: 156, concluídas: 142 },
  { tipo: "Telefone", total: 89, concluídas: 87 },
  { tipo: "WhatsApp", total: 203, concluídas: 195 },
  { tipo: "Reunião", total: 34, concluídas: 32 },
];

export default function DashboardCRM() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard CRM" subtitle="Visão geral de leads, conversões e atividades comerciais" />

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Totais</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">487</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482</div>
            <p className="text-xs text-muted-foreground">Concluídas este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">Em negociação ativa</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads por Mês */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Novos vs Convertidos</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="novos" fill="#3b82f6" name="Novos Leads" />
                <Bar dataKey="convertidos" fill="#10b981" name="Convertidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status dos Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Estado atual dos leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusLeads} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {statusLeads.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Taxa de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Conversão por Mês</CardTitle>
          <CardDescription>Evolução da eficiência comercial</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="taxa" stroke="#f59e0b" name="Taxa (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Atividades por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades por Canal</CardTitle>
          <CardDescription>Distribuição de contatos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atividades.map((atividade) => (
              <div key={atividade.tipo} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{atividade.tipo}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(atividade.concluídas / atividade.total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">{atividade.concluídas}/{atividade.total}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
