DO $$ BEGIN
 CREATE TYPE "public"."threadMessageSourceTypeEnum" AS ENUM('WEB_PAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Sessions" (
	"sid" varchar(255) PRIMARY KEY NOT NULL,
	"data" json NOT NULL,
	"cookie" json NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"callerUserId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ThreadMessageSources" (
	"id" serial PRIMARY KEY NOT NULL,
	"threadMessageId" integer NOT NULL,
	"type" "threadMessageSourceTypeEnum" NOT NULL,
	"order" integer NOT NULL,
	"title" varchar,
	"link" varchar,
	"snippet" varchar,
	"favicon" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ThreadMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"threadId" integer NOT NULL,
	"sourceType" varchar(255) NOT NULL,
	"webSearchEngineType" varchar(255),
	"order" serial NOT NULL,
	"userQuery" text NOT NULL,
	"userImprovedQuery" text,
	"userTimestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"assistantResponse" text,
	"assistantError" text,
	"assistantTimestamp" timestamp with time zone,
	"assistantModel" varchar(255) NOT NULL,
	"followUpQuestions" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ThreadShareLinkMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"threadMessageId" integer NOT NULL,
	"threadShareLinkId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ThreadShareLinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"creationTimestamp" timestamp with time zone DEFAULT now(),
	"threadId" integer NOT NULL,
	"code" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"creationTimestamp" timestamp with time zone DEFAULT now(),
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"creationTimestamp" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_callerUserId_Users_id_fk" FOREIGN KEY ("callerUserId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ThreadMessageSources" ADD CONSTRAINT "ThreadMessageSources_threadMessageId_ThreadMessages_id_fk" FOREIGN KEY ("threadMessageId") REFERENCES "public"."ThreadMessages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ThreadMessages" ADD CONSTRAINT "ThreadMessages_threadId_Threads_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."Threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ThreadShareLinkMessages" ADD CONSTRAINT "ThreadShareLinkMessages_threadMessageId_ThreadMessages_id_fk" FOREIGN KEY ("threadMessageId") REFERENCES "public"."ThreadMessages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ThreadShareLinkMessages" ADD CONSTRAINT "ThreadShareLinkMessages_threadShareLinkId_ThreadShareLinks_id_fk" FOREIGN KEY ("threadShareLinkId") REFERENCES "public"."ThreadShareLinks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ThreadShareLinks" ADD CONSTRAINT "ThreadShareLinks_threadId_Threads_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."Threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Threads" ADD CONSTRAINT "Threads_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
