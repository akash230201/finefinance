"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  console.log("🔄 Starting email send process...");
  console.log("📧 To:", to);
  console.log("📝 Subject:", subject);
  console.log("🔑 API Key exists:", !!process.env.RESEND_API_KEY);
  console.log("🔑 API Key length:", process.env.RESEND_API_KEY?.length || 0);

  if (!process.env.RESEND_API_KEY) {
    const error = "RESEND_API_KEY is not set in environment variables";
    console.error("❌", error);
    throw new Error(error);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log("📤 Attempting to send email via Resend...");

    const emailData = {
      from: "Budget Alert <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to], // Ensure to is an array
      subject,
      react,
    };

    console.log("📋 Email data:", JSON.stringify(emailData, null, 2));

    const data = await resend.emails.send(emailData);

    console.log("✅ Email sent successfully via Resend:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Resend API error:", error);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    // Re-throw the error so it can be caught by the calling function
    throw error;
  }
}
