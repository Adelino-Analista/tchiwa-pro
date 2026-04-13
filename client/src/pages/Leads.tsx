import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { useState } from "react";

const leadsDemo = [
  { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1111", status: "Qualificado", origem: "Website", valor: "R$ 2.500" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 99999-2222", status: "Em Negociação", origem: "Indicação", valor: "R$ 3.000" },
  { id: 3, nome: "Pedro Costa", email: "pedro@email.com", telefone: "(11) 99999-3333", status: "Proposta", origem: "Rede Social", valor: "R$ 2.800" },
  { id: 4, nome: "Ana Oliveira", email: "ana@email.com", telefone: "(11) 99999-4444", status: "Qualificado", origem: "Website", valor: "R$ 2.200" },
  { id: 5, nome: "Carlos Mendes", email: "carlos@email.com", telefone: "(11) 99999-5555", status: "Perdido", origem: "Indicação", valor: "R$ 1.500" },
];

const statusColors = {
  "Qualificado": "bg-blue-100 text-blue-800",
  "Em Negociação": "bg-yellow-100 text-yellow-800",
  "Proposta": "bg-purple-100 text-purple-800",
  "Perdido": "bg-red-100 text-red-800",
};

export default function Leads() {
  const [search, setSearch] = useState("");

  const filtered = leadsDemo.filter(lead =>
    lead.nome.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader title="Leads" subtitle="Gerenciar e acompanhar oportunidades comerciais" />

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Telefone</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Origem</th>
                  <th className="text-left py-3 px-4 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{lead.nome}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {lead.telefone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{lead.origem}</td>
                    <td className="py-3 px-4 font-medium">{lead.valor}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Editar</Button>
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
