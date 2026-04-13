import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { CreditCard, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

const planos = [
  { id: "price_1", nome: "Plano Básico", valor: 99, descricao: "Acesso básico", features: ["Dashboard", "Alunos", "Relatórios"] },
  { id: "price_2", nome: "Plano Profissional", valor: 199, descricao: "Acesso completo", features: ["Tudo do Básico", "CRM", "Financeiro", "Agenda"] },
  { id: "price_3", nome: "Plano Enterprise", valor: 499, descricao: "Acesso premium", features: ["Tudo do Profissional", "API", "Suporte 24/7", "Customizações"] },
];

export default function Pagamentos() {
  // const { data: pagamentos, isLoading } = trpc.stripe.getPagamentos.useQuery();
  // const { data: subscricao } = trpc.stripe.getSubscricao.useQuery();
  // const { data: invoices } = trpc.stripe.getInvoices.useQuery();
  const pagamentos: any[] = [];
  const subscricao: any = null;
  const invoices: any[] = [];
  const isLoading = false;

  const statusColors: Record<string, string> = {
    "succeeded": "bg-green-100 text-green-800",
    "pending": "bg-yellow-100 text-yellow-800",
    "failed": "bg-red-100 text-red-800",
    "canceled": "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Pagamentos" subtitle="Gerenciar planos e histórico de pagamentos" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planos.map((plano) => (
          <Card key={plano.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{plano.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">{plano.descricao}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">R$ {plano.valor}</div>
              <ul className="space-y-2">
                {plano.features.map((feature) => (
                  <li key={feature} className="text-sm flex items-center gap-2">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <CreditCard className="h-4 w-4 mr-2" />
                Contratar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
        </CardHeader>
        <CardContent>
          {subscricao ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status da Subscrição</p>
                  <p className="text-sm text-muted-foreground">ID: {subscricao.stripeSubscriptionId}</p>
                </div>
                <Badge className={subscricao.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {subscricao.status === "active" ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Período Atual</p>
                  <p className="font-medium">{subscricao.currentPeriodStart ? new Date(subscricao.currentPeriodStart).toLocaleDateString('pt-BR') : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próxima Renovação</p>
                  <p className="font-medium">{subscricao.currentPeriodEnd ? new Date(subscricao.currentPeriodEnd).toLocaleDateString('pt-BR') : "-"}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma subscrição ativa</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : pagamentos && pagamentos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Data</th>
                    <th className="text-left py-3 px-4 font-medium">Descrição</th>
                    <th className="text-left py-3 px-4 font-medium">Valor</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map((pag: any) => (
                    <tr key={pag.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(pag.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-4">{pag.descricao || "Pagamento"}</td>
                      <td className="py-3 px-4 font-medium">R$ {parseFloat(pag.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[pag.status] || "bg-gray-100 text-gray-800"}>
                          {pag.status === "succeeded" ? "Concluído" : pag.status === "pending" ? "Pendente" : pag.status === "failed" ? "Falhou" : "Cancelado"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum pagamento registrado</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Data</th>
                    <th className="text-left py-3 px-4 font-medium">Valor</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(inv.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-4 font-medium">R$ {parseFloat(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4">
                        <Badge className={inv.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {inv.status === "paid" ? "Paga" : "Pendente"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma fatura disponível</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
