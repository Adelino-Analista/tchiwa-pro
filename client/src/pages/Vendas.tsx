import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, ShoppingCart } from "lucide-react";

const vendasDemo = [
  { id: 1, cliente: "João Silva", tipo: "Mensalidade", valor: 500, data: "2026-03-22", status: "Concluída" },
  { id: 2, cliente: "Maria Santos", tipo: "Produto", valor: 250, data: "2026-03-21", status: "Concluída" },
  { id: 3, cliente: "Pedro Costa", tipo: "Serviço", valor: 1200, data: "2026-03-20", status: "Concluída" },
  { id: 4, cliente: "Ana Oliveira", tipo: "Mensalidade", valor: 500, data: "2026-03-19", status: "Pendente" },
  { id: 5, cliente: "Carlos Mendes", tipo: "Produto", valor: 350, data: "2026-03-18", status: "Cancelada" },
];

const statusColors = {
  "Concluída": "bg-green-100 text-green-800",
  "Pendente": "bg-yellow-100 text-yellow-800",
  "Cancelada": "bg-red-100 text-red-800",
};

export default function Vendas() {
  const totalVendas = vendasDemo.reduce((sum, v) => sum + v.valor, 0);
  const vendasConcluidas = vendasDemo.filter(v => v.status === "Concluída").reduce((sum, v) => sum + v.valor, 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Vendas" subtitle="Gerenciar e acompanhar vendas realizadas" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalVendas.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{vendasDemo.length} transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {vendasConcluidas.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{vendasDemo.filter(v => v.status === "Concluída").length} vendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <div className="h-4 w-4 rounded-full bg-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalVendas / vendasDemo.length).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">Por transação</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 font-medium">Data</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendasDemo.map((venda) => (
                  <tr key={venda.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{venda.cliente}</td>
                    <td className="py-3 px-4">{venda.tipo}</td>
                    <td className="py-3 px-4 font-medium">R$ {venda.valor.toLocaleString('pt-BR')}</td>
                    <td className="py-3 px-4">{venda.data}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[venda.status as keyof typeof statusColors]}>
                        {venda.status}
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
