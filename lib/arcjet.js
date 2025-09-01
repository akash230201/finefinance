import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_API_KEY,
  characteristics: ["userId"], //Track user ID for rate limiting
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 20,
      interval: 3600, // 1 hour
      capacity: 20,
    }),
  ],
});

export default aj;
