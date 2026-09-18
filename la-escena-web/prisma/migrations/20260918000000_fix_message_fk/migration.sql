-- MessageRecipient.messageId apuntaba por error a una tabla huérfana "Message"
-- en vez de "AdminMessage" (la tabla real que usa el modelo Prisma AdminMessage).
-- Esto hacía que cualquier envío de mensaje violara la foreign key.

ALTER TABLE "MessageRecipient" DROP CONSTRAINT "MessageRecipient_messageId_fkey";

ALTER TABLE "MessageRecipient" ADD CONSTRAINT "MessageRecipient_messageId_fkey"
    FOREIGN KEY ("messageId") REFERENCES "AdminMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Opcional pero recomendado: la tabla "Message" quedó huérfana y vacía, sin uso.
DROP TABLE IF EXISTS "Message";
