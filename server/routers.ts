import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAlunos, getAlunoById, createAluno, updateAluno, countAlunosAtivos,
  getProfessores, getProfessorById, createProfessor, updateProfessor,
  getModalidades, createModalidade,
  getTurmas, createTurma, updateTurma,
  getHorarios, createHorario,
  getPagamentos, createPagamento, updatePagamento, getFaturamentoMensal, getFaturamentoDoMes, getAlunosInadimplentes,
  getPresencas, createPresenca, getFrequenciaStats,
  getGraduacoes, createGraduacao,
  getDashboardStats,
  getLeads, getAtividades, getCaixa, getCaixaResume, getContasPagar, getContasReceber, getVendas,
  getLocacoes, getOcupacoes, getCategorias, getContratos, getCentros, getMetodosPagamento, getMotivosEncerramento,
} from "./db";

// ─── Admin guard ─────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  return next({ ctx });
});

const staffProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "professor") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a staff." });
  }
  return next({ ctx });
});

// ─── App Router ──────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return getDashboardStats();
    }),
    faturamentoMensal: protectedProcedure.query(async () => {
      return getFaturamentoMensal();
    }),
    inadimplentes: protectedProcedure.query(async () => {
      return getAlunosInadimplentes();
    }),
  }),

  // ─── Modalidades ───────────────────────────────────────────────────────────
  modalidades: router({
    list: protectedProcedure.query(async () => getModalidades()),
    create: adminProcedure.input(z.object({
      nome: z.string().min(1),
      descricao: z.string().optional(),
      cor: z.string().optional(),
    })).mutation(async ({ input }) => {
      await createModalidade(input);
      return { success: true };
    }),
  }),

  // ─── Alunos ────────────────────────────────────────────────────────────────
  alunos: router({
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        modalidadeId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => getAlunos(input)),

    byId: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => getAlunoById(input.id)),

    create: staffProcedure
      .input(z.object({
        nome: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        telefone: z.string().optional(),
        cpf: z.string().optional(),
        dataNascimento: z.string().optional(),
        endereco: z.string().optional(),
        responsavel: z.string().optional(),
        telefoneResponsavel: z.string().optional(),
        modalidadeId: z.number().optional(),
        status: z.enum(["ativo", "inativo", "suspenso", "trancado"]).default("ativo"),
        observacoes: z.string().optional(),
        dataMatricula: z.string().optional(),
        diaVencimento: z.number().optional(),
        valorMensalidade: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createAluno(input as any);
        return { success: true };
      }),

    update: staffProcedure
      .input(z.object({
        id: z.number(),
        nome: z.string().optional(),
        email: z.string().optional(),
        telefone: z.string().optional(),
        cpf: z.string().optional(),
        dataNascimento: z.string().optional(),
        endereco: z.string().optional(),
        responsavel: z.string().optional(),
        telefoneResponsavel: z.string().optional(),
        modalidadeId: z.number().optional(),
        status: z.enum(["ativo", "inativo", "suspenso", "trancado"]).optional(),
        observacoes: z.string().optional(),
        diaVencimento: z.number().optional(),
        valorMensalidade: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateAluno(id, data as any);
        return { success: true };
      }),

    myProfile: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const all = await getAlunos();
      const found = all.find(a => a.aluno.userId === ctx.user!.id);
      return found ?? null;
    }),
  }),

  // ─── Professores ───────────────────────────────────────────────────────────
  professores: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => getProfessores(input)),

    byId: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => getProfessorById(input.id)),

    create: adminProcedure
      .input(z.object({
        nome: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        telefone: z.string().optional(),
        cpf: z.string().optional(),
        especialidades: z.string().optional(),
        faixaGraduacao: z.string().optional(),
        modalidadeId: z.number().optional(),
        status: z.enum(["ativo", "inativo"]).default("ativo"),
        bio: z.string().optional(),
        dataAdmissao: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createProfessor(input as any);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nome: z.string().optional(),
        email: z.string().optional(),
        telefone: z.string().optional(),
        especialidades: z.string().optional(),
        faixaGraduacao: z.string().optional(),
        modalidadeId: z.number().optional(),
        status: z.enum(["ativo", "inativo"]).optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProfessor(id, data as any);
        return { success: true };
      }),
  }),

  // ─── Turmas ────────────────────────────────────────────────────────────────
  turmas: router({
    list: protectedProcedure.query(async () => getTurmas()),

    create: adminProcedure
      .input(z.object({
        nome: z.string().min(1),
        modalidadeId: z.number().optional(),
        professorId: z.number().optional(),
        capacidade: z.number().optional(),
        nivel: z.enum(["iniciante", "intermediario", "avancado", "todos"]).optional(),
        descricao: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createTurma(input as any);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nome: z.string().optional(),
        modalidadeId: z.number().optional(),
        professorId: z.number().optional(),
        capacidade: z.number().optional(),
        nivel: z.enum(["iniciante", "intermediario", "avancado", "todos"]).optional(),
        ativo: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateTurma(id, data as any);
        return { success: true };
      }),
  }),

  // ─── Horários ──────────────────────────────────────────────────────────────
  horarios: router({
    list: protectedProcedure
      .input(z.object({ turmaId: z.number().optional() }).optional())
      .query(async ({ input }) => getHorarios(input?.turmaId)),

    create: adminProcedure
      .input(z.object({
        turmaId: z.number(),
        diaSemana: z.enum(["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"]),
        horaInicio: z.string(),
        horaFim: z.string(),
        local: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createHorario(input as any);
        return { success: true };
      }),
  }),

  // ─── Pagamentos ────────────────────────────────────────────────────────────
  pagamentos: router({
    list: protectedProcedure
      .input(z.object({
        alunoId: z.number().optional(),
        status: z.string().optional(),
        mes: z.string().optional(),
      }).optional())
      .query(async ({ input }) => getPagamentos(input)),

    create: staffProcedure
      .input(z.object({
        alunoId: z.number(),
        descricao: z.string().min(1),
        valor: z.string(),
        dataVencimento: z.string(),
        dataPagamento: z.string().optional(),
        status: z.enum(["pendente", "pago", "atrasado", "cancelado"]).default("pendente"),
        metodoPagamento: z.enum(["dinheiro", "pix", "cartao_credito", "cartao_debito", "transferencia", "outro"]).optional(),
        referenciaMes: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createPagamento(input as any);
        return { success: true };
      }),

    update: staffProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendente", "pago", "atrasado", "cancelado"]).optional(),
        dataPagamento: z.string().optional(),
        metodoPagamento: z.enum(["dinheiro", "pix", "cartao_credito", "cartao_debito", "transferencia", "outro"]).optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updatePagamento(id, data as any);
        return { success: true };
      }),

    faturamentoMensal: protectedProcedure.query(async () => getFaturamentoMensal()),

    resumoMes: protectedProcedure
      .input(z.object({ mes: z.string() }))
      .query(async ({ input }) => getFaturamentoDoMes(input.mes)),

    myPayments: protectedProcedure.query(async ({ ctx }) => {
      const all = await getAlunos();
      const aluno = all.find(a => a.aluno.userId === ctx.user!.id);
      if (!aluno) return [];
      return getPagamentos({ alunoId: aluno.aluno.id });
    }),
  }),

  // ─── Presenças ─────────────────────────────────────────────────────────────
  presencas: router({
    list: protectedProcedure
      .input(z.object({
        alunoId: z.number().optional(),
        turmaId: z.number().optional(),
        dataInicio: z.string().optional(),
        dataFim: z.string().optional(),
      }).optional())
      .query(async ({ input }) => getPresencas(input)),

    create: staffProcedure
      .input(z.object({
        alunoId: z.number(),
        turmaId: z.number(),
        horarioAulaId: z.number().optional(),
        data: z.string(),
        presente: z.boolean().default(true),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await createPresenca({ ...input as any, registradoPor: ctx.user.id });
        return { success: true };
      }),

    stats: protectedProcedure
      .input(z.object({ turmaId: z.number().optional() }).optional())
      .query(async ({ input }) => getFrequenciaStats(input?.turmaId)),

    myAttendance: protectedProcedure.query(async ({ ctx }) => {
      const all = await getAlunos();
      const aluno = all.find(a => a.aluno.userId === ctx.user!.id);
      if (!aluno) return [];
      return getPresencas({ alunoId: aluno.aluno.id });
    }),
  }),

  // ─── Graduações ────────────────────────────────────────────────────────────
  graduacoes: router({
    list: protectedProcedure
      .input(z.object({ alunoId: z.number().optional() }).optional())
      .query(async ({ input }) => getGraduacoes(input?.alunoId)),

    create: staffProcedure
      .input(z.object({
        alunoId: z.number(),
        modalidadeId: z.number(),
        faixaAnterior: z.string().optional(),
        faixaNova: z.string().min(1),
        corFaixa: z.string().optional(),
        dataGraduacao: z.string(),
        avaliadorId: z.number().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createGraduacao(input as any);
        return { success: true };
      }),

    myGraduations: protectedProcedure.query(async ({ ctx }) => {
      const all = await getAlunos();
      const aluno = all.find(a => a.aluno.userId === ctx.user!.id);
      if (!aluno) return [];
      return getGraduacoes(aluno.aluno.id);
    }),
  }),

  // ─── CRM ────────────────────────────────────────────────────────────────────
  crm: router({
    leads: router({
      list: protectedProcedure
        .input(z.object({ status: z.string().optional(), search: z.string().optional() }).optional())
        .query(async ({ input }) => {
          return getLeads({ status: input?.status, search: input?.search });
        }),
    }),
    atividades: router({
      list: protectedProcedure
        .input(z.object({ leadId: z.number().optional(), clienteId: z.number().optional() }).optional())
        .query(async ({ input }) => {
          return getAtividades({ leadId: input?.leadId, clienteId: input?.clienteId });
        }),
    }),
  }),

  // ─── Financeiro ────────────────────────────────────────────────────────────
  financeiro: router({
    caixa: router({
      list: protectedProcedure
        .input(z.object({ tipo: z.string().optional(), categoria: z.string().optional() }).optional())
        .query(async ({ input }) => {
          return getCaixa({ tipo: input?.tipo, categoria: input?.categoria });
        }),
      resume: protectedProcedure
        .input(z.object({ mes: z.string() }))
        .query(async ({ input }) => {
          return getCaixaResume(input.mes);
        }),
    }),
    contasPagar: router({
      list: protectedProcedure
        .input(z.object({ status: z.string().optional() }).optional())
        .query(async ({ input }) => {
          return getContasPagar({ status: input?.status });
        }),
    }),
    contasReceber: router({
      list: protectedProcedure
        .input(z.object({ status: z.string().optional(), clienteId: z.number().optional() }).optional())
        .query(async ({ input }) => {
          return getContasReceber({ status: input?.status, clienteId: input?.clienteId });
        }),
    }),
    vendas: router({
      list: protectedProcedure
        .input(z.object({ status: z.string().optional(), tipo: z.string().optional(), clienteId: z.number().optional() }).optional())
        .query(async ({ input }) => {
          return getVendas({ status: input?.status, tipo: input?.tipo, clienteId: input?.clienteId });
        }),
    }),
  }),

  // ─── Agenda ────────────────────────────────────────────────────────────────
  agenda: router({
    locacoes: router({
      list: protectedProcedure
        .input(z.object({ tipo: z.string().optional(), ativo: z.boolean().optional() }).optional())
        .query(async ({ input }) => {
          return getLocacoes({ tipo: input?.tipo, ativo: input?.ativo });
        }),
    }),
    ocupacoes: router({
      list: protectedProcedure
        .input(z.object({ locacaoId: z.number().optional(), turmaId: z.number().optional() }).optional())
        .query(async ({ input }) => {
          return getOcupacoes({ locacaoId: input?.locacaoId, turmaId: input?.turmaId });
        }),
    }),
  }),

  // ─── Administrativo ────────────────────────────────────────────────────────
  administrativo: router({
    categorias: router({
      list: protectedProcedure
        .input(z.object({ tipo: z.string().optional(), ativo: z.boolean().optional() }).optional())
        .query(async ({ input }) => {
          return getCategorias({ tipo: input?.tipo, ativo: input?.ativo });
        }),
    }),
    contratos: router({
      list: protectedProcedure
        .input(z.object({ clienteId: z.number().optional(), status: z.string().optional() }).optional())
        .query(async ({ input }) => {
          return getContratos({ clienteId: input?.clienteId, status: input?.status });
        }),
    }),
    centros: router({
      list: protectedProcedure
        .input(z.object({ tipo: z.string().optional(), ativo: z.boolean().optional() }).optional())
        .query(async ({ input }) => {
          return getCentros({ tipo: input?.tipo, ativo: input?.ativo });
        }),
    }),
    metodosPagamento: router({
      list: protectedProcedure.query(async () => {
        return getMetodosPagamento({ ativo: true });
      }),
    }),
    motivosEncerramento: router({
      list: protectedProcedure.query(async () => {
        return getMotivosEncerramento({ ativo: true });
      }),
    }),
  }),

});

export type AppRouter = typeof appRouter;
