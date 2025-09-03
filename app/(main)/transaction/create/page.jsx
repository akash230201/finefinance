import { getUserAccounts } from "@/actions/dashboard";
import { db } from "@/lib/prisma";
import React from "react";
import AddTransactionForm from "../_components/transaction-form";
import { defaultCategories } from "@/data/categories";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Plus, ArrowLeft } from "lucide-react";

const AddTransactionPage = async ({ searchParams }) => {
  const accounts = await getUserAccounts();
  const resolvedSearchParams = await searchParams;
  const editId = resolvedSearchParams?.edit;
  const isEditMode = !!editId;

  // If no accounts exist, show message to create account first
  if (!accounts || accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-teal-600 bg-clip-text text-transparent">
              Add New Transaction
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your financial activities with ease
            </p>
          </div>

          {/* No Accounts Message */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-900/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-amber-800 dark:text-amber-200">
                  Create an Account First
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  Before adding transactions, you need to create at least one
                  account to organize your finances
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Accounts help organize your transactions and track your
                    finances across different sources like checking accounts,
                    savings accounts, or credit cards.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="flex-1 sm:flex-none">
                      <Link href="/dashboard">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Account
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 sm:flex-none"
                    >
                      <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium text-sm mb-2 text-foreground/90">
                    Quick Steps:
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Go to your Dashboard</li>
                    <li>2. Click "Add New Account"</li>
                    <li>3. Fill in your account details</li>
                    <li>4. Return here to add transactions</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  let transactionData = null;

  // Fetch transaction data if in edit mode
  if (isEditMode) {
    try {
      const rawTransactionData = await db.transaction.findUnique({
        where: {
          id: editId,
        },
        include: {
          account: true,
        },
      });

      // If transaction not found, redirect to create page
      if (!rawTransactionData) {
        redirect("/transaction/create");
      }

      // Convert Decimal amount to number for client component serialization
      transactionData = {
        ...rawTransactionData,
        amount: parseFloat(rawTransactionData.amount.toString()),
      };
    } catch (error) {
      console.error("Error fetching transaction:", error);
      redirect("/transaction/create");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-teal-600 bg-clip-text text-transparent">
            {isEditMode ? "Update Transaction" : "Add New Transaction"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEditMode
              ? "Modify the transaction details below to update your financial records and keep your budget accurate"
              : "Record your income and expenses to keep track of your financial activities and maintain accurate budget monitoring"}
          </p>
        </div>

        {/* Form Section */}
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={isEditMode}
          initialData={transactionData}
        />
      </div>
    </div>
  );
};

export default AddTransactionPage;
