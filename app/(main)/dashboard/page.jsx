import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budget-progress";
import { Suspense } from "react";
import DashboardOverview from "./_components/transaction-overview";

async function DashboardPage() {
  const account = await getUserAccounts();

  const defaultAccount = account?.find((acc) => acc.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* budgetProgress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Overview */}
      <Suspense fallback={<div>Loading overview...</div>}>
        <DashboardOverview
          account={account}
          transactions={transactions || []}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        <CreateAccountDrawer>
          <Card
            className={
              "cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
            }
          >
            <CardContent
              className={
                "flex flex-col items-center justify-center h-full text-center space-y-2 text-muted-foreground"
              }
            >
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {account.length > 0 &&
          account.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
}

export default DashboardPage;
