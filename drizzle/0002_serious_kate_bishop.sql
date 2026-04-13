CREATE TABLE `atividades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`clienteId` int,
	`tipo` enum('email','sms','whatsapp','telefone','instagram','reuniao','outro') NOT NULL,
	`titulo` varchar(200) NOT NULL,
	`descricao` text,
	`dataAtividade` timestamp NOT NULL,
	`concluida` boolean DEFAULT false,
	`responsavelId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `atividades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `caixa` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('entrada','saida') NOT NULL,
	`descricao` varchar(200) NOT NULL,
	`valor` decimal(12,2) NOT NULL,
	`data` date NOT NULL,
	`categoria` varchar(100),
	`centroCusto` varchar(100),
	`centroReceita` varchar(100),
	`metodoPagamento` enum('dinheiro','pix','cartao_credito','cartao_debito','transferencia','outro'),
	`referencia` varchar(100),
	`registradoPor` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `caixa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categorias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('cliente','lead','produto','despesa') NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categorias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `centros` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('custo','receita') NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(150) NOT NULL,
	`descricao` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `centros_id` PRIMARY KEY(`id`),
	CONSTRAINT `centros_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `contas_pagar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fornecedor` varchar(150) NOT NULL,
	`descricao` varchar(200) NOT NULL,
	`valor` decimal(12,2) NOT NULL,
	`dataVencimento` date NOT NULL,
	`dataPagamento` date,
	`status` enum('pendente','pago','atrasado','cancelado') DEFAULT 'pendente',
	`categoria` varchar(100),
	`centroCusto` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contas_pagar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contas_receber` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int,
	`descricao` varchar(200) NOT NULL,
	`valor` decimal(12,2) NOT NULL,
	`dataVencimento` date NOT NULL,
	`dataPagamento` date,
	`status` enum('pendente','pago','atrasado','cancelado') DEFAULT 'pendente',
	`categoria` varchar(100),
	`centroReceita` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contas_receber_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contratos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int NOT NULL,
	`tipo` enum('acesso','servico','produto') NOT NULL,
	`dataInicio` date NOT NULL,
	`dataFim` date,
	`valor` decimal(12,2) NOT NULL,
	`status` enum('ativo','encerrado','suspenso') DEFAULT 'ativo',
	`descricao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contratos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(150) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(30),
	`whatsapp` varchar(30),
	`instagram` varchar(100),
	`categoria` varchar(50),
	`origem` enum('direto','google','instagram','whatsapp','indicacao','outro') DEFAULT 'direto',
	`status` enum('novo','contatado','interessado','proposta','convertido','descartado') DEFAULT 'novo',
	`dataContato` date,
	`proximoContato` date,
	`observacoes` text,
	`responsavelId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`tipo` enum('tatame','sala','quadra','piscina','outro') NOT NULL,
	`capacidade` int DEFAULT 30,
	`descricao` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `locacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metodos_pagamento` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`tipo` enum('dinheiro','pix','cartao_credito','cartao_debito','transferencia','outro') NOT NULL,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metodos_pagamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `motivos_encerramento` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `motivos_encerramento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ocupacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`locacaoId` int NOT NULL,
	`turmaId` int,
	`dataInicio` timestamp NOT NULL,
	`dataFim` timestamp NOT NULL,
	`ocupacao` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ocupacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `perfis_acesso` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`permissoes` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `perfis_acesso_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int,
	`descricao` varchar(200) NOT NULL,
	`valor` decimal(12,2) NOT NULL,
	`dataVenda` date NOT NULL,
	`dataPagamento` date,
	`status` enum('pendente','pago','cancelado') DEFAULT 'pendente',
	`tipo` enum('modalidade','produto','servico','outro') DEFAULT 'modalidade',
	`centroReceita` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vendas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `atividades` ADD CONSTRAINT `atividades_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `atividades` ADD CONSTRAINT `atividades_clienteId_alunos_id_fk` FOREIGN KEY (`clienteId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `atividades` ADD CONSTRAINT `atividades_responsavelId_users_id_fk` FOREIGN KEY (`responsavelId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caixa` ADD CONSTRAINT `caixa_registradoPor_users_id_fk` FOREIGN KEY (`registradoPor`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contas_receber` ADD CONSTRAINT `contas_receber_clienteId_alunos_id_fk` FOREIGN KEY (`clienteId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contratos` ADD CONSTRAINT `contratos_clienteId_alunos_id_fk` FOREIGN KEY (`clienteId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_responsavelId_users_id_fk` FOREIGN KEY (`responsavelId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ocupacoes` ADD CONSTRAINT `ocupacoes_locacaoId_locacoes_id_fk` FOREIGN KEY (`locacaoId`) REFERENCES `locacoes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ocupacoes` ADD CONSTRAINT `ocupacoes_turmaId_turmas_id_fk` FOREIGN KEY (`turmaId`) REFERENCES `turmas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendas` ADD CONSTRAINT `vendas_clienteId_alunos_id_fk` FOREIGN KEY (`clienteId`) REFERENCES `alunos`(`id`) ON DELETE no action ON UPDATE no action;