import { Feedback } from "../models/feedback.model.js";

export function createFeedback(data) {
  return Feedback.create(data);
}
