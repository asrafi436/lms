// /app/api/lesson-progress/route.js
import { createConnection } from '@/lib/db';
import { getUserByEmail } from '@/queries/users';
import { auth } from '@/auth';

export async function POST(req) {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const { courseId, lessonId } = await req.json();

  if (!courseId || !lessonId) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  const user = await getUserByEmail(session.user.email);
  const userId = user?.id;

  const connection = await createConnection();
  const [rows] = await connection.execute(
    `SELECT state FROM lesson_progress WHERE course_id = ? AND user_id = ? AND lesson_id = ? LIMIT 1`,
    [courseId, userId, lessonId]
  );

  const state = rows.length > 0 ? rows[0].state : null;

  return new Response(JSON.stringify({ state }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
