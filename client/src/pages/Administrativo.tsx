import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, FileText, Tag, Zap, BarChart3 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLocation } from "wouter";

export default function Administrativo() {
  const [, setLocation] = useLocation();

  const modules = [
    {
      title: "Assistentes",
      description: "Gerenciar equipe e assistentes",
      icon: Users,
      color: "text-blue-500",
      path: "/administrativo/assistentes",
    },
    {
      title: "Atividades",
      description: "Configurar tipos de atividades",
      icon: Zap,
      color: "text-green-500",
      path: "/administrativo/atividades",
    },
    {
      title: "Categorias",
      description: "Gerenciar categorias de produtos",
      icon: Tag,
      color: "text-orange-500",
      path: "/administrativo/categorias",
    },
    {
      title: "Contratos",
      description: "Gerenciar contratos de acesso",
      icon: FileText,
      color: "text-purple-500",
      path: "/administrativo/contratos",
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema",
      icon: Settings,
      color: "text-red-500",
      path: "/administrativo/configuracoes",
    },
    {
      title: "Relatórios",
      description: "Gerar e visualizar relatórios",
      icon: BarChart3,
      color: "text-indigo-500",
      path: "/administrativo/relatorios",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Administrativo" subtitle="Configurações e gerenciamento do sistema" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <CardTitle>Resumo Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">8</div>
              <p className="text-sm text-muted-foreground">Usuários Ativos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">24</div>
              <p className="text-sm text-muted-foreground">Categorias</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">156</div>
              <p className="text-sm text-muted-foreground">Contratos Ativos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
