import { getProjects } from "../services/project.service.js";

export async function listProjects(req, res) {
  const projects = await getProjects();
  res.json({ success: true, data: projects });
}
