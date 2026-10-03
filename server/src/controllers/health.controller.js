import mongoose from "mongoose";

export async function getHealth(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database disconnected");
    }

    await mongoose.connection.db.admin().ping();

    res.json({ success: true, api: "running", database: "connected" });
  } catch {
    res
      .status(503)
      .json({ success: false, api: "running", database: "unavailable" });
  }
}
