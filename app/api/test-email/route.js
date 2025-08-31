import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/template";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Starting email test...");

    // Check environment
    console.log("🔍 Environment check:");
    console.log("- RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log(
      "- RESEND_API_KEY length:",
      process.env.RESEND_API_KEY?.length || 0
    );

    const testEmail = "devtestakashv1@gmail.com"; // REPLACE WITH YOUR ACTUAL EMAIL

    if (!testEmail) {
      throw new Error(
        "Please replace the empty testEmail with your actual email address"
      );
    }

    const result = await sendEmail({
      to: testEmail,
      subject: "🧪 Test Budget Alert - FineFinance",
      react: EmailTemplate({
        userName: "Test User",
        type: "budget-alert",
        data: {
          percentageUsed: 85,
          budgetAmount: 1000,
          totalExpenses: 850,
          accountName: "Test Account",
        },
      }),
    });

    console.log("✅ Test email completed successfully");
    return NextResponse.json({
      success: true,
      result,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
