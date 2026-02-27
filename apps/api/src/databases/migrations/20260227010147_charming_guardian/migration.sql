DROP INDEX "users_email_idx";--> statement-breakpoint
DROP INDEX "sessions_token_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE citext USING "email"::citext;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_account_id_idx" ON "accounts" ("provider_id","account_id");