CREATE TABLE `alunos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`nome` varchar(150) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(30),
	`cpf` varchar(20),
	`dataNascimento` date,
	`endereco` text,
	`responsavel` varchar(150),
	`telefoneResponsavel` varchar(30),
	`modalidadeId` int,
	`status` enum('ativo','inativo','suspenso','trancado') NOT NULL DEFAULT 'ativo',
	`foto` text,
	`observacoes` text,
	`dataMatricula` date,
	`diaVencimento` int DEFAULT 10,
	`valorMensalidade` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alunos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `graduacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`modalidadeId` int NOT NULL,
	`faixaAnterior` varchar(50),
	`faixaNova` varchar(50) NOT NULL,
	`corFaixa` varchar(20),
	`dataGraduacao` date NOT NULL,
	`avaliadorId` int,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `graduacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `horarios_aulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`turmaId` int NOT NULL,
	`diaSemana` enum('segunda','terca','quarta','quinta','sexta','sabado','domingo') NOT NULL,
	`horaInicio` time NOT NULL,
	`horaFim` time NOT NULL,
	`local` varchar(100),
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `horarios_aulas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matriculas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`turmaId` int NOT NULL,
	`dataMatricula` date NOT NULL,
	`status` enum('ativa','inativa','suspensa') NOT NULL DEFAULT 'ativa',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matriculas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modalidades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`cor` varchar(20) DEFAULT '#e67e22',
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modalidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pagamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`descricao` varchar(200) NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`dataVencimento` date NOT NULL,
	`dataPagamento` date,
	`status` enum('pendente','pago','atrasado','cancelado') NOT NULL DEFAULT 'pendente',
	`metodoPagamento` enum('dinheiro','pix','cartao_credito','cartao_debito','transferencia','outro'),
	`referenciaMes` varchar(7),
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presencas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`turmaId` int NOT NULL,
	`horarioAulaId` int,
	`data` date NOT NULL,
	`presente` boolean NOT NULL DEFAULT true,
	`observacoes` text,
	`registradoPor` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `presencas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`nome` varchar(150) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(30),
	`cpf` varchar(20),
	`especialidades` text,
	`faixaGraduacao` varchar(50),
	`modalidadeId` int,
	`status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
	`foto` text,
	`bio` text,
	`dataAdmissao` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `turmas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`modalidadeId` int,
	`professorId` int,
	`capacidade` int DEFAULT 30,
	`nivel` enum('iniciante','intermediario','avancado','todos') DEFAULT 'todos',
	`ativo` boolean NOT NULL DEFAULT true,
	`descricao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `turmas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','professor','aluno') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_modalidadeId_modalidades_id_fk` FOREIGN KEY (`modalidadeId`) REFERENCES `modalidades`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `graduacoes` ADD CONSTRAINT `graduacoes_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `graduacoes` ADD CONSTRAINT `graduacoes_modalidadeId_modalidades_id_fk` FOREIGN KEY (`modalidadeId`) REFERENCES `modalidades`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `graduacoes` ADD CONSTRAINT `graduacoes_avaliadorId_professores_id_fk` FOREIGN KEY (`avaliadorId`) REFERENCES `professores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `horarios_aulas` ADD CONSTRAINT `horarios_aulas_turmaId_turmas_id_fk` FOREIGN KEY (`turmaId`) REFERENCES `turmas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matriculas` ADD CONSTRAINT `matriculas_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matriculas` ADD CONSTRAINT `matriculas_turmaId_turmas_id_fk` FOREIGN KEY (`turmaId`) REFERENCES `turmas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagamentos` ADD CONSTRAINT `pagamentos_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presencas` ADD CONSTRAINT `presencas_alunoId_alunos_id_fk` FOREIGN KEY (`alunoId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presencas` ADD CONSTRAINT `presencas_turmaId_turmas_id_fk` FOREIGN KEY (`turmaId`) REFERENCES `turmas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presencas` ADD CONSTRAINT `presencas_horarioAulaId_horarios_aulas_id_fk` FOREIGN KEY (`horarioAulaId`) REFERENCES `horarios_aulas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presencas` ADD CONSTRAINT `presencas_registradoPor_users_id_fk` FOREIGN KEY (`registradoPor`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professores` ADD CONSTRAINT `professores_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professores` ADD CONSTRAINT `professores_modalidadeId_modalidades_id_fk` FOREIGN KEY (`modalidadeId`) REFERENCES `modalidades`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_modalidadeId_modalidades_id_fk` FOREIGN KEY (`modalidadeId`) REFERENCES `modalidades`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_professorId_professores_id_fk` FOREIGN KEY (`professorId`) REFERENCES `professores`(`id`) ON DELETE no action ON UPDATE no action;