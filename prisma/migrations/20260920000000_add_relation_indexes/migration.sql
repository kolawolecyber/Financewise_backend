CREATE INDEX IF NOT EXISTS "Budget_userId_idx" ON "public"."Budget"("userId");
CREATE INDEX IF NOT EXISTS "Expense_userId_idx" ON "public"."Expense"("userId");
CREATE INDEX IF NOT EXISTS "Expense_budgetId_idx" ON "public"."Expense"("budgetId");
CREATE INDEX IF NOT EXISTS "Goal_userId_idx" ON "public"."Goal"("userId");
CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "public"."Category"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "public"."Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_categoryId_idx" ON "public"."Transaction"("categoryId");
