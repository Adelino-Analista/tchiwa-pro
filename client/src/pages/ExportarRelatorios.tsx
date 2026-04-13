import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Download, FileText, BarChart3, Users, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const relatorios = [
  {
    id: 1,
    nome: "Faturamento Mensal",
    descricao: "Relatório completo de receitas e despesas do mês",
    icone: DollarSign,
    cor: "bg-green-100 text-green-800",
    periodos: ["Mensal", "Trimestral", "Anual"],
  },
  {
    id: 2,
    nome: "Frequência de Alunos",
    descricao: "Taxa de presença e comparecimento às aulas",
    icone: Users,
    cor: "bg-blue-100 text-blue-800",
    periodos: ["Mensal", "Trimestral", "Anual"],
  },
  {
    id: 3,
    nome: "Performance de Turmas",
    descricao: "Análise de ocupação e desempenho das turmas",
    icone: BarChart3,
    cor: "bg-purple-100 text-purple-800",
    periodos: ["Mensal", "Trimestral"],
  },
  {
    id: 4,
    nome: "Evolução de Graduações",
    descricao: "Histórico de mudanças de faixas e progressão",
    icone: FileText,
    cor: "bg-orange-100 text-orange-800",
    periodos: ["Mensal", "Anual"],
  },
];

export default function ExportarRelatorios() {
  const [selectedRelatorio, setSelectedRelatorio] = useState<number | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState("Mensal");
  const [loading, setLoading] = useState(false);

  const handleExportar = async (formato: "pdf" | "excel") => {
    if (!selectedRelatorio) {
      toast.error("Selecione um relatório");
      return;
    }

    setLoading(true);
    try {
      // Simular download
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const relatorio = relatorios.find((r) => r.id === selectedRelatorio);
      const nomeArquivo = `${relatorio?.nome.toLowerCase().replace(/\s+/g, "_")}_${selectedPeriodo.toLowerCase()}.${formato}`;
      
      toast.success(`Relatório "${relatorio?.nome}" exportado em ${formato.toUpperCase()}`);
      console.log(`Exportando: ${nomeArquivo}`);
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Exportar Relatórios" subtitle="Gerar e baixar relatórios em PDF ou Excel" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatorios.map((rel) => {
          const Icon = rel.icone;
          return (
            <Card
              key={rel.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                selectedRelatorio === rel.id ? "ring-2 ring-orange-500" : ""
              }`}
              onClick={() => setSelectedRelatorio(rel.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${rel.cor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{rel.nome}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{rel.descricao}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {rel.periodos.map((periodo) => (
                        <Badge key={periodo} variant="outline" className="text-xs">
                          {periodo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedRelatorio && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Exportação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Relatório Selecionado</label>
              <p className="text-sm text-muted-foreground mt-1">
                {relatorios.find((r) => r.id === selectedRelatorio)?.nome}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Período</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {relatorios
                  .find((r) => r.id === selectedRelatorio)
                  ?.periodos.map((periodo) => (
                    <Button
                      key={periodo}
                      variant={selectedPeriodo === periodo ? "default" : "outline"}
                      className={selectedPeriodo === periodo ? "bg-orange-500 hover:bg-orange-600" : ""}
                      onClick={() => setSelectedPeriodo(periodo)}
                    >
                      {periodo}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Formato de Exportação</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleExportar("pdf")}
                  disabled={loading}
                >
                  <FileText className="h-6 w-6" />
                  <span>Exportar PDF</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleExportar("excel")}
                  disabled={loading}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Exportar Excel</span>
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                💡 <strong>Dica:</strong> Os relatórios em PDF incluem gráficos e tabelas formatadas. Excel é ideal para análises adicionais.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Data</th>
                  <th className="text-left py-3 px-4 font-medium">Relatório</th>
                  <th className="text-left py-3 px-4 font-medium">Período</th>
                  <th className="text-left py-3 px-4 font-medium">Formato</th>
                  <th className="text-left py-3 px-4 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">10/04/2026 14:30</td>
                  <td className="py-3 px-4">Faturamento Mensal</td>
                  <td className="py-3 px-4">Abril 2026</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-red-100 text-red-800">PDF</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">09/04/2026 10:15</td>
                  <td className="py-3 px-4">Frequência de Alunos</td>
                  <td className="py-3 px-4">Março 2026</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">Excel</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">08/04/2026 09:45</td>
                  <td className="py-3 px-4">Performance de Turmas</td>
                  <td className="py-3 px-4">Trimestral Q1</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-red-100 text-red-800">PDF</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
