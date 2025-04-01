// 'use server';

// import { createConnection } from "@/lib/db";


// export const getUserReport = async (userId, courseId) => {
//     if (!userId || !courseId || typeof userId !== "string" || typeof courseId !== "string") {
//         throw new Error("Invalid user ID or course ID provided");
//     }

//     let connection;
//     try {
//         connection = await createConnection();
//         const [rows] = await connection.execute(
//             `SELECT * FROM reports 
//              WHERE student_id = ? 
//                AND course_id = ?`,
//             [userId, courseId]
//         );

//         return rows.length ? rows : [];
//     } catch (error) {
//         console.error("Error fetching reports for user:", error);
//         throw new Error("Database query failed");
//     } finally {
//         if (connection) await connection.end();
//     }
// };
