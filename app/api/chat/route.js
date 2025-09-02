import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { chatAj, guestChatAj } from "@/lib/arcjet-chat";
import { NextResponse } from "next/server";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Helper function to get monthly stats (same as monthly report)
async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}

// Get financial context for authenticated users (using monthly report approach)
async function getFinancialContext(userId) {
  try {
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { accounts: true },
    });

    // If user doesn't exist, create them (this can happen if chatbot is accessed first)
    if (!user) {
      try {
        // Get user details from Clerk
        const clerkUser = await currentUser();

        if (clerkUser) {
          const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
          user = await db.user.create({
            data: {
              clerkUserId: clerkUser.id,
              name,
              imageUrl: clerkUser.imageUrl,
              email: clerkUser.emailAddresses[0].emailAddress,
              preferredCurrency: "USD", // Default currency
            },
            include: { accounts: true },
          });
        }
      } catch (createError) {
        console.error("Error creating user:", createError);
        return null;
      }
    }

    if (!user) {
      return null;
    }

    // Get last 90 days of transactions with account details
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: ninetyDaysAgo,
        },
      },
      include: {
        account: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Get budgets with proper data aggregation
    const budgets = await db.budget.findMany({
      where: { userId: user.id },
    });

    // Calculate budget expenses for current month
    const currentMonth = new Date();
    const budgetExpenses = [];

    for (const budget of budgets) {
      const currentMonthExpenses = await db.transaction.aggregate({
        where: {
          userId: user.id,
          type: "EXPENSE",
          date: {
            gte: new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1
            ),
            lte: new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() + 1,
              0
            ),
          },
        },
        _sum: {
          amount: true,
        },
      });

      const totalExpenses = currentMonthExpenses._sum.amount?.toNumber() || 0;
      budgetExpenses.push({
        id: budget.id,
        amount: budget.amount.toNumber(),
        spent: totalExpenses,
        percentageUsed: (totalExpenses / budget.amount.toNumber()) * 100,
      });
    }

    // If no data exists, return null to trigger the "no data" system prompt
    if (
      transactions.length === 0 &&
      user.accounts.length === 0 &&
      budgets.length === 0
    ) {
      return null;
    }

    // Calculate summary statistics using the same approach as monthly report
    const totalExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const totalBalance = user.accounts.reduce(
      (sum, acc) => sum + acc.balance.toNumber(),
      0
    );

    // Category breakdown using the same approach as monthly report
    const categoryBreakdown = {};
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount.toNumber();
      });

    // Get current month stats (same as monthly report)
    const currentMonthStats = await getMonthlyStats(user.id, new Date());

    // Recent transaction summary
    const recentTransactions = transactions.slice(0, 10).map((t) => ({
      type: t.type,
      amount: t.amount.toNumber(),
      description: t.description,
      category: t.category,
      date: t.date.toISOString().split("T")[0],
      account: t.account.name,
    }));

    return {
      user: {
        name: user.name,
        preferredCurrency: user.preferredCurrency,
      },
      summary: {
        totalExpenses,
        totalIncome,
        totalBalance,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        accountCount: user.accounts.length,
        budgetCount: budgets.length,
      },
      currentMonthStats,
      categoryBreakdown,
      recentTransactions,
      accounts: user.accounts.map((acc) => ({
        name: acc.name,
        type: acc.type,
        balance: acc.balance.toNumber(),
        isDefault: acc.isDefault,
      })),
      budgets: budgetExpenses,
    };
  } catch (error) {
    console.error("Error fetching financial context:", error);
    return null;
  }
}

// Platform information for unauthenticated users
const platformInfo = {
  name: "FineFinance",
  description: "A comprehensive financial management platform",
  features: [
    "Multi-currency support with real-time exchange rates",
    "Transaction tracking and categorization",
    "Budget management and alerts",
    "Account management across multiple banks",
    "AI-powered receipt scanning",
    "Recurring transaction automation",
    "Monthly financial reports",
    "Real-time financial insights",
  ],
  currencies: [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "JPY",
    "CAD",
    "AUD",
    "CHF",
    "CNY",
    "KRW",
    "SGD",
    "HKD",
    "NZD",
    "SEK",
    "NOK",
    "DKK",
    "BRL",
    "MXN",
    "ZAR",
    "RUB",
  ],
  benefits: [
    "Take control of your financial health",
    "Track expenses across multiple accounts",
    "Set and monitor budgets",
    "Get AI-powered financial insights",
    "Secure authentication with Clerk",
    "Beautiful, responsive design",
  ],
};

