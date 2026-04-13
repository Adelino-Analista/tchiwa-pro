import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingDown, Award, DollarSign } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const clientesData = [
  { mes: "Jan", novos: 12, ativos: 145, inativos: 8 },
  { mes: "Fev", novos: 15, ativos: 158, inativos: 5 },
  { mes: "Mar", novos: 18, ativos: 172, inativos: 4 },
  { mes: "Abr", novos: 14, ativos: 184, inativos: 2 },
  { mes: "Mai", novos: 16, ativos: 198, inativos: 2 },
  { mes: "Jun", novos: 22, ativos: 218, inativos: 2 },
];

const satisfacao = [
  { nome: "Muito Satisfeito", value: 142, color: "#10b981" },
  { nome: "Satisfeito", value: 58, color: "#3b82f6" },
  { nome: "Neutro", value: 12, color: "#f59e0b" },
  { nome: "Insatisfeito", value: 6, color: "#ef4444" },
];

export default function DashboardClientes() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard Clientes" subtitle="Análise de clientes, retenção e satisfação" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">218</div>
            <p className="text-xs text-muted-foreground">+20 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Retenção</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">Excelente performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8%</div>
            <p className="text-xs text-muted-foreground">Abaixo da meta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.450</div>
            <p className="text-xs text-muted-foreground">Valor vitalício</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Clientes</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="novos" fill="#3b82f6" name="Novos" />
                <Bar dataKey="ativos" fill="#10b981" name="Ativos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfação do Cliente</CardTitle>
            <CardDescription>Distribuição de feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={satisfacao} cx="50%" cy="50%" labelLine={false} label={({ nome, value }) => `${nome}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {satisfacao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes Ativos vs Inativos</CardTitle>
          <CardDescription>Evolução mensal</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ativos" stroke="#10b981" name="Ativos" strokeWidth={2} />
              <Line type="monotone" dataKey="inativos" stroke="#ef4444" name="Inativos" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
