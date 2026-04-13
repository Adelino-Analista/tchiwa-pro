import { and, desc, eq, gte, lte, sql, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  alunos,
  professores,
  modalidades,
  turmas,
  horariosAulas,
  matriculas,
  pagamentos,
  presencas,
  graduacoes,
  leads,
  atividades,
  caixa,
  contasPagar,
  contasReceber,
  vendas,
  locacoes,
  ocupacoes,
  categorias,
  contratos,
  centros,
  metodosPagamento,
  motivosEncerramento,
  type InsertAluno,
  type InsertProfessor,
  type InsertModalidade,
  type InsertTurma,
  type InsertHorarioAula,
  type InsertMatricula,
  type InsertPagamento,
  type InsertPresenca,
  type InsertGraduacao,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Modalidades ─────────────────────────────────────────────────────────────
export async function getModalidades() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(modalidades).where(eq(modalidades.ativo, true)).orderBy(modalidades.nome);
}

export async function createModalidade(data: InsertModalidade) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(modalidades).values(data);
  return result;
}

// ─── Alunos ──────────────────────────────────────────────────────────────────
export async function getAlunos(filters?: { status?: string; modalidadeId?: number; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(alunos.status, filters.status as any));
  if (filters?.modalidadeId) conditions.push(eq(alunos.modalidadeId, filters.modalidadeId));
  if (filters?.search) {
    conditions.push(
      or(
        like(alunos.nome, `%${filters.search}%`),
        like(alunos.email, `%${filters.search}%`),
        like(alunos.telefone, `%${filters.search}%`)
      )
    );
  }
  const query = db
    .select({
      aluno: alunos,
      modalidade: modalidades,
    })
    .from(alunos)
    .leftJoin(modalidades, eq(alunos.modalidadeId, modalidades.id))
    .orderBy(alunos.nome);
  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }
  return query;
}

export async function getAlunoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select({ aluno: alunos, modalidade: modalidades })
    .from(alunos)
    .leftJoin(modalidades, eq(alunos.modalidadeId, modalidades.id))
    .where(eq(alunos.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createAluno(data: InsertAluno) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(alunos).values(data);
  return result;
}

export async function updateAluno(id: number, data: Partial<InsertAluno>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(alunos).set(data).where(eq(alunos.id, id));
}

export async function countAlunosAtivos() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(alunos)
    .where(eq(alunos.status, "ativo"));
  return Number(result[0]?.count ?? 0);
}

// ─── Professores ─────────────────────────────────────────────────────────────
export async function getProfessores(filters?: { status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(professores.status, filters.status as any));
  const query = db
    .select({ professor: professores, modalidade: modalidades })
    .from(professores)
    .leftJoin(modalidades, eq(professores.modalidadeId, modalidades.id))
    .orderBy(professores.nome);
  if (conditions.length > 0) return query.where(and(...conditions));
  return query;
}

export async function getProfessorById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select({ professor: professores, modalidade: modalidades })
    .from(professores)
    .leftJoin(modalidades, eq(professores.modalidadeId, modalidades.id))
    .where(eq(professores.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createProfessor(data: InsertProfessor) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(professores).values(data);
}

export async function updateProfessor(id: number, data: Partial<InsertProfessor>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(professores).set(data).where(eq(professores.id, id));
}

// ─── Turmas ──────────────────────────────────────────────────────────────────
export async function getTurmas() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ turma: turmas, modalidade: modalidades, professor: professores })
    .from(turmas)
    .leftJoin(modalidades, eq(turmas.modalidadeId, modalidades.id))
    .leftJoin(professores, eq(turmas.professorId, professores.id))
    .where(eq(turmas.ativo, true))
    .orderBy(turmas.nome);
}

export async function createTurma(data: InsertTurma) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(turmas).values(data);
}

export async function updateTurma(id: number, data: Partial<InsertTurma>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(turmas).set(data).where(eq(turmas.id, id));
}

