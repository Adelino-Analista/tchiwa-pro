import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, Calendar } from "lucide-react";

const ocupacoesDemo = [
  { id: 1, locacao: "Sala 1", turma: "Karatê Infantil", horario: "14:00 - 15:00", dias: "Seg, Qua, Sex", ocupacao: "18/20", status: "Ativa" },
  { id: 2, locacao: "Sala 2", turma: "Muay Thai", horario: "19:00 - 20:00", dias: "Ter, Qui", ocupacao: "23/25", status: "Ativa" },
  { id: 3, locacao: "Quadra", turma: "Futsal", horario: "20:00 - 21:30", dias: "Seg, Qua, Sex", ocupacao: "36/40", status: "Ativa" },
  { id: 4, locacao: "Sala 3", turma: "Yoga", horario: "10:00 - 11:00", dias: "Ter, Qui", ocupacao: "14/15", status: "Ativa" },
  { id: 5, locacao: "Sala 1", turma: "Pilates", horario: "18:00 - 19:00", dias: "Seg, Qua, Sex", ocupacao: "0/20", status: "Inativa" },
];

const statusColors = {
  "Ativa": "bg-green-100 text-green-800",
  "Inativa": "bg-gray-100 text-gray-800",
};

export default function Ocupacao() {
  const totalOcupacoes = ocupacoesDemo.length;
  const ocupacoesAtivas = ocupacoesDemo.filter(o => o.status === "Ativa").length;

  return (
    <div className="space-y-8">
      <PageHeader title="Grade de Ocupação" subtitle="Visualizar e gerenciar ocupação de espaços" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ocupações</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOcupacoes}</div>
            <p className="text-xs text-muted-foreground">Registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ocupacoesAtivas}</div>
            <p className="text-xs text-muted-foreground">Em funcionamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Ocupação Média</CardTitle>
            <div className="h-4 w-4 rounded-full bg-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Utilização</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocupação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade de Horários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Locação</th>
                  <th className="text-left py-3 px-4 font-medium">Turma</th>
                  <th className="text-left py-3 px-4 font-medium">Horário</th>
                  <th className="text-left py-3 px-4 font-medium">Dias</th>
                  <th className="text-left py-3 px-4 font-medium">Ocupação</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ocupacoesDemo.map((ocupacao) => (
                  <tr key={ocupacao.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{ocupacao.locacao}</td>
                    <td className="py-3 px-4">{ocupacao.turma}</td>
                    <td className="py-3 px-4">{ocupacao.horario}</td>
                    <td className="py-3 px-4 text-sm">{ocupacao.dias}</td>
                    <td className="py-3 px-4 font-medium">{ocupacao.ocupacao}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[ocupacao.status as keyof typeof statusColors]}>
                        {ocupacao.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
