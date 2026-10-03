import { feedbackInputSchema } from '../validators/feedback.validator.js';
import { createFeedback } from '../services/feedback.service.js';

export async function submitFeedback(req, res) {
  const parsed = feedbackInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Please check the form and try again.',
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const { website, ...data } = parsed.data;

  // A bot filled the hidden field: pretend it worked, save nothing.
  if (website) {
    return res.status(201).json({ success: true, message: 'Thank you for your feedback!' });
  }

  await createFeedback(data);

  res
    .status(201)
    .json({ success: true, message: 'Thank you! Your review has been received.' });
}
