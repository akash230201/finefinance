import { getUserAccounts } from "@/actions/dashboard";
import React from "react";
import AddTransactionForm from "../_components/transaction-form";
import { defaultCategories } from "@/data/categories";

const AddTransactionPage = async () => {
  const account = await getUserAccounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-teal-600 bg-clip-text text-transparent">
            Add New Transaction
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Record your income and expenses to keep track of your financial
            activities and maintain accurate budget monitoring
          </p>
        </div>

        {/* Form Section */}
        <AddTransactionForm accounts={account} categories={defaultCategories} />
      </div>
    </div>
  );
};

export default AddTransactionPage;
