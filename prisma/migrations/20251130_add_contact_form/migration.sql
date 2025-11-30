CREATE TABLE "ContactForm" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "shop" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "submittedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE
);
