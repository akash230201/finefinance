import { CurrencyDashboard } from "@/components/currency-dashboard";

export default function CurrencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-teal-600 bg-clip-text text-transparent">
            Currency Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your currency preferences, view exchange rates, and convert
            between currencies with live data
          </p>
        </div>

        {/* Currency Dashboard */}
        <CurrencyDashboard />
      </div>
    </div>
  );
}
