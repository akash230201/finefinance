"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/currency-display";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { updateDefaultAccount } from "@/actions/accounts";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("You need atleast 1 default account.");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully.");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account.");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 ease-in-out group relative border-border/60 hover:border-border/80">
      <Link href={`/accounts/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize tracking-tight">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground/90">
            <CurrencyDisplay amount={parseFloat(balance)} />
          </div>
          <p className="text-xs text-muted-foreground/80 mb-2 tracking-wide">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground/70">
          <div className="flex items-center transition-colors duration-200 hover:text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500 transition-transform duration-200 group-hover:scale-110" />
            Income
          </div>
          <div className="flex items-center transition-colors duration-200 hover:text-red-600">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500 transition-transform duration-200 group-hover:scale-110" />
            Expenses
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
