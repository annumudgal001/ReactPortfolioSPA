import { Message } from "../models/message.model.js";

export function createMessage(data) {
  return Message.create(data);
}
