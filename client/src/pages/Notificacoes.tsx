import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Mail, MessageSquare, Phone, Instagram, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const templates = [
  {
    id: 1,
    nome: "Mensalidade Atrasada",
    tipo: "email",
    assunto: "Sua mensalidade está vencida",
    conteudo: "Olá {{nome}},\n\nSua mensalidade de {{mes}} venceu em {{data}}.\nValor: R$ {{valor}}\n\nFavor regularizar o pagamento.",
    icone: Mail,
  },
  {
    id: 2,
    nome: "Lembrete de Aula",
    tipo: "whatsapp",
    conteudo: "Oi {{nome}}! 👋\nNão esqueça sua aula de {{modalidade}} amanhã às {{horario}}.\nLocal: {{local}}\n\nAté lá! 💪",
    icone: MessageSquare,
  },
  {
    id: 3,
    nome: "Renovação de Contrato",
    tipo: "email",
    assunto: "Renovação de Contrato - {{academia}}",
    conteudo: "Prezado {{nome}},\n\nSeu contrato vence em {{data}}.\nPara renovar, entre em contato conosco.\n\nAtenciosamente,\n{{academia}}",
    icone: Mail,
  },
  {
    id: 4,
    nome: "Promoção Especial",
    tipo: "whatsapp",
    conteudo: "🎉 PROMOÇÃO ESPECIAL! 🎉\n\nDesconto de {{desconto}}% em {{modalidade}}!\nVálido até {{data}}.\n\nAproveite! 🏋️",
    icone: MessageSquare,
  },
];

const tiposNotificacao = [
  { id: "email", nome: "Email", icone: Mail, cor: "bg-blue-100 text-blue-800" },
  { id: "whatsapp", nome: "WhatsApp", icone: MessageSquare, cor: "bg-green-100 text-green-800" },
  { id: "sms", nome: "SMS", icone: Phone, cor: "bg-purple-100 text-purple-800" },
  { id: "instagram", nome: "Instagram", icone: Instagram, cor: "bg-pink-100 text-pink-800" },
];

export default function Notificacoes() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [destinatarios, setDestinatarios] = useState("");

  const handleEnviar = (templateId: number) => {
    if (!destinatarios.trim()) {
      toast.error("Selecione pelo menos um destinatário");
      return;
    }
    toast.success(`Notificação enviada para ${destinatarios.split(",").length} destinatário(s)`);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Notificações" subtitle="Gerenciar templates e enviar notificações automáticas" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tiposNotificacao.map((tipo) => {
          const Icon = tipo.icone;
          return (
            <Card key={tipo.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-lg ${tipo.cor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">{tipo.nome}</h3>
                  <p className="text-sm text-muted-foreground">Enviar via {tipo.nome}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => {
            const Icon = template.icone;
            return (
              <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-orange-500" />
                      <h3 className="font-medium">{template.nome}</h3>
                      <Badge className={template.tipo === "email" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                        {template.tipo === "email" ? "Email" : "WhatsApp"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{template.conteudo.substring(0, 100)}...</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    Usar
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Enviar Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.find((t) => t.id === selectedTemplate) && (
              <>
                <div>
                  <label className="text-sm font-medium">Template Selecionado</label>
                  <p className="text-sm text-muted-foreground mt-1">{templates.find((t) => t.id === selectedTemplate)?.nome}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Destinatários</label>
                  <textarea
                    className="w-full mt-2 p-2 border rounded-lg text-sm"
                    placeholder="Selecione alunos, professores ou grupos..."
                    rows={3}
                    value={destinatarios}
                    onChange={(e) => setDestinatarios(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Pré-visualização</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border text-sm whitespace-pre-line">
                    {templates.find((t) => t.id === selectedTemplate)?.conteudo}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => handleEnviar(selectedTemplate)}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Agora
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Data</th>
                  <th className="text-left py-3 px-4 font-medium">Template</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Destinatários</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">10/04/2026</td>
                  <td className="py-3 px-4">Mensalidade Atrasada</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-blue-100 text-blue-800">Email</Badge>
                  </td>
                  <td className="py-3 px-4">5 alunos</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">Enviado</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">09/04/2026</td>
                  <td className="py-3 px-4">Lembrete de Aula</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">WhatsApp</Badge>
                  </td>
                  <td className="py-3 px-4">12 alunos</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">Enviado</Badge>
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
