import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";

const STATUS_ICONS: Record<string, any> = { pago: CheckCircle, pendente: Clock, atrasado: AlertCircle };
const STATUS_COLORS: Record<string, string> = { pago: "text-emerald-400", pendente: "text-amber-400", atrasado: "text-red-400" };

export default function MinhasMensalidades() {
  const { data: pagamentos } = trpc.pagamentos.list.useQuery({});

  return (
    <div className="space-y-5">
      <PageHeader
        title="Minhas Mensalidades"
        subtitle="Histórico de pagamentos e situação financeira"
        icon={<DollarSign className="h-5 w-5" />}
      />
      <div className="space-y-2">
        {(pagamentos ?? []).map(({ pagamento }) => {
          const Icon = STATUS_ICONS[pagamento.status] ?? Clock;
          return (
            <Card key={pagamento.id} className="border-border/60 bg-card/80">
              <CardContent className="p-4 flex items-center gap-4">
                <Icon className={`h-5 w-5 shrink-0 ${STATUS_COLORS[pagamento.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{pagamento.descricao}</p>
                  <p className="text-xs text-muted-foreground">Venc: {String(pagamento.dataVencimento ?? "")}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">AOA {Number(pagamento.valor).toLocaleString("pt-AO")}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium status-${pagamento.status}`}>
                    {pagamento.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {(pagamentos ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <DollarSign className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Sem mensalidades registadas</p>
          </div>
        )}
      </div>
    </div>
  );
}
