"use client";

import { Button } from "@/components/ui/button";
import { markLessonComplete } from "@/app/action/lesson";

const CompleteButton = ({ lessonId, userId, courseId, isWatched }) => {
	const handleComplete = async () => {
		// Mark the lesson as complete
		const lessonProgressUpdate = await markLessonComplete({ userId, lessonId, courseId });
		console.log("lesson Progress:", lessonProgressUpdate);

		// Reload the page after marking the lesson complete
		window.location.reload();
	};

	return (
		<Button
			size="lg"
			onClick={isWatched ? null : handleComplete}
			disabled={isWatched}
			className={`${isWatched
				? 'bg-green-500 text-white cursor-not-allowed'
				: 'bg-blue-600 text-white hover:bg-blue-700'
			} transition-colors duration-300 rounded-md py-2 px-6 font-semibold`}
		>
			{isWatched ? 'Completed' : 'Watch Complete'}
		</Button>
	);
};

export default CompleteButton;
