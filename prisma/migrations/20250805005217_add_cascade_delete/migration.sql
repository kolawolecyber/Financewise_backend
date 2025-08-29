-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_budgetId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "public"."Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
