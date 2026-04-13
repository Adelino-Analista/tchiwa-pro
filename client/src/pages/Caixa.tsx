import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const caixaDemo = [
  { id: 1, tipo: "entrada", descricao: "Mensalidade - João Silva", valor: 500, data: "2026-03-22", categoria: "Mensalidades" },
  { id: 2, tipo: "saida", descricao: "Pagamento aluguel", valor: 3000, data: "2026-03-22", categoria: "Aluguel" },
  { id: 3, tipo: "entrada", descricao: "Venda de produto", valor: 250, data: "2026-03-21", categoria: "Produtos" },
  { id: 4, tipo: "saida", descricao: "Compra de equipamento", valor: 1500, data: "2026-03-21", categoria: "Equipamentos" },
  { id: 5, tipo: "entrada", descricao: "Mensalidade - Maria Santos", valor: 600, data: "2026-03-20", categoria: "Mensalidades" },
];

export default function Caixa() {
  const entradas = caixaDemo.filter(m => m.tipo === "entrada").reduce((sum, m) => sum + m.valor, 0);
  const saidas = caixaDemo.filter(m => m.tipo === "saida").reduce((sum, m) => sum + m.valor, 0);
  const saldo = entradas - saidas;

  return (
    <div className="space-y-8">
      <PageHeader title="Caixa" subtitle="Controle de entradas e saídas de caixa" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {entradas.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Recebimentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {saidas.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Pagamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldo.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Saldo atual</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Entrada
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Saída
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Descrição</th>
                  <th className="text-left py-3 px-4 font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {caixaDemo.map((mov) => (
                  <tr key={mov.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge className={mov.tipo === "entrada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{mov.descricao}</td>
                    <td className="py-3 px-4">{mov.categoria}</td>
                    <td className={`py-3 px-4 font-medium ${mov.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                      {mov.tipo === "entrada" ? "+" : "-"} R$ {mov.valor.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">{mov.data}</td>
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
