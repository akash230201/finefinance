import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Hr,
  Link,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {
    percentageUsed: 85,
    budgetAmount: 1000,
    totalExpenses: 850,
    accountName: "Default Account",
  },
}) {
  if (type === "monthly-report") {
    const { stats, month, insights = [] } = data;
    const netIncome = stats.totalIncome - stats.totalExpenses;
    const isPositiveNet = netIncome >= 0;
    const topExpenseCategory = Object.entries(stats.byCategory || {}).sort(
      ([, a], [, b]) => b - a
    )[0];

    return (
      <Html>
        <Head />
        <Preview>
          Your {month} Financial Report - ${stats.totalIncome.toFixed(2)}{" "}
          income, ${stats.totalExpenses.toFixed(2)} expenses
        </Preview>
        <Body style={bodyStyle}>
          <Container style={containerStyle}>
            {/* Header */}
            <Section style={headerStyle}>
              <Text style={logoTextStyle}>FineFinance</Text>
            </Section>

            {/* Main Content */}
            <Section style={contentStyle}>
              <Heading style={titleStyle}>
                Your {month}{" "}
                <span style={{ color: "#3ab0a2" }}>Financial Report</span>
              </Heading>

              <Text style={greetingStyle}>Hello {userName},</Text>

              <Text style={introTextStyle}>
                Here's a comprehensive overview of your financial activity for{" "}
                {month}. We've included AI-powered insights to help you make
                better financial decisions.
              </Text>

              {/* Monthly Summary Stats */}
              <Section>
                <Heading style={sectionTitleStyle}>📊 Monthly Summary</Heading>
                <Row style={statsRowStyle}>
                  <Column style={statColumnStyle}>
                    <Section style={statBoxStyle}>
                      <Text style={statLabelStyle}>Total Income</Text>
                      <Text style={{ ...statValueStyle, color: "#10b981" }}>
                        ${stats.totalIncome.toFixed(2)}
                      </Text>
                    </Section>
                  </Column>

                  <Column style={statColumnStyle}>
                    <Section style={statBoxStyle}>
                      <Text style={statLabelStyle}>Total Expenses</Text>
                      <Text style={{ ...statValueStyle, color: "#ef4444" }}>
                        ${stats.totalExpenses.toFixed(2)}
                      </Text>
                    </Section>
                  </Column>

                  <Column style={statColumnStyle}>
                    <Section style={statBoxStyle}>
                      <Text style={statLabelStyle}>Net Income</Text>
                      <Text
                        style={{
                          ...statValueStyle,
                          color: isPositiveNet ? "#10b981" : "#ef4444",
                        }}
                      >
                        {isPositiveNet ? "+" : ""}${netIncome.toFixed(2)}
                      </Text>
                    </Section>
                  </Column>
                </Row>

                {/* Transaction Count */}
                <Section style={metricBoxStyle}>
                  <Text style={metricLabelStyle}>Total Transactions</Text>
                  <Text style={metricValueStyle}>{stats.transactionCount}</Text>
                </Section>
              </Section>

              {/* Top Expense Category */}
              {topExpenseCategory && (
                <Section>
                  <Heading style={sectionTitleStyle}>
                    💳 Top Expense Category
                  </Heading>
                  <Section style={categoryBoxStyle}>
                    <Text style={categoryNameStyle}>
                      {topExpenseCategory[0]}
                    </Text>
                    <Text style={categoryAmountStyle}>
                      ${topExpenseCategory[1].toFixed(2)}
                    </Text>
                  </Section>
                </Section>
              )}

              {/* AI Insights */}
              {insights.length > 0 && (
                <Section>
                  <Heading style={sectionTitleStyle}>
                    🤖 AI-Powered Insights
                  </Heading>
                  {insights.map((insight, index) => (
                    <Section key={index} style={insightBoxStyle}>
                      <Text style={insightTextStyle}>
                        <strong>{index + 1}.</strong> {insight}
                      </Text>
                    </Section>
                  ))}
                </Section>
              )}

              {/* Expense Breakdown */}
              {Object.keys(stats.byCategory || {}).length > 0 && (
                <Section>
                  <Heading style={sectionTitleStyle}>
                    📈 Expense Breakdown
                  </Heading>
                  <Section style={breakdownContainerStyle}>
                    {Object.entries(stats.byCategory)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, amount]) => (
                        <Row key={category} style={breakdownRowStyle}>
                          <Column style={breakdownCategoryStyle}>
                            <Text style={breakdownCategoryTextStyle}>
                              {category}
                            </Text>
                          </Column>
                          <Column style={breakdownAmountStyle}>
                            <Text style={breakdownAmountTextStyle}>
                              ${amount.toFixed(2)}
                            </Text>
                          </Column>
                        </Row>
                      ))}
                  </Section>
                </Section>
              )}

              {/* Call to Action */}
              <Section style={ctaContainerStyle}>
                <Button
                  style={buttonStyle}
                  href="https://finefinance.vercel.app/dashboard"
                >
                  View Full Dashboard
                </Button>
              </Section>

              {/* Tip Section */}
              <Section style={tipStyle}>
                <Text style={tipTextStyle}>
                  <strong>💡 Tip:</strong> Regular financial reviews help you
                  stay on track with your goals. Consider setting up budgets for
                  your top expense categories.
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Hr style={dividerStyle} />
            <Section style={footerStyle}>
              <Text style={footerTextStyle}>
                © 2025 FineFinance •{" "}
                <Link
                  href="https://twitter.com/finefinance"
                  style={socialLinkStyle}
                >
                  Twitter
                </Link>
                {" • "}
                <Link
                  href="https://linkedin.com/company/finefinance"
                  style={socialLinkStyle}
                >
                  LinkedIn
                </Link>
                {" • "}
                <Link
                  href="https://github.com/finefinance"
                  style={socialLinkStyle}
                >
                  GitHub
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    // Calculate remaining amount and set appropriate color based on percentage used
    const remainingAmount = data.budgetAmount - data.totalExpenses;
    const isOverBudget = remainingAmount < 0;
    const percentageColor =
      data.percentageUsed >= 90
        ? "#ef4444" // Red for critical
        : data.percentageUsed >= 75
          ? "#f59e0b" // Orange for warning
          : "#3ab0a2"; // Teal for normal

    return (
      <Html>
        <Head />
        <Preview>
          Budget Alert: You've used {data.percentageUsed.toFixed(1)}% of your
          monthly budget
        </Preview>
        <Body style={bodyStyle}>
          <Container style={containerStyle}>
            {/* Header */}
            <Section style={headerStyle}>
              <Text style={logoTextStyle}>FineFinance</Text>
            </Section>

            {/* Main Content */}
            <Section style={contentStyle}>
              <Heading style={titleStyle}>
                Budget <span style={{ color: percentageColor }}>Alert</span>
              </Heading>

              <Text style={greetingStyle}>Hello {userName},</Text>

              <Section style={alertBoxStyle}>
                <Text style={{ ...alertTextStyle, color: percentageColor }}>
                  You have used{" "}
                  <strong>{data.percentageUsed.toFixed(1)}%</strong> of your
                  monthly budget for {data.accountName}.
                </Text>
              </Section>

              {/* Progress Bar */}
              <Section style={progressContainerStyle}>
                <div
                  style={{
                    ...progressBarStyle,
                    width: `${Math.min(100, data.percentageUsed)}%`,
                    backgroundColor: percentageColor,
                  }}
                />
              </Section>

              {/* Stats Grid */}
              <Section>
                <Row style={statsRowStyle}>
                  <Column style={statColumnStyle}>
                    <Section style={statBoxStyle}>
                      <Text style={statLabelStyle}>Budget Amount</Text>
                      <Text style={statValueStyle}>
                        ${data.budgetAmount.toFixed(2)}
                      </Text>
                    </Section>
                  </Column>

                  <Column style={statColumnStyle}>
                    <Section style={statBoxStyle}>
                      <Text style={statLabelStyle}>Amount Used</Text>
                      <Text style={statValueStyle}>
                        ${data.totalExpenses.toFixed(2)}
                      </Text>
                    </Section>
                  </Column>

                  <Column style={statColumnStyle}>
                    <Section style={statBoxStyle}>
                      <Text style={statLabelStyle}>
                        {isOverBudget ? "Over Budget" : "Remaining"}
                      </Text>
                      <Text
                        style={{
                          ...statValueStyle,
                          color: isOverBudget ? "#ef4444" : "#10b981",
                        }}
                      >
                        {isOverBudget ? "-" : ""}$
                        {Math.abs(remainingAmount).toFixed(2)}
                      </Text>
                    </Section>
                  </Column>
                </Row>
              </Section>

              {/* Call to Action */}
              <Section style={ctaContainerStyle}>
                <Button
                  style={buttonStyle}
                  href="https://finefinance.vercel.app/dashboard"
                >
                  View Your Budget
                </Button>
              </Section>

              {/* Tip Section */}
              <Section style={tipStyle}>
                <Text style={tipTextStyle}>
                  <strong>💡 Tip:</strong> Review your recent expenses to
                  identify areas where you can cut back this month.
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Hr style={dividerStyle} />
            <Section style={footerStyle}>
              <Text style={footerTextStyle}>
                © 2025 FineFinance •{" "}
                <Link
                  href="https://twitter.com/finefinance"
                  style={socialLinkStyle}
                >
                  Twitter
                </Link>
                {" • "}
                <Link
                  href="https://linkedin.com/company/finefinance"
                  style={socialLinkStyle}
                >
                  LinkedIn
                </Link>
                {" • "}
                <Link
                  href="https://github.com/finefinance"
                  style={socialLinkStyle}
                >
                  GitHub
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  // Default fallback
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Text>Email template type not supported</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: "#f9fafb",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  WebkitFontSmoothing: "antialiased",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  margin: "0 auto",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const headerStyle = {
  background: "linear-gradient(135deg, #1a2e3b 0%, #3ab0a2 100%)",
  padding: "20px 0",
  textAlign: "center",
};

const logoTextStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0",
};

