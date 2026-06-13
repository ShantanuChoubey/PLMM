-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- AlterTable: add sessions relation to learner_profiles (no schema change needed, handled by FK)

-- AlterTable: add sessions relation to mentor_profiles (no schema change needed, handled by FK)

-- AlterTable: add sessions relation to availability_slots (no schema change needed, handled by FK)

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "meetingLink" TEXT,
    "notes" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_learnerId_idx" ON "sessions"("learnerId");

-- CreateIndex
CREATE INDEX "sessions_mentorId_idx" ON "sessions"("mentorId");

-- CreateIndex
CREATE INDEX "sessions_slotId_idx" ON "sessions"("slotId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_learnerId_fkey"
    FOREIGN KEY ("learnerId") REFERENCES "learner_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_mentorId_fkey"
    FOREIGN KEY ("mentorId") REFERENCES "mentor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_slotId_fkey"
    FOREIGN KEY ("slotId") REFERENCES "availability_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
