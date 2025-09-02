import { inngest } from "@/lib/inngest/client";
import {
  checkBudgetAlerts,
  processRecurringTransaction,
  triggerRecurringTransactions,
  generateMonthlyReports,
} from "@/lib/inngest/functions";
import { serve } from "inngest/next";

// Inngest API route for background job processing
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts,
    triggerRecurringTransactions,
    processRecurringTransaction,
    generateMonthlyReports,
  ],
});
