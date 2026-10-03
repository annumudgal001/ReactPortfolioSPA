import { contactSchema } from "../validators/contact.validator.js";
import { createMessage } from "../services/message.service.js";

export async function submitContact(req, res) {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Please check the form and try again.",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { website, ...data } = parsed.data;

  // A bot filled the hidden field: pretend it worked, save nothing.
  if (website) {
    return res.status(201).json({ success: true, message: "Message sent." });
  }

  await createMessage(data);

  res
    .status(201)
    .json({ success: true, message: "Thanks! Your message has been sent." });
}
