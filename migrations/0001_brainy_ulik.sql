ALTER TYPE "threadMessageSourceTypeEnum" ADD VALUE 'IMAGE';--> statement-breakpoint
ALTER TABLE "ThreadMessageSources" ADD COLUMN "thumbnail" varchar;--> statement-breakpoint
ALTER TABLE "ThreadMessageSources" ADD COLUMN "image" varchar;