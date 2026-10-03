import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