const contentStyle = {
  padding: "30px 30px 20px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "800",
  color: "#1f2937",
  textAlign: "center",
  margin: "0 0 20px",
  padding: "0",
  lineHeight: "1.3",
};

const greetingStyle = {
  fontSize: "18px",
  color: "#4b5563",
  lineHeight: "1.5",
  margin: "0 0 20px",
};

const alertBoxStyle = {
  backgroundColor: "#f6f7f9",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "20px",
  textAlign: "center",
};

const alertTextStyle = {
  fontSize: "18px",
  fontWeight: "500",
  margin: "0",
};

const progressContainerStyle = {
  height: "12px",
  backgroundColor: "#e5e7eb",
  borderRadius: "6px",
  overflow: "hidden",
  marginBottom: "25px",
  position: "relative",
};

const progressBarStyle = {
  height: "100%",
  borderRadius: "6px",
  transition: "width 0.3s ease",
};

const statsRowStyle = {
  marginBottom: "30px",
};

const statColumnStyle = {
  padding: "0 5px",
};

const statBoxStyle = {
  textAlign: "center",
  padding: "15px 10px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 5px",
  fontWeight: "500",
};

const statValueStyle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#111827",
  margin: "0",
};

const ctaContainerStyle = {
  textAlign: "center",
  margin: "25px 0",
};

