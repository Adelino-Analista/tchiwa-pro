import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import DashboardCRM from "./pages/DashboardCRM";
import DashboardOperacional from "./pages/DashboardOperacional";
import DashboardClientes from "./pages/DashboardClientes";
import DashboardFinanceiro from "./pages/DashboardFinanceiro";
import DashboardAgenda from "./pages/DashboardAgenda";
import Alunos from "./pages/Alunos";
import AlunoDetalhe from "./pages/AlunoDetalhe";
import Professores from "./pages/Professores";
import Financeiro from "./pages/Financeiro";
import Agenda from "./pages/Agenda";
import Frequencia from "./pages/Frequencia";
import Graduacoes from "./pages/Graduacoes";
import Relatorios from "./pages/Relatorios";
import CRM from "./pages/CRM";
import Leads from "./pages/Leads";
import Atividades from "./pages/Atividades";
import Caixa from "./pages/Caixa";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import Vendas from "./pages/Vendas";
import Locacoes from "./pages/Locacoes";
import Ocupacao from "./pages/Ocupacao";
import Administrativo from "./pages/Administrativo";
import Pagamentos from "./pages/Pagamentos";
import Notificacoes from "./pages/Notificacoes";
import ExportarRelatorios from "./pages/ExportarRelatorios";
import MeuPainel from "./pages/MeuPainel";
import MinhasMensalidades from "./pages/MinhasMensalidades";
import MinhaFrequencia from "./pages/MinhaFrequencia";
import MinhasGraduacoes from "./pages/MinhasGraduacoes";
import { useEffect } from "react";
import { useLocation } from "wouter";

function RedirectToDashboard() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/dashboard"); }, []);
  return null;
}

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={RedirectToDashboard} />
        <Route path="/dashboard" component={Dashboard} />
        {/* Dashboards */}
        <Route path="/dashboard-crm" component={DashboardCRM} />
        <Route path="/dashboard-operacional" component={DashboardOperacional} />
        <Route path="/dashboard-clientes" component={DashboardClientes} />
        <Route path="/dashboard-financeiro" component={DashboardFinanceiro} />
        <Route path="/dashboard-agenda" component={DashboardAgenda} />
        {/* Alunos */}
        <Route path="/alunos" component={Alunos} />
        <Route path="/alunos/:id" component={AlunoDetalhe} />
        {/* Professores */}
        <Route path="/professores" component={Professores} />
        {/* CRM */}
        <Route path="/crm" component={CRM} />
        <Route path="/crm/leads" component={Leads} />
        <Route path="/crm/atividades" component={Atividades} />
        {/* Financeiro */}
        <Route path="/financeiro" component={Financeiro} />
        <Route path="/financeiro/caixa" component={Caixa} />
        <Route path="/financeiro/contas-pagar" component={ContasPagar} />
        <Route path="/financeiro/contas-receber" component={ContasReceber} />
        <Route path="/financeiro/vendas" component={Vendas} />
        {/* Agenda */}
        <Route path="/agenda" component={Agenda} />
        <Route path="/agenda/locacoes" component={Locacoes} />
        <Route path="/agenda/ocupacao" component={Ocupacao} />
        {/* Frequência e Graduações */}
        <Route path="/frequencia" component={Frequencia} />
        <Route path="/graduacoes" component={Graduacoes} />
        {/* Relatórios */}
        <Route path="/relatorios" component={Relatorios} />
        {/* Administrativo */}
        <Route path="/administrativo" component={Administrativo} />
        {/* Pagamentos */}
        <Route path="/pagamentos" component={Pagamentos} />
        {/* Notificações */}
        <Route path="/notificacoes" component={Notificacoes} />
        {/* Exportar Relatórios */}
        <Route path="/exportar-relatorios" component={ExportarRelatorios} />
        {/* Área do Aluno */}
        <Route path="/meu-painel" component={MeuPainel} />
        <Route path="/minhas-mensalidades" component={MinhasMensalidades} />
        <Route path="/minha-frequencia" component={MinhaFrequencia} />
        <Route path="/minhas-graduacoes" component={MinhasGraduacoes} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
