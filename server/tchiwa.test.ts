import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
  getAlunos: vi.fn().mockResolvedValue([]),
  getAlunoById: vi.fn().mockResolvedValue(undefined),
  createAluno: vi.fn().mockResolvedValue(undefined),
  updateAluno: vi.fn().mockResolvedValue(undefined),
  countAlunosAtivos: vi.fn().mockResolvedValue(0),
  getPagamentos: vi.fn().mockResolvedValue([]),
  createPagamento: vi.fn().mockResolvedValue(undefined),
  updatePagamento: vi.fn().mockResolvedValue(undefined),
  getFaturamentoMensal: vi.fn().mockResolvedValue([]),
  getFaturamentoDoMes: vi.fn().mockResolvedValue({ total: 0, pago: 0, pendente: 0, atrasado: 0 }),
  getAlunosInadimplentes: vi.fn().mockResolvedValue([]),
  getProfessores: vi.fn().mockResolvedValue([]),
  getProfessorById: vi.fn().mockResolvedValue(undefined),
  createProfessor: vi.fn().mockResolvedValue(undefined),
  updateProfessor: vi.fn().mockResolvedValue(undefined),
  getTurmas: vi.fn().mockResolvedValue([]),
  createTurma: vi.fn().mockResolvedValue(undefined),
  updateTurma: vi.fn().mockResolvedValue(undefined),
  getHorarios: vi.fn().mockResolvedValue([]),
  createHorario: vi.fn().mockResolvedValue(undefined),
  getPresencas: vi.fn().mockResolvedValue([]),
  createPresenca: vi.fn().mockResolvedValue(undefined),
  getFrequenciaStats: vi.fn().mockResolvedValue({ total: 0, presentes: 0, taxa: 0 }),
  getGraduacoes: vi.fn().mockResolvedValue([]),
  createGraduacao: vi.fn().mockResolvedValue(undefined),
  getModalidades: vi.fn().mockResolvedValue([]),
  createModalidade: vi.fn().mockResolvedValue(undefined),
  getDashboardStats: vi.fn().mockResolvedValue({
    alunosAtivos: 0,
    inadimplentes: 0,
    frequencia: { total: 0, presentes: 0, taxa: 0 },
    proximasAulas: [],
  }),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@tchiwa.pro",
      name: "Admin Tchiwa",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "aluno@tchiwa.pro",
      name: "Aluno Teste",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("auth", () => {
  it("me retorna o utilizador autenticado", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Admin Tchiwa");
    expect(result?.role).toBe("admin");
  });

  it("me retorna null para utilizador não autenticado", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("dashboard", () => {
  it("stats retorna estrutura correta para admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.stats();
    expect(result).toBeDefined();
    expect(result).toHaveProperty("alunosAtivos");
    expect(result).toHaveProperty("inadimplentes");
    expect(result).toHaveProperty("frequencia");
  });

  it("faturamentoMensal retorna array para admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.faturamentoMensal();
    expect(Array.isArray(result)).toBe(true);
  });

  it("inadimplentes retorna array para admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.inadimplentes();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("alunos", () => {
  it("list retorna array para admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.alunos.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("list retorna array para utilizador normal", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.alunos.list({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("pagamentos", () => {
  it("list retorna array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.pagamentos.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("resumoMes retorna estrutura correta", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.pagamentos.resumoMes({ mes: "2026-03" });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("total");
  });
});

describe("professores", () => {
  it("list retorna array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.professores.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("turmas", () => {
  it("list retorna array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.turmas.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("presencas", () => {
  it("list retorna array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.presencas.list({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("graduacoes", () => {
  it("list retorna array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.graduacoes.list({});
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("modalidades", () => {
  it("list retorna array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.modalidades.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