export async function POST(request) {
  try {
    // Check if required services are available
    if (!genAI) {
      return NextResponse.json(
        {
          error: "service_unavailable",
          message: "Chat service is currently unavailable.",
        },
        { status: 503 }
      );
    }

    const req = await request;
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    // Check authentication
    const { userId } = await auth();
    const isAuthenticated = !!userId;

    // Apply appropriate rate limiting
    const rateLimiter = isAuthenticated ? chatAj : guestChatAj;
    const decision = await rateLimiter.protect(req, {
      userId: isAuthenticated ? userId : "guest", // Use "guest" instead of IP for unauthenticated users
      requested: 1, // Each chat message consumes 1 token
    });

    const maxQuestions = isAuthenticated ? 15 : 5;

    if (decision.isDenied()) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: `You've reached your ${maxQuestions} questions per hour limit. Please try again later.`,
          remainingQuestions: 0,
          maxQuestions,
          resetTime: decision.reason.resetTime,
        },
        { status: 429 }
      );
    }

    // Get remaining questions from the rate limiting reason
    let remainingQuestions = maxQuestions; // Default fallback

    if (
      decision.reason &&
      decision.reason.isRateLimit &&
      decision.reason.isRateLimit()
    ) {
      // For rate limiting, use the remaining property from the reason
      remainingQuestions = decision.reason.remaining || 0;
    } else {
      // For non-rate limiting (successful requests), calculate remaining
      remainingQuestions = Math.max(0, maxQuestions - 1); // Subtract 1 for current request
    }

    let systemContext = "";
    let financialData = null;

    if (isAuthenticated) {
      // Get financial context for authenticated users
      financialData = await getFinancialContext(userId);

      if (financialData) {
        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        systemContext = `
You are FineFinance AI, a helpful financial assistant for this personal portfolio project. You have access to the user's comprehensive financial data.

IMPORTANT: FineFinance is a personal portfolio project created by Akash to demonstrate modern web development skills. It's not a complete commercial platform, but a showcase of Next.js, React, PostgreSQL (Supabase), Prisma ORM, Clerk authentication, and Gemini AI integration capabilities.

USER FINANCIAL OVERVIEW:
- Name: ${financialData.user.name}
- Preferred Currency: ${financialData.user.preferredCurrency}

CURRENT MONTH (${currentMonth}) FINANCIAL SUMMARY:
- Monthly Income: $${financialData.currentMonthStats.totalIncome.toFixed(2)}
- Monthly Expenses: $${financialData.currentMonthStats.totalExpenses.toFixed(2)}
- Net Income This Month: $${(financialData.currentMonthStats.totalIncome - financialData.currentMonthStats.totalExpenses).toFixed(2)}
- Transactions This Month: ${financialData.currentMonthStats.transactionCount}

LAST 90 DAYS OVERVIEW:
- Total Income: $${financialData.summary.totalIncome.toFixed(2)}
- Total Expenses: $${financialData.summary.totalExpenses.toFixed(2)}
- Net Income: $${financialData.summary.netIncome.toFixed(2)}
- Transaction Count: ${financialData.summary.transactionCount}

ACCOUNTS (Current Balances):
${financialData.accounts.map((acc) => `- ${acc.name} (${acc.type}): $${acc.balance.toFixed(2)}${acc.isDefault ? " [Default]" : ""}`).join("\n")}
- Total Balance Across All Accounts: $${financialData.summary.totalBalance.toFixed(2)}

CURRENT MONTH EXPENSE CATEGORIES:
${Object.entries(financialData.currentMonthStats.byCategory)
  .sort(([, a], [, b]) => b - a)
  .map(([cat, amount]) => `- ${cat}: $${amount.toFixed(2)}`)
  .join("\n")}

90-DAY EXPENSE CATEGORIES:
${Object.entries(financialData.categoryBreakdown)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 8)
  .map(([cat, amount]) => `- ${cat}: $${amount.toFixed(2)}`)
  .join("\n")}

RECENT TRANSACTIONS (Last 10):
${financialData.recentTransactions.map((t) => `- ${t.date}: ${t.type} - $${t.amount.toFixed(2)} - ${t.description} (${t.category}) [${t.account}]`).join("\n")}

BUDGET STATUS:
${
  financialData.budgets.length > 0
    ? financialData.budgets
        .map(
          (b) =>
            `- Budget: $${b.spent.toFixed(2)}/$${b.amount.toFixed(2)} (${b.percentageUsed.toFixed(1)}% used)`
        )
        .join("\n")
    : "- No budgets set up yet"
}

Provide helpful, personalized financial advice based on this real data from their Supabase PostgreSQL database. Be conversational, friendly, and focus on actionable insights. Help with budgeting, expense analysis, financial planning, and money management questions. You can reference specific transactions, spending patterns, and account balances. Always remind users that this is a portfolio project showcasing full-stack development skills when relevant.
`;
      } else {
        systemContext = `
You are FineFinance AI, a helpful financial assistant for this personal portfolio project.

IMPORTANT: FineFinance is a personal portfolio project created by Akash to demonstrate modern web development skills using Next.js, React, PostgreSQL (Supabase), Prisma ORM, Clerk authentication, and Gemini AI integration. It's not a complete commercial platform, but a showcase of full-stack development capabilities.

The user is authenticated but doesn't have any financial data yet (no accounts, transactions, or budgets set up in the database).

Guide the user to get started with this demo project:
1. **Create an Account**: They need to add at least one account to start tracking finances
2. **Add Transactions**: Once they have an account, they can start recording income and expenses  
3. **Set Up Budgets**: Help them create budgets for different categories

Encourage them to:
- Go to the Dashboard to create their first account
- Use the transaction page to add sample income and expenses
- Set up budgets to see how the tracking works

Since this is a portfolio project, explain:
- This demonstrates real-time financial data management
- Integration with PostgreSQL database via Supabase
- AI-powered insights using Gemini
- Secure authentication with Clerk
- Multi-currency support and responsive design

Focus on helping them explore the project features while providing genuine financial guidance.
`;
      }
    } else {
      // Unauthenticated users - only platform information
      systemContext = `
You are FineFinance AI assistant. The user is NOT authenticated, so you can ONLY provide information about the FineFinance platform itself.

IMPORTANT: FineFinance is a personal portfolio project created by Akash to demonstrate modern web development skills. It's not a complete commercial platform, but a showcase of Next.js, React, PostgreSQL (Supabase), Prisma ORM, Clerk authentication, and Gemini AI integration.

PLATFORM INFORMATION:
Name: ${platformInfo.name}
Description: ${platformInfo.description} (Portfolio Project)

Technical Stack Demonstrated:
- Next.js 15 with React
- PostgreSQL database via Supabase
- Prisma ORM for database management
- Clerk for authentication
- Gemini AI for financial insights
- Multi-currency support with real-time conversion
- Responsive design with Tailwind CSS

Key Features:
${platformInfo.features.map((f) => `- ${f}`).join("\n")}

Supported Currencies:
${platformInfo.currencies.join(", ")}

Project Benefits:
${platformInfo.benefits.map((b) => `- ${b}`).join("\n")}

IMPORTANT RULES:
1. ONLY answer questions about FineFinance platform features and capabilities
2. Always mention this is a portfolio/demonstration project by Akash
3. DO NOT provide personal financial advice to unauthenticated users
4. Encourage users to sign up to explore the full functionality
5. Explain the technical implementation when relevant

Always remind unauthenticated users they need to sign up or log in to access the full financial management features and get personalized AI-powered insights.
`;
    }

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext =
        "\n\nPREVIOUS CONVERSATION:\n" +
        conversationHistory
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n");
    }

    const fullPrompt =
      systemContext + conversationContext + `\n\nUser: ${message}`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return NextResponse.json({
      message: response,
      remainingQuestions,
      maxQuestions,
      isAuthenticated,
      hasFinancialData: !!financialData,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message:
          "Sorry, I'm experiencing technical difficulties. Please try again later.",
      },
      { status: 500 }
    );
  }
}
