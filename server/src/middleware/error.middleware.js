export function notFound(req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(error, req, res, next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large" });
  }
  if (error.code === 11000) return res.status(409).json({ success: false, message: "That title or slug already exists." });
  console.error("Request failed:", error.name);
  res.status(500).json({ success: false, message: "Internal server error" });
}