const buttonStyle = {
  backgroundColor: "#1a2e3b",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
  cursor: "pointer",
};

const tipStyle = {
  backgroundColor: "#f3f9e8",
  border: "none",
  borderLeft: "4px solid #c9f270",
  borderRadius: "8px",
  padding: "15px",
  margin: "20px 0 10px",
};

const tipTextStyle = {
  fontSize: "15px",
  color: "#4b5563",
  lineHeight: "1.5",
  margin: "0",
};

const dividerStyle = {
  borderTop: "1px solid #e5e7eb",
  margin: "0",
};

const footerStyle = {
  padding: "20px 30px",
  textAlign: "center",
};

const footerTextStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 10px",
};

const socialLinksStyle = {
  textAlign: "center",
};

const socialLinkStyle = {
  color: "#3ab0a2",
  textDecoration: "none",
  fontSize: "14px",
};

const socialSeparatorStyle = {
  color: "#6b7280",
  margin: "0 8px",
  fontSize: "14px",
};

// Additional styles for monthly report
const introTextStyle = {
  fontSize: "16px",
  color: "#4b5563",
  lineHeight: "1.6",
  margin: "0 0 25px",
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1f2937",
  margin: "25px 0 15px",
  padding: "0",
};

const metricBoxStyle = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center",
  margin: "15px 0",
};

const metricLabelStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 5px",
  fontWeight: "500",
};

const metricValueStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#3ab0a2",
  margin: "0",
};

const categoryBoxStyle = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "15px",
  textAlign: "center",
  margin: "10px 0 20px",
};

const categoryNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#92400e",
  margin: "0 0 5px",
};

const categoryAmountStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#f59e0b",
  margin: "0",
};

const insightBoxStyle = {
  backgroundColor: "#eff6ff",
  border: "1px solid #3b82f6",
  borderLeft: "4px solid #3b82f6",
  borderRadius: "8px",
  padding: "15px",
  margin: "10px 0",
};

const insightTextStyle = {
  fontSize: "15px",
  color: "#1e40af",
  lineHeight: "1.5",
  margin: "0",
};

const breakdownContainerStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "15px",
  margin: "10px 0 20px",
};

const breakdownRowStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "8px 0",
  margin: "0",
};

const breakdownCategoryStyle = {
  paddingRight: "10px",
};

const breakdownCategoryTextStyle = {
  fontSize: "14px",
  color: "#4b5563",
  fontWeight: "500",
  margin: "0",
};

const breakdownAmountStyle = {
  textAlign: "right",
};

const breakdownAmountTextStyle = {
  fontSize: "14px",
  color: "#1f2937",
  fontWeight: "600",
  margin: "0",
};
