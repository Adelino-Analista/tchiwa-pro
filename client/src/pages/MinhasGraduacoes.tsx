import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { Award, ArrowRight } from "lucide-react";

const BELT_CLASSES: Record<string, string> = {
  branca: "belt-branca", cinza: "belt-cinza", azul: "belt-azul",
  roxa: "belt-roxa", marrom: "belt-marrom", preta: "belt-preta",
  amarela: "belt-amarela", laranja: "belt-laranja", vermelha: "belt-vermelha", verde: "belt-verde",
};

export default function MinhasGraduacoes() {
  const { data: graduacoes } = trpc.graduacoes.list.useQuery({});

  const ultima = (graduacoes ?? [])[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Minhas Graduações"
        subtitle="Histórico de evolução técnica e faixas"
        icon={<Award className="h-5 w-5" />}
      />

      {ultima && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5 text-center">
            <p className="text-xs text-muted-foreground mb-2">Faixa Atual</p>
            <span className={`text-sm px-4 py-2 rounded-full font-bold ${BELT_CLASSES[ultima.graduacao.faixaNova.toLowerCase()] ?? "bg-primary text-primary-foreground"}`}>
              {ultima.graduacao.faixaNova}
            </span>
            {ultima.modalidade && <p className="text-xs text-muted-foreground mt-2">{ultima.modalidade.nome}</p>}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {(graduacoes ?? []).map(({ graduacao, modalidade, avaliador }) => (
          <Card key={graduacao.id} className="border-border/60 bg-card/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 shrink-0">
                  {graduacao.faixaAnterior && (
                    <>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${BELT_CLASSES[graduacao.faixaAnterior.toLowerCase()] ?? "bg-muted text-foreground"}`}>
                        {graduacao.faixaAnterior}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${BELT_CLASSES[graduacao.faixaNova.toLowerCase()] ?? "bg-primary text-primary-foreground"}`}>
                    {graduacao.faixaNova}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{modalidade?.nome}</p>
                  {avaliador && <p className="text-xs text-muted-foreground">Avaliador: {avaliador.nome}</p>}
                </div>
                <p className="text-xs text-muted-foreground shrink-0">{String(graduacao.dataGraduacao ?? "")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {(graduacoes ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Award className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-sm">Sem graduações registadas</p>
          </div>
        )}
      </div>
    </div>
  );
}
