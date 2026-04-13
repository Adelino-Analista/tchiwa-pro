import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  date,
  boolean,
  time,
} from "drizzle-orm/mysql-core";

// ─── Users (auth) ────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "professor", "aluno"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Modalidades ─────────────────────────────────────────────────────────────
export const modalidades = mysqlTable("modalidades", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  cor: varchar("cor", { length: 20 }).default("#e67e22"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Modalidade = typeof modalidades.$inferSelect;
export type InsertModalidade = typeof modalidades.$inferInsert;

// ─── Professores ─────────────────────────────────────────────────────────────
export const professores = mysqlTable("professores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  nome: varchar("nome", { length: 150 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 30 }),
  cpf: varchar("cpf", { length: 20 }),
  especialidades: text("especialidades"),
  faixaGraduacao: varchar("faixaGraduacao", { length: 50 }),
  modalidadeId: int("modalidadeId").references(() => modalidades.id),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo").notNull(),
  foto: text("foto"),
  bio: text("bio"),
  dataAdmissao: date("dataAdmissao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Professor = typeof professores.$inferSelect;
export type InsertProfessor = typeof professores.$inferInsert;

// ─── Alunos ──────────────────────────────────────────────────────────────────
export const alunos = mysqlTable("alunos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  nome: varchar("nome", { length: 150 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 30 }),
  cpf: varchar("cpf", { length: 20 }),
  dataNascimento: date("dataNascimento"),
  endereco: text("endereco"),
  responsavel: varchar("responsavel", { length: 150 }),
  telefoneResponsavel: varchar("telefoneResponsavel", { length: 30 }),
  modalidadeId: int("modalidadeId").references(() => modalidades.id),
  status: mysqlEnum("status", ["ativo", "inativo", "suspenso", "trancado"]).default("ativo").notNull(),
  foto: text("foto"),
  observacoes: text("observacoes"),
  dataMatricula: date("dataMatricula"),
  diaVencimento: int("diaVencimento").default(10),
  valorMensalidade: decimal("valorMensalidade", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Aluno = typeof alunos.$inferSelect;
export type InsertAluno = typeof alunos.$inferInsert;

// ─── Turmas ──────────────────────────────────────────────────────────────────
export const turmas = mysqlTable("turmas", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  modalidadeId: int("modalidadeId").references(() => modalidades.id),
  professorId: int("professorId").references(() => professores.id),
  capacidade: int("capacidade").default(30),
  nivel: mysqlEnum("nivel", ["iniciante", "intermediario", "avancado", "todos"]).default("todos"),
  ativo: boolean("ativo").default(true).notNull(),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Turma = typeof turmas.$inferSelect;
export type InsertTurma = typeof turmas.$inferInsert;

// ─── Horários de Aulas ───────────────────────────────────────────────────────
export const horariosAulas = mysqlTable("horarios_aulas", {
  id: int("id").autoincrement().primaryKey(),
  turmaId: int("turmaId").references(() => turmas.id).notNull(),
  diaSemana: mysqlEnum("diaSemana", ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"]).notNull(),
  horaInicio: time("horaInicio").notNull(),
  horaFim: time("horaFim").notNull(),
  local: varchar("local", { length: 100 }),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HorarioAula = typeof horariosAulas.$inferSelect;
export type InsertHorarioAula = typeof horariosAulas.$inferInsert;

// ─── Matrículas (aluno ↔ turma) ──────────────────────────────────────────────
export const matriculas = mysqlTable("matriculas", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").references(() => alunos.id).notNull(),
  turmaId: int("turmaId").references(() => turmas.id).notNull(),
  dataMatricula: date("dataMatricula").notNull(),
  status: mysqlEnum("status", ["ativa", "inativa", "suspensa"]).default("ativa").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Matricula = typeof matriculas.$inferSelect;
export type InsertMatricula = typeof matriculas.$inferInsert;

// ─── Pagamentos / Mensalidades ───────────────────────────────────────────────
export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").references(() => alunos.id).notNull(),
  descricao: varchar("descricao", { length: 200 }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataVencimento: date("dataVencimento").notNull(),
  dataPagamento: date("dataPagamento"),
  status: mysqlEnum("status", ["pendente", "pago", "atrasado", "cancelado"]).default("pendente").notNull(),
  metodoPagamento: mysqlEnum("metodoPagamento", ["dinheiro", "pix", "cartao_credito", "cartao_debito", "transferencia", "outro"]),
  referenciaMes: varchar("referenciaMes", { length: 7 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pagamento = typeof pagamentos.$inferSelect;
export type InsertPagamento = typeof pagamentos.$inferInsert;

// ─── Presenças ───────────────────────────────────────────────────────────────
export const presencas = mysqlTable("presencas", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").references(() => alunos.id).notNull(),
  turmaId: int("turmaId").references(() => turmas.id).notNull(),
  horarioAulaId: int("horarioAulaId").references(() => horariosAulas.id),
  data: date("data").notNull(),
  presente: boolean("presente").default(true).notNull(),
  observacoes: text("observacoes"),
  registradoPor: int("registradoPor").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Presenca = typeof presencas.$inferSelect;
export type InsertPresenca = typeof presencas.$inferInsert;

// ─── Graduações / Faixas ─────────────────────────────────────────────────────
export const graduacoes = mysqlTable("graduacoes", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").references(() => alunos.id).notNull(),
  modalidadeId: int("modalidadeId").references(() => modalidades.id).notNull(),
  faixaAnterior: varchar("faixaAnterior", { length: 50 }),
  faixaNova: varchar("faixaNova", { length: 50 }).notNull(),
  corFaixa: varchar("corFaixa", { length: 20 }),
  dataGraduacao: date("dataGraduacao").notNull(),
  avaliadorId: int("avaliadorId").references(() => professores.id),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Graduacao = typeof graduacoes.$inferSelect;
export type InsertGraduacao = typeof graduacoes.$inferInsert;

// ─── CRM: Leads ──────────────────────────────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 150 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 30 }),
  whatsapp: varchar("whatsapp", { length: 30 }),
  instagram: varchar("instagram", { length: 100 }),
  categoria: varchar("categoria", { length: 50 }),
  origem: mysqlEnum("origem", ["direto", "google", "instagram", "whatsapp", "indicacao", "outro"]).default("direto"),
  status: mysqlEnum("status", ["novo", "contatado", "interessado", "proposta", "convertido", "descartado"]).default("novo"),
  dataContato: date("dataContato"),
  proximoContato: date("proximoContato"),
  observacoes: text("observacoes"),
  responsavelId: int("responsavelId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─── CRM: Atividades ─────────────────────────────────────────────────────────
export const atividades = mysqlTable("atividades", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").references(() => leads.id),
  clienteId: int("clienteId").references(() => alunos.id),
  tipo: mysqlEnum("tipo", ["email", "sms", "whatsapp", "telefone", "instagram", "reuniao", "outro"]).notNull(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descricao: text("descricao"),
  dataAtividade: timestamp("dataAtividade").notNull(),
  concluida: boolean("concluida").default(false),
  responsavelId: int("responsavelId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Atividade = typeof atividades.$inferSelect;
export type InsertAtividade = typeof atividades.$inferInsert;

// ─── Locações (salas, tatames) ───────────────────────────────────────────────
export const locacoes = mysqlTable("locacoes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  tipo: mysqlEnum("tipo", ["tatame", "sala", "quadra", "piscina", "outro"]).notNull(),
  capacidade: int("capacidade").default(30),
  descricao: text("descricao"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Locacao = typeof locacoes.$inferSelect;
export type InsertLocacao = typeof locacoes.$inferInsert;

// ─── Ocupação (controle de uso das locações) ─────────────────────────────────
export const ocupacoes = mysqlTable("ocupacoes", {
  id: int("id").autoincrement().primaryKey(),
  locacaoId: int("locacaoId").references(() => locacoes.id).notNull(),
  turmaId: int("turmaId").references(() => turmas.id),
  dataInicio: timestamp("dataInicio").notNull(),
  dataFim: timestamp("dataFim").notNull(),
  ocupacao: int("ocupacao").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Ocupacao = typeof ocupacoes.$inferSelect;
export type InsertOcupacao = typeof ocupacoes.$inferInsert;

// ─── Financeiro: Caixa ───────────────────────────────────────────────────────
export const caixa = mysqlTable("caixa", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["entrada", "saida"]).notNull(),
  descricao: varchar("descricao", { length: 200 }).notNull(),
  valor: decimal("valor", { precision: 12, scale: 2 }).notNull(),
  data: date("data").notNull(),
  categoria: varchar("categoria", { length: 100 }),
  centroCusto: varchar("centroCusto", { length: 100 }),
  centroReceita: varchar("centroReceita", { length: 100 }),
  metodoPagamento: mysqlEnum("metodoPagamento", ["dinheiro", "pix", "cartao_credito", "cartao_debito", "transferencia", "outro"]),
  referencia: varchar("referencia", { length: 100 }),
  registradoPor: int("registradoPor").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Caixa = typeof caixa.$inferSelect;
export type InsertCaixa = typeof caixa.$inferInsert;

// ─── Financeiro: Contas a Pagar ──────────────────────────────────────────────
export const contasPagar = mysqlTable("contas_pagar", {
  id: int("id").autoincrement().primaryKey(),
  fornecedor: varchar("fornecedor", { length: 150 }).notNull(),
  descricao: varchar("descricao", { length: 200 }).notNull(),
  valor: decimal("valor", { precision: 12, scale: 2 }).notNull(),
  dataVencimento: date("dataVencimento").notNull(),
  dataPagamento: date("dataPagamento"),
  status: mysqlEnum("status", ["pendente", "pago", "atrasado", "cancelado"]).default("pendente"),
  categoria: varchar("categoria", { length: 100 }),
  centroCusto: varchar("centroCusto", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContaPagar = typeof contasPagar.$inferSelect;
export type InsertContaPagar = typeof contasPagar.$inferInsert;

// ─── Financeiro: Contas a Receber ────────────────────────────────────────────
export const contasReceber = mysqlTable("contas_receber", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").references(() => alunos.id),
  descricao: varchar("descricao", { length: 200 }).notNull(),
  valor: decimal("valor", { precision: 12, scale: 2 }).notNull(),
  dataVencimento: date("dataVencimento").notNull(),
  dataPagamento: date("dataPagamento"),
  status: mysqlEnum("status", ["pendente", "pago", "atrasado", "cancelado"]).default("pendente"),
  categoria: varchar("categoria", { length: 100 }),
  centroReceita: varchar("centroReceita", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContaReceber = typeof contasReceber.$inferSelect;
export type InsertContaReceber = typeof contasReceber.$inferInsert;

// ─── Financeiro: Vendas ──────────────────────────────────────────────────────
export const vendas = mysqlTable("vendas", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").references(() => alunos.id),
  descricao: varchar("descricao", { length: 200 }).notNull(),
  valor: decimal("valor", { precision: 12, scale: 2 }).notNull(),
  dataVenda: date("dataVenda").notNull(),
  dataPagamento: date("dataPagamento"),
  status: mysqlEnum("status", ["pendente", "pago", "cancelado"]).default("pendente"),
  tipo: mysqlEnum("tipo", ["modalidade", "produto", "servico", "outro"]).default("modalidade"),
  centroReceita: varchar("centroReceita", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = typeof vendas.$inferInsert;

// ─── Administrativo: Categorias ──────────────────────────────────────────────
export const categorias = mysqlTable("categorias", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["cliente", "lead", "produto", "despesa"]).notNull(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Categoria = typeof categorias.$inferSelect;
export type InsertCategoria = typeof categorias.$inferInsert;

// ─── Administrativo: Contratos ───────────────────────────────────────────────
export const contratos = mysqlTable("contratos", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").references(() => alunos.id).notNull(),
  tipo: mysqlEnum("tipo", ["acesso", "servico", "produto"]).notNull(),
  dataInicio: date("dataInicio").notNull(),
  dataFim: date("dataFim"),
  valor: decimal("valor", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["ativo", "encerrado", "suspenso"]).default("ativo"),
  descricao: text("descricao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contrato = typeof contratos.$inferSelect;
export type InsertContrato = typeof contratos.$inferInsert;

// ─── Administrativo: Centros de Custo/Receita ────────────────────────────────
export const centros = mysqlTable("centros", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["custo", "receita"]).notNull(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 150 }).notNull(),
  descricao: text("descricao"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Centro = typeof centros.$inferSelect;
export type InsertCentro = typeof centros.$inferInsert;

// ─── Administrativo: Métodos de Pagamento ────────────────────────────────────
export const metodosPagamento = mysqlTable("metodos_pagamento", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  tipo: mysqlEnum("tipo", ["dinheiro", "pix", "cartao_credito", "cartao_debito", "transferencia", "outro"]).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MetodoPagamento = typeof metodosPagamento.$inferSelect;
export type InsertMetodoPagamento = typeof metodosPagamento.$inferInsert;

// ─── Administrativo: Motivos de Encerramento ─────────────────────────────────
export const motivosEncerramento = mysqlTable("motivos_encerramento", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MotivoEncerramento = typeof motivosEncerramento.$inferSelect;
export type InsertMotivoEncerramento = typeof motivosEncerramento.$inferInsert;

// ─── Administrativo: Perfis de Acesso ────────────────────────────────────────
export const perfisAcesso = mysqlTable("perfis_acesso", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  permissoes: text("permissoes"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PerfilAcesso = typeof perfisAcesso.$inferSelect;
export type InsertPerfilAcesso = typeof perfisAcesso.$inferInsert;
