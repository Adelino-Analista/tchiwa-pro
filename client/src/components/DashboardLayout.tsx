import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  UserCheck,
  CalendarDays,
  ClipboardList,
  Award,
  BarChart3,
  LogOut,
  Shield,
  ChevronRight,
  Dumbbell,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663458755239/GLcg9oPkwZDcacge3XwMoG/tchiwa-logo_ea81684e.png";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", section: "principal" },
  { icon: Users, label: "Alunos", path: "/alunos", section: "gestao" },
  { icon: UserCheck, label: "Professores", path: "/professores", section: "gestao" },
  { icon: CalendarDays, label: "Agenda de Aulas", path: "/agenda", section: "gestao" },
  { icon: ClipboardList, label: "Frequência", path: "/frequencia", section: "gestao" },
  { icon: Award, label: "Graduações", path: "/graduacoes", section: "gestao" },
  { icon: DollarSign, label: "Financeiro", path: "/financeiro", section: "financeiro" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios", section: "financeiro" },
  { icon: DollarSign, label: "Pagamentos", path: "/pagamentos", section: "financeiro" },
  { icon: ClipboardList, label: "Notificações", path: "/notificacoes", section: "financeiro" },
  { icon: BarChart3, label: "Exportar Relatórios", path: "/exportar-relatorios", section: "financeiro" },
];

const professorMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", section: "principal" },
  { icon: Users, label: "Alunos", path: "/alunos", section: "gestao" },
  { icon: CalendarDays, label: "Agenda de Aulas", path: "/agenda", section: "gestao" },
  { icon: ClipboardList, label: "Frequência", path: "/frequencia", section: "gestao" },
  { icon: Award, label: "Graduações", path: "/graduacoes", section: "gestao" },
];

const alunoMenuItems = [
  { icon: LayoutDashboard, label: "Meu Painel", path: "/meu-painel", section: "principal" },
  { icon: DollarSign, label: "Mensalidades", path: "/minhas-mensalidades", section: "aluno" },
  { icon: ClipboardList, label: "Minha Frequência", path: "/minha-frequencia", section: "aluno" },
  { icon: Award, label: "Minhas Graduações", path: "/minhas-graduacoes", section: "aluno" },
];

const sectionLabels: Record<string, string> = {
  principal: "Principal",
  gestao: "Gestão",
  financeiro: "Financeiro",
  aluno: "Minha Conta",
};

const SIDEBAR_WIDTH_KEY = "tchiwa-sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 360;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen tchiwa-bg-gradient">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <img src={LOGO_URL} alt="Tchiwa Pro" className="h-28 w-auto object-contain" />
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Bem-vindo ao Tchiwa Pro</h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              A inteligência por trás do tatame. Faça login para aceder ao sistema de gestão.
            </p>
          </div>
          <Button
            onClick={() => { window.location.href = getLoginUrl(); }}
            size="lg"
            className="w-full font-semibold shadow-lg hover:shadow-primary/25 transition-all"
          >
            <Shield className="mr-2 h-4 w-4" />
            Entrar no Sistema
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: {
  children: React.ReactNode;
  setSidebarWidth: (w: number) => void;
}) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const role = user?.role ?? "user";
  const menuItems =
    role === "admin" ? adminMenuItems :
    role === "professor" ? professorMenuItems :
    role === "aluno" ? alunoMenuItems :
    adminMenuItems; // default: show admin for regular users (demo)

  const sections = Array.from(new Set(menuItems.map(i => i.section)));

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const activeItem = menuItems.find(i => location.startsWith(i.path));

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border" disableTransition={isResizing}>
          {/* Header */}
          <SidebarHeader className="h-16 border-b border-sidebar-border">
            <div className="flex items-center gap-3 px-3 h-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-sidebar-accent rounded-lg transition-colors shrink-0"
                aria-label="Toggle navigation"
              >
                {isCollapsed ? (
                  <img src={LOGO_URL} alt="TP" className="h-7 w-7 object-contain rounded" />
                ) : (
                  <Dumbbell className="h-4 w-4 text-primary" />
                )}
              </button>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm tracking-wide text-foreground truncate">TCHIWA PRO</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">Gestão de Academias</span>
                </div>
              )}
            </div>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="gap-0 py-3">
            {sections.map(section => (
              <div key={section} className="mb-2">
                {!isCollapsed && (
                  <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {sectionLabels[section] ?? section}
                  </p>
                )}
                <SidebarMenu className="px-2">
                  {menuItems.filter(i => i.section === section).map(item => {
                    const isActive = location.startsWith(item.path);
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => setLocation(item.path)}
                          tooltip={item.label}
                          className={`h-9 rounded-lg transition-all font-normal text-sm ${
                            isActive
                              ? "bg-primary/10 text-primary border-l-2 border-primary pl-[calc(0.5rem-2px)]"
                              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                          <span className="truncate">{item.label}</span>
                          {isActive && !isCollapsed && (
                            <ChevronRight className="ml-auto h-3 w-3 text-primary/50" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="p-3 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-sidebar-accent transition-colors w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate leading-none text-foreground">
                        {user?.name || "Utilizador"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {role === "admin" ? "Administrador" : role === "professor" ? "Professor" : role === "aluno" ? "Aluno" : "Utilizador"}
                      </p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Resize handle */}
        {!isCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/30 transition-colors"
            style={{ zIndex: 50 }}
            onMouseDown={() => setIsResizing(true)}
          />
        )}
      </div>

      <SidebarInset className="tchiwa-bg-gradient">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex border-b border-border h-14 items-center justify-between bg-background/95 px-4 backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg" />
              <img src={LOGO_URL} alt="Tchiwa Pro" className="h-7 w-auto object-contain" />
              <span className="font-semibold text-sm">{activeItem?.label ?? "Menu"}</span>
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
