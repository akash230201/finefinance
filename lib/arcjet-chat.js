import arcjet, { tokenBucket } from "@arcjet/next";

// Separate rate limiter for chatbot
const chatAj = arcjet({
  key: process.env.ARCJET_API_KEY,
  characteristics: ["userId"], // Track user ID for rate limiting
  rules: [
    // Authenticated users: 15 questions per hour
    tokenBucket({
      mode: "LIVE",
      refillRate: 15,
      interval: 3600, // 1 hour
      capacity: 15,
    }),
  ],
});

// Rate limiter for unauthenticated users
const guestChatAj = arcjet({
  key: process.env.ARCJET_API_KEY,
  characteristics: ["userId"], // Track guest identifier for unauthenticated users
  rules: [
    // Unauthenticated users: 5 questions per hour
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 3600, // 1 hour
      capacity: 5,
    }),
  ],
});

export { chatAj, guestChatAj };