// ─── Horários ─────────────────────────────────────────────────────────────────
export async function getHorarios(turmaId?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [eq(horariosAulas.ativo, true)];
  if (turmaId) conditions.push(eq(horariosAulas.turmaId, turmaId));
  return db
    .select({ horario: horariosAulas, turma: turmas, professor: professores, modalidade: modalidades })
    .from(horariosAulas)
    .leftJoin(turmas, eq(horariosAulas.turmaId, turmas.id))
    .leftJoin(professores, eq(turmas.professorId, professores.id))
    .leftJoin(modalidades, eq(turmas.modalidadeId, modalidades.id))
    .where(and(...conditions))
    .orderBy(horariosAulas.diaSemana, horariosAulas.horaInicio);
}

export async function createHorario(data: InsertHorarioAula) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(horariosAulas).values(data);
}

// ─── Pagamentos ───────────────────────────────────────────────────────────────
export async function getPagamentos(filters?: { alunoId?: number; status?: string; mes?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.alunoId) conditions.push(eq(pagamentos.alunoId, filters.alunoId));
  if (filters?.status) conditions.push(eq(pagamentos.status, filters.status as any));
  if (filters?.mes) conditions.push(eq(pagamentos.referenciaMes, filters.mes));
  const query = db
    .select({ pagamento: pagamentos, aluno: alunos })
    .from(pagamentos)
    .leftJoin(alunos, eq(pagamentos.alunoId, alunos.id))
    .orderBy(desc(pagamentos.dataVencimento));
  if (conditions.length > 0) return query.where(and(...conditions));
  return query;
}

export async function createPagamento(data: InsertPagamento) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(pagamentos).values(data);
}

export async function updatePagamento(id: number, data: Partial<InsertPagamento>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.update(pagamentos).set(data).where(eq(pagamentos.id, id));
}

export async function getFaturamentoMensal() {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      mes: pagamentos.referenciaMes,
      total: sql<number>`sum(${pagamentos.valor})`,
      count: sql<number>`count(*)`,
    })
    .from(pagamentos)
    .where(eq(pagamentos.status, "pago"))
    .groupBy(pagamentos.referenciaMes)
    .orderBy(desc(pagamentos.referenciaMes))
    .limit(12);
  return result;
}

export async function getFaturamentoDoMes(mes: string) {
  const db = await getDb();
  if (!db) return { total: 0, pago: 0, pendente: 0, atrasado: 0 };
  const result = await db
    .select({
      status: pagamentos.status,
      total: sql<number>`sum(${pagamentos.valor})`,
    })
    .from(pagamentos)
    .where(eq(pagamentos.referenciaMes, mes))
    .groupBy(pagamentos.status);
  const summary = { total: 0, pago: 0, pendente: 0, atrasado: 0 };
  for (const row of result) {
    const val = Number(row.total ?? 0);
    summary.total += val;
    if (row.status === "pago") summary.pago += val;
    else if (row.status === "pendente") summary.pendente += val;
    else if (row.status === "atrasado") summary.atrasado += val;
  }
  return summary;
}

export async function getAlunosInadimplentes() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ pagamento: pagamentos, aluno: alunos })
    .from(pagamentos)
    .leftJoin(alunos, eq(pagamentos.alunoId, alunos.id))
    .where(eq(pagamentos.status, "atrasado"))
    .orderBy(desc(pagamentos.dataVencimento))
    .limit(20);
}

// ─── Presenças ────────────────────────────────────────────────────────────────
export async function getPresencas(filters?: { alunoId?: number; turmaId?: number; dataInicio?: string; dataFim?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.alunoId) conditions.push(eq(presencas.alunoId, filters.alunoId));
  if (filters?.turmaId) conditions.push(eq(presencas.turmaId, filters.turmaId));
  if (filters?.dataInicio) conditions.push(sql`${presencas.data} >= ${filters.dataInicio}`);
  if (filters?.dataFim) conditions.push(sql`${presencas.data} <= ${filters.dataFim}`);
  const query = db
    .select({ presenca: presencas, aluno: alunos, turma: turmas })
    .from(presencas)
    .leftJoin(alunos, eq(presencas.alunoId, alunos.id))
    .leftJoin(turmas, eq(presencas.turmaId, turmas.id))
    .orderBy(desc(presencas.data));
  if (conditions.length > 0) return query.where(and(...conditions));
  return query;
}

export async function createPresenca(data: InsertPresenca) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(presencas).values(data);
}

