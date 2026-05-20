CREATE TABLE `quiz_results` (
	`result_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`language` text NOT NULL,
	`module` text NOT NULL,
	`difficulty` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`answers` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
