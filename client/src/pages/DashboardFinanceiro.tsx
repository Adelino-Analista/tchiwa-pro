import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, AlertCircle, CreditCard } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const faturamentoData = [
  { mes: "Jan", receita: 45000, despesa: 18000, lucro: 27000 },
  { mes: "Fev", receita: 52000, despesa: 19500, lucro: 32500 },
  { mes: "Mar", receita: 58000, despesa: 21000, lucro: 37000 },
  { mes: "Abr", receita: 61000, despesa: 22500, lucro: 38500 },
  { mes: "Mai", receita: 67000, despesa: 24000, lucro: 43000 },
  { mes: "Jun", receita: 75000, despesa: 26000, lucro: 49000 },
];

const receitas = [
  { nome: "Mensalidades", value: 65, color: "#10b981" },
  { nome: "Produtos", value: 20, color: "#3b82f6" },
  { nome: "Serviços", value: 10, color: "#f59e0b" },
  { nome: "Outros", value: 5, color: "#8b5cf6" },
];

export default function DashboardFinanceiro() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard Financeiro" subtitle="Análise de faturamento, despesas e lucratividade" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 75.000</div>
            <p className="text-xs text-muted-foreground">+11.9% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 26.000</div>
            <p className="text-xs text-muted-foreground">+8.3% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 49.000</div>
            <p className="text-xs text-muted-foreground">+14.0% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.500</div>
            <p className="text-xs text-muted-foreground">12 clientes atrasados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Despesa</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="receita" fill="#10b981" name="Receita" />
                <Bar dataKey="despesa" fill="#ef4444" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composição de Receitas</CardTitle>
            <CardDescription>Distribuição por fonte</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={receitas} cx="50%" cy="50%" labelLine={false} label={({ nome, value }) => `${nome}: ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {receitas.map((entry, index) => (
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
          <CardTitle>Lucro Mensal</CardTitle>
          <CardDescription>Evolução da lucratividade</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={faturamentoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value}`} />
              <Legend />
              <Line type="monotone" dataKey="lucro" stroke="#10b981" name="Lucro" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