export async function getFrequenciaStats(turmaId?: number) {
  const db = await getDb();
  if (!db) return { total: 0, presentes: 0, taxa: 0 };
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split('T')[0];
  const conditions: any[] = [sql`${presencas.data} >= ${dateStr}`];
  if (turmaId) conditions.push(eq(presencas.turmaId, turmaId));
  const result = await db
    .select({
      total: sql<number>`count(*)`,
      presentes: sql<number>`sum(case when ${presencas.presente} = 1 then 1 else 0 end)`,
    })
    .from(presencas)
    .where(and(...conditions));
  const total = Number(result[0]?.total ?? 0);
  const presentes = Number(result[0]?.presentes ?? 0);
  return { total, presentes, taxa: total > 0 ? Math.round((presentes / total) * 100) : 0 };
}

// ─── Graduações ───────────────────────────────────────────────────────────────
export async function getGraduacoes(alunoId?: number) {
  const db = await getDb();
  if (!db) return [];
  const query = db
    .select({ graduacao: graduacoes, aluno: alunos, modalidade: modalidades, avaliador: professores })
    .from(graduacoes)
    .leftJoin(alunos, eq(graduacoes.alunoId, alunos.id))
    .leftJoin(modalidades, eq(graduacoes.modalidadeId, modalidades.id))
    .leftJoin(professores, eq(graduacoes.avaliadorId, professores.id))
    .orderBy(desc(graduacoes.dataGraduacao));
  if (alunoId) return query.where(eq(graduacoes.alunoId, alunoId));
  return query;
}

export async function createGraduacao(data: InsertGraduacao) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  return db.insert(graduacoes).values(data);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;
  const now = new Date();
  const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [alunosAtivos, faturamento, frequencia, inadimplentes] = await Promise.all([
    countAlunosAtivos(),
    getFaturamentoDoMes(mesAtual),
    getFrequenciaStats(),
    db
      .select({ count: sql<number>`count(distinct ${pagamentos.alunoId})` })
      .from(pagamentos)
      .where(eq(pagamentos.status, "atrasado")),
  ]);

  return {
    alunosAtivos,
    faturamentoMes: faturamento,
    frequencia,
    inadimplentes: Number(inadimplentes[0]?.count ?? 0),
  };
}


// ─── CRM: Leads ──────────────────────────────────────────────────────────────
export async function getLeads(filters?: { status?: string; origem?: string; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(leads as any);
    if (filters?.status) query = query.where(eq((leads as any).status, filters.status)) as any;
    if (filters?.search) query = query.where(sql`${(leads as any).nome} LIKE ${`%${filters.search}%`}`) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching leads:", error);
    return [];
  }
}

// ─── CRM: Atividades ─────────────────────────────────────────────────────────
export async function getAtividades(filters?: { leadId?: number; clienteId?: number; tipo?: string }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(atividades as any);
    if (filters?.leadId) query = query.where(eq((atividades as any).leadId, filters.leadId)) as any;
    if (filters?.clienteId) query = query.where(eq((atividades as any).clienteId, filters.clienteId)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching atividades:", error);
    return [];
  }
}

// ─── Financeiro: Caixa ───────────────────────────────────────────────────────
export async function getCaixa(filters?: { data?: string; tipo?: string; categoria?: string }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(caixa as any);
    if (filters?.tipo) query = query.where(eq((caixa as any).tipo, filters.tipo)) as any;
    if (filters?.categoria) query = query.where(eq((caixa as any).categoria, filters.categoria)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching caixa:", error);
    return [];
  }
}

export async function getCaixaResume(mes: string) {
  const db = await getDb();
  if (!db) return { entradas: 0, saidas: 0, saldo: 0 };
  try {
    const [entradas, saidas] = await Promise.all([
      db.select({ total: sql<number>`SUM(${(caixa as any).valor})` }).from(caixa as any).where(eq((caixa as any).tipo, "entrada")),
      db.select({ total: sql<number>`SUM(${(caixa as any).valor})` }).from(caixa as any).where(eq((caixa as any).tipo, "saida")),
    ]);
    const entradasVal = Number(entradas[0]?.total ?? 0);
    const saidasVal = Number(saidas[0]?.total ?? 0);
    return { entradas: entradasVal, saidas: saidasVal, saldo: entradasVal - saidasVal };
  } catch (error) {
    console.error("[Database] Error fetching caixa resume:", error);
    return { entradas: 0, saidas: 0, saldo: 0 };
  }
}

