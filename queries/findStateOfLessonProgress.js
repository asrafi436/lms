import { createConnection } from '@/lib/db';
import { getUserByEmail } from '@/queries/users';
import { auth } from '@/auth';

export const findStateOfLessonProgress = async (courseId, lessonId) => {
  if (!courseId || !lessonId) {
    throw new Error('Missing required parameters');
  }

  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  const loggedInUser = await getUserByEmail(session.user.email);
  const userId = loggedInUser?.id;

  if (!userId) {
    throw new Error('User not found');
  }

  let connection;
  try {
    connection = await createConnection();

    const [rows] = await connection.execute(
      `
      SELECT state
      FROM lesson_progress
      WHERE course_id = ? AND user_id = ? AND lesson_id = ?
      LIMIT 1;
      `,
      [courseId, userId, lessonId]
    );

    return rows.length > 0 ? rows[0].state : null;
  } catch (error) {
    console.error('Error fetching lesson progress state:', error);
    throw new Error('Database query failed');
  }
};
