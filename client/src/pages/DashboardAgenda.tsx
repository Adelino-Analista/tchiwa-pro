import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const agendaData = [
  { dia: "Seg", aulas: 8, ocupacao: 92, canceladas: 0 },
  { dia: "Ter", aulas: 9, ocupacao: 88, canceladas: 1 },
  { dia: "Qua", aulas: 8, ocupacao: 95, canceladas: 0 },
  { dia: "Qui", aulas: 10, ocupacao: 90, canceladas: 0 },
  { dia: "Sex", aulas: 9, ocupacao: 93, canceladas: 0 },
  { dia: "Sab", aulas: 6, ocupacao: 87, canceladas: 1 },
];

const locacoes = [
  { nome: "Sala 1", capacidade: 20, ocupacao: 18, taxa: "90%" },
  { nome: "Sala 2", capacidade: 25, ocupacao: 23, taxa: "92%" },
  { nome: "Sala 3", capacidade: 15, ocupacao: 14, taxa: "93%" },
  { nome: "Quadra", capacidade: 40, ocupacao: 36, taxa: "90%" },
];

export default function DashboardAgenda() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard Agenda" subtitle="Visualização de aulas, ocupação de espaços e agendamentos" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas Semana</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50</div>
            <p className="text-xs text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupação Média</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Ótima utilização</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locações Ativas</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Espaços disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aulas por Dia</CardTitle>
            <CardDescription>Semana atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agendaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="aulas" fill="#3b82f6" name="Aulas" />
                <Bar dataKey="canceladas" fill="#ef4444" name="Canceladas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Ocupação</CardTitle>
            <CardDescription>Por dia da semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={agendaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ocupacao" stroke="#10b981" name="Ocupação (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ocupação por Locação</CardTitle>
          <CardDescription>Utilização de espaços</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locacoes.map((loc) => (
              <div key={loc.nome} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{loc.nome}</p>
                  <p className="text-sm text-muted-foreground">{loc.ocupacao}/{loc.capacidade} pessoas</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: loc.taxa }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium">{loc.taxa}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
