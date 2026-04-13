import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, Mail, Phone, MessageSquare, Calendar } from "lucide-react";

const atividadesDemo = [
  { id: 1, tipo: "E-mail", cliente: "João Silva", assunto: "Proposta enviada", data: "2026-03-22", status: "Concluída" },
  { id: 2, tipo: "Telefone", cliente: "Maria Santos", assunto: "Acompanhamento", data: "2026-03-21", status: "Concluída" },
  { id: 3, tipo: "WhatsApp", cliente: "Pedro Costa", assunto: "Dúvida sobre preço", data: "2026-03-20", status: "Concluída" },
  { id: 4, tipo: "Reunião", cliente: "Ana Oliveira", assunto: "Apresentação", data: "2026-03-23", status: "Agendada" },
  { id: 5, tipo: "E-mail", cliente: "Carlos Mendes", assunto: "Follow-up", data: "2026-03-24", status: "Pendente" },
];

const tipoIcons = {
  "E-mail": Mail,
  "Telefone": Phone,
  "WhatsApp": MessageSquare,
  "Reunião": Calendar,
};

const statusColors = {
  "Concluída": "bg-green-100 text-green-800",
  "Agendada": "bg-blue-100 text-blue-800",
  "Pendente": "bg-yellow-100 text-yellow-800",
};

export default function Atividades() {
  return (
    <div className="space-y-8">
      <PageHeader title="Atividades" subtitle="Registre e acompanhe todas as atividades comerciais" />

      <div className="flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atividadesDemo.map((atividade) => {
              const Icon = tipoIcons[atividade.tipo as keyof typeof tipoIcons];
              return (
                <div key={atividade.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100">
                      <Icon className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{atividade.assunto}</p>
                        <p className="text-sm text-muted-foreground">{atividade.cliente} • {atividade.tipo}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={statusColors[atividade.status as keyof typeof statusColors]}>
                          {atividade.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{atividade.data}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
