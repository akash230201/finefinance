import { getUserAccounts } from "@/actions/dashboard";
import { db } from "@/lib/prisma";
import React from "react";
import AddTransactionForm from "../_components/transaction-form";
import { defaultCategories } from "@/data/categories";
import { redirect } from "next/navigation";

const AddTransactionPage = async ({ searchParams }) => {
  const rawAccounts = await getUserAccounts();
  const editId = searchParams?.edit;
  const isEditMode = !!editId;

  // Ensure all account balances are properly serialized (fix for Decimal objects)
  const accounts = rawAccounts.map((account) => ({
    ...account,
    balance:
      typeof account.balance === "object" && account.balance !== null
        ? parseFloat(account.balance.toString())
        : account.balance,
  }));

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
