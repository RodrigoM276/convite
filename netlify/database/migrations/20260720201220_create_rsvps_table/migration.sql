CREATE TABLE "rsvps" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"guest_count" integer NOT NULL,
	"message" text DEFAULT '',
	"created_at" timestamp DEFAULT now()
);
