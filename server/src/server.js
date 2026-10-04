import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT || 5000);
const host = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");

try {
  await connectDB();

  const server = app.listen(port, host, () => {
    console.log(`API running at http://${host}:${port}`);
  });

  server.on("error", (error) => {
    console.error("HTTP server failed:", error.message);
    process.exit(1);
  });
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
