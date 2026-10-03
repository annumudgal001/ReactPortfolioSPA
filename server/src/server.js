import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT || 5000);

try {
  await connectDB();

  const server = app.listen(port, "127.0.0.1", () => {
    console.log(`API running at http://127.0.0.1:${port}`);
  });

  server.on("error", (error) => {
    console.error("HTTP server failed:", error.message);
    process.exit(1);
  });
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}
