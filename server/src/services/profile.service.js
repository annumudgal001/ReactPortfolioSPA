import { Profile } from "../models/profile.model.js";

export function getProfile() {
  return Profile.findOne().select("name headline summary jargon location email phone resumeUrl photoUrl seoDescription socials experience education skillGroups services certifications testimonials quotes").lean();
}
