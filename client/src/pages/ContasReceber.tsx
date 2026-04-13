import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, CheckCircle } from "lucide-react";

const contasDemo = [
  { id: 1, cliente: "João Silva", descricao: "Mensalidade", valor: 500, vencimento: "2026-03-20", status: "Paga" },
  { id: 2, cliente: "Maria Santos", descricao: "Mensalidade", valor: 600, vencimento: "2026-03-22", status: "Pendente" },
  { id: 3, cliente: "Pedro Costa", descricao: "Serviço", valor: 1200, vencimento: "2026-03-25", status: "Pendente" },
  { id: 4, cliente: "Ana Oliveira", descricao: "Mensalidade", valor: 500, vencimento: "2026-03-15", status: "Atrasada" },
  { id: 5, cliente: "Carlos Mendes", descricao: "Produto", valor: 350, vencimento: "2026-03-30", status: "Pendente" },
];

const statusColors = {
  "Pendente": "bg-yellow-100 text-yellow-800",
  "Paga": "bg-green-100 text-green-800",
  "Atrasada": "bg-red-100 text-red-800",
};

export default function ContasReceber() {
  const totalPendente = contasDemo.filter(c => c.status === "Pendente").reduce((sum, c) => sum + c.valor, 0);
  const totalRecebida = contasDemo.filter(c => c.status === "Paga").reduce((sum, c) => sum + c.valor, 0);
  const totalAtrasada = contasDemo.filter(c => c.status === "Atrasada").reduce((sum, c) => sum + c.valor, 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Contas a Receber" subtitle="Acompanhar recebimentos de clientes" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebidas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRecebida.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{contasDemo.filter(c => c.status === "Paga").length} contas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalPendente.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{contasDemo.filter(c => c.status === "Pendente").length} contas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalAtrasada.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{contasDemo.filter(c => c.status === "Atrasada").length} contas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {contasDemo.reduce((sum, c) => sum + c.valor, 0).toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{contasDemo.length} contas</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium">Descrição</th>
                  <th className="text-left py-3 px-4 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 font-medium">Vencimento</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contasDemo.map((conta) => (
                  <tr key={conta.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{conta.cliente}</td>
                    <td className="py-3 px-4">{conta.descricao}</td>
                    <td className="py-3 px-4 font-medium">R$ {conta.valor.toLocaleString('pt-BR')}</td>
                    <td className="py-3 px-4">{conta.vencimento}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[conta.status as keyof typeof statusColors]}>
                        {conta.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Receber</Button>
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
