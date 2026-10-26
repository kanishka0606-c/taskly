import User from "../models/User.js";

export async function listMembers(req, res) {
  const members = await User.find().select("name email").sort({ name: 1 });
  res.json(members);
}