// ─── Financeiro: Contas a Pagar ──────────────────────────────────────────────
export async function getContasPagar(filters?: { status?: string; categoria?: string }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(contasPagar as any);
    if (filters?.status) query = query.where(eq((contasPagar as any).status, filters.status)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching contas pagar:", error);
    return [];
  }
}

// ─── Financeiro: Contas a Receber ────────────────────────────────────────────
export async function getContasReceber(filters?: { status?: string; clienteId?: number }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(contasReceber as any);
    if (filters?.status) query = query.where(eq((contasReceber as any).status, filters.status)) as any;
    if (filters?.clienteId) query = query.where(eq((contasReceber as any).clienteId, filters.clienteId)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching contas receber:", error);
    return [];
  }
}

// ─── Financeiro: Vendas ──────────────────────────────────────────────────────
export async function getVendas(filters?: { status?: string; tipo?: string; clienteId?: number }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(vendas as any);
    if (filters?.status) query = query.where(eq((vendas as any).status, filters.status)) as any;
    if (filters?.tipo) query = query.where(eq((vendas as any).tipo, filters.tipo)) as any;
    if (filters?.clienteId) query = query.where(eq((vendas as any).clienteId, filters.clienteId)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching vendas:", error);
    return [];
  }
}

// ─── Agenda: Locações ────────────────────────────────────────────────────────
export async function getLocacoes(filters?: { tipo?: string; ativo?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(locacoes as any);
    if (filters?.tipo) query = query.where(eq((locacoes as any).tipo, filters.tipo)) as any;
    if (filters?.ativo !== undefined) query = query.where(eq((locacoes as any).ativo, filters.ativo)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching locacoes:", error);
    return [];
  }
}

// ─── Agenda: Ocupações ───────────────────────────────────────────────────────
export async function getOcupacoes(filters?: { locacaoId?: number; turmaId?: number }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(ocupacoes as any);
    if (filters?.locacaoId) query = query.where(eq((ocupacoes as any).locacaoId, filters.locacaoId)) as any;
    if (filters?.turmaId) query = query.where(eq((ocupacoes as any).turmaId, filters.turmaId)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching ocupacoes:", error);
    return [];
  }
}

// ─── Administrativo: Categorias ──────────────────────────────────────────────
export async function getCategorias(filters?: { tipo?: string; ativo?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(categorias as any);
    if (filters?.tipo) query = query.where(eq((categorias as any).tipo, filters.tipo)) as any;
    if (filters?.ativo !== undefined) query = query.where(eq((categorias as any).ativo, filters.ativo)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching categorias:", error);
    return [];
  }
}

// ─── Administrativo: Contratos ───────────────────────────────────────────────
export async function getContratos(filters?: { clienteId?: number; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(contratos as any);
    if (filters?.clienteId) query = query.where(eq((contratos as any).clienteId, filters.clienteId)) as any;
    if (filters?.status) query = query.where(eq((contratos as any).status, filters.status)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching contratos:", error);
    return [];
  }
}

// ─── Administrativo: Centros ─────────────────────────────────────────────────
export async function getCentros(filters?: { tipo?: string; ativo?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(centros as any);
    if (filters?.tipo) query = query.where(eq((centros as any).tipo, filters.tipo)) as any;
    if (filters?.ativo !== undefined) query = query.where(eq((centros as any).ativo, filters.ativo)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching centros:", error);
    return [];
  }
}

// ─── Administrativo: Métodos de Pagamento ────────────────────────────────────
export async function getMetodosPagamento(filters?: { ativo?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(metodosPagamento as any);
    if (filters?.ativo !== undefined) query = query.where(eq((metodosPagamento as any).ativo, filters.ativo)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching metodos pagamento:", error);
    return [];
  }
}

// ─── Administrativo: Motivos de Encerramento ─────────────────────────────────
export async function getMotivosEncerramento(filters?: { ativo?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  try {
    let query = db.select().from(motivosEncerramento as any);
    if (filters?.ativo !== undefined) query = query.where(eq((motivosEncerramento as any).ativo, filters.ativo)) as any;
    return await query;
  } catch (error) {
    console.error("[Database] Error fetching motivos encerramento:", error);
    return [];
  }
}
