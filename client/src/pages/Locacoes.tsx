import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, MapPin, Users } from "lucide-react";

const locacoesDemo = [
  { id: 1, nome: "Sala 1", tipo: "Sala de Aula", capacidade: 20, ocupacao: 18, status: "Ativa" },
  { id: 2, nome: "Sala 2", tipo: "Sala de Aula", capacidade: 25, ocupacao: 23, status: "Ativa" },
  { id: 3, nome: "Sala 3", tipo: "Sala de Aula", capacidade: 15, ocupacao: 14, status: "Ativa" },
  { id: 4, nome: "Quadra", tipo: "Quadra Esportiva", capacidade: 40, ocupacao: 36, status: "Ativa" },
  { id: 5, nome: "Sala 4", tipo: "Sala de Aula", capacidade: 20, ocupacao: 0, status: "Inativa" },
];

const statusColors = {
  "Ativa": "bg-green-100 text-green-800",
  "Inativa": "bg-gray-100 text-gray-800",
};

export default function Locacoes() {
  const totalCapacidade = locacoesDemo.reduce((sum, l) => sum + l.capacidade, 0);
  const totalOcupacao = locacoesDemo.reduce((sum, l) => sum + l.ocupacao, 0);
  const taxaOcupacao = ((totalOcupacao / totalCapacidade) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <PageHeader title="Locações" subtitle="Gerenciar espaços e salas disponíveis" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Locações</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locacoesDemo.length}</div>
            <p className="text-xs text-muted-foreground">Espaços cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidade Total</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacidade}</div>
            <p className="text-xs text-muted-foreground">Pessoas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupação Atual</CardTitle>
            <div className="h-4 w-4 rounded-full bg-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOcupacao}</div>
            <p className="text-xs text-muted-foreground">{taxaOcupacao}% da capacidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locacoesDemo.filter(l => l.status === "Ativa").length}</div>
            <p className="text-xs text-muted-foreground">Em funcionamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Locação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Locações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Capacidade</th>
                  <th className="text-left py-3 px-4 font-medium">Ocupação</th>
                  <th className="text-left py-3 px-4 font-medium">Taxa</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {locacoesDemo.map((locacao) => {
                  const taxa = ((locacao.ocupacao / locacao.capacidade) * 100).toFixed(0);
                  return (
                    <tr key={locacao.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{locacao.nome}</td>
                      <td className="py-3 px-4">{locacao.tipo}</td>
                      <td className="py-3 px-4">{locacao.capacidade} pessoas</td>
                      <td className="py-3 px-4">{locacao.ocupacao} pessoas</td>
                      <td className="py-3 px-4 font-medium">{taxa}%</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[locacao.status as keyof typeof statusColors]}>
                          {locacao.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">Editar</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
