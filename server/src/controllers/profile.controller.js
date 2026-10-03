import { getProfile } from "../services/profile.service.js";

export async function showProfile(req, res) {
  const profile = await getProfile();

  if (!profile) {
    return res
      .status(404)
      .json({
        success: false,
        message: "Profile not found. Run the seed script.",
      });
  }

  res.json({ success: true, data: profile });
}
