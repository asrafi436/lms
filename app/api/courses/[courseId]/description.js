// pages/api/courses/[courseId]/description.js

// import { updateCourseDescription } from "@/queries/courses"; // The function to update the description in the DB

// export default async function handler(req, res) {
//   const { courseId } = req.query;

//   if (req.method === "PUT") {
//     const { description } = req.body;

//     try {
//       const updatedCourse = await updateCourseDescription(courseId, description);

//       if (updatedCourse) {
//         return res.status(200).json({ message: "Description updated successfully" });
//       } else {
//         return res.status(400).json({ message: "Failed to update description" });
//       }
//     } catch (error) {
//       console.error("Error updating course description:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   } else {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }
// }
