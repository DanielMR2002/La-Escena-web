-- CreateEnum
CREATE TYPE "MessageAudience" AS ENUM ('ALL', 'SELECTED');

CREATE TABLE "AdminMessage" (
    "id"        TEXT NOT NULL,
    "subject"   TEXT NOT NULL,
    "body"      TEXT NOT NULL,
    "audience"  "MessageAudience" NOT NULL,
    "sentById"  TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageRecipient" (
    "id"        TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "readAt"    TIMESTAMP(3),

    CONSTRAINT "MessageRecipient_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MessageRecipient_messageId_userId_key" ON "MessageRecipient"("messageId", "userId");

ALTER TABLE "AdminMessage" ADD CONSTRAINT "AdminMessage_sentById_fkey"
    FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MessageRecipient" ADD CONSTRAINT "MessageRecipient_messageId_fkey"
    FOREIGN KEY ("messageId") REFERENCES "AdminMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MessageRecipient" ADD CONSTRAINT "MessageRecipient_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
