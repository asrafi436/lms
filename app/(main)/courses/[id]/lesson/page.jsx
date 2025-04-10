import { Separator } from "@/components/ui/separator";
import VideoDescription from "./_components/video-description";
import { getLessonByLessonId } from "@/queries/lessons";
import { LessonVideo } from "./_components/lesson-video";
import { checkLessonProgressExist } from "@/app/action/lesson";
import CompleteButton from "./_components/CompleteButton"; // Import the Client Component

const Course = async ({ params: { id }, searchParams: { lessonId, moduleId, userId } }) => {

	console.log("userId:", userId, "courseId:", id, "lessonId:", lessonId);

	if (!lessonId) {
		return (
			<div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 shadow-md text-center">
				<h2 className="text-4xl font-extrabold text-blue-700 mb-4 animate__animated animate__fadeIn animate__delay-1s">
					Welcome to Your Learning Journey 🚀
				</h2>
				<p className="text-2xl text-gray-700 mb-6 animate__animated animate__fadeIn animate__delay-2s">
					No lesson selected yet. Choose a lesson to begin your progress!
				</p>
				<p className="text-xl text-gray-600 italic animate__animated animate__fadeIn animate__delay-3s">
					"The expert in anything was once a beginner. Start now, keep going, and don't stop growing."
				</p>
			</div>
		);
	}

	const lesson = await getLessonByLessonId(lessonId);
	const isWatched = await checkLessonProgressExist(userId, id, lessonId);
	console.log("lesson isWatch:", isWatched);

	return (
		<div>
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4 w-full">
					<LessonVideo courseId={id} lesson={lesson} moduleId={moduleId} />
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
						{/* Use the Client Component for the button */}
						<CompleteButton 
							lessonId={lessonId} 
							userId={userId} 
							courseId={id} 
							isWatched={isWatched} 
						/>
					</div>
					<Separator />
					<VideoDescription description={lesson.description} />
				</div>
			</div>
		</div>
	);
};

export default Course;
