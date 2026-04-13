import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, Zap, BarChart3 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLocation } from "wouter";

export default function CRM() {
  const [, setLocation] = useLocation();

  const modules = [
    {
      title: "Leads",
      description: "Gerenciar leads e oportunidades comerciais",
      icon: Users,
      color: "text-blue-500",
      path: "/crm/leads",
    },
    {
      title: "Atividades",
      description: "Registrar e acompanhar atividades comerciais",
      icon: Activity,
      color: "text-green-500",
      path: "/crm/atividades",
    },
    {
      title: "Automações",
      description: "Configurar fluxos e automações de vendas",
      icon: Zap,
      color: "text-orange-500",
      path: "/crm/automacoes",
    },
    {
      title: "Relatórios",
      description: "Análises e relatórios de performance",
      icon: BarChart3,
      color: "text-purple-500",
      path: "/crm/relatorios",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="CRM" subtitle="Gestão de relacionamento com clientes" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation(module.path)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${module.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do CRM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">487</div>
              <p className="text-sm text-muted-foreground">Leads Totais</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">92</div>
              <p className="text-sm text-muted-foreground">Em Negociação</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">34.2%</div>
              <p className="text-sm text-muted-foreground">Taxa Conversão</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">482</div>
              <p className="text-sm text-muted-foreground">Atividades</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
