import rateLimit from "express-rate-limit";

export function createFormLimiter({
  windowMs = 15 * 60 * 1000,
  limit = 5,
  message = "Too many submissions. Please try again later.",
} = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
}
