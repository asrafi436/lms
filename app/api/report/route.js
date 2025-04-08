// pages/api/reports.js

import { getUserReport } from "@/queries/reports"; // Adjust the path if necessary
import { auth } from '@/auth'; // Your auth function
import { getUserByEmail } from '@/queries/users';

export default async function handler(req, res) {
  const { userId, courseId } = req.query; // Extract query params

  if (!userId || !courseId) {
    return res.status(400).json({ error: "Missing userId or courseId" });
  }

  try {
    const session = await auth();
    const loggedInUser = await getUserByEmail(session.user.email);

    const report = await getUserReport(loggedInUser.id, courseId);

    if (report) {
      return res.status(200).json(report);
    } else {
      return res.status(404).json({ error: "Report not found" });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
