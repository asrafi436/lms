import { Button } from "@/components/ui/button";
// import { VideoPlayer } from "./_components/video-player";
import { Separator } from "@/components/ui/separator";
import VideoDescription from "./_components/video-description";
import { getLessonByLessonId } from "@/queries/lessons"
import { LessonVideo } from "./_components/lesson-video";

const Course = async  ({ params: {id}, searchParams: { lessonId,moduleId} }) => {

	const lesson = await getLessonByLessonId(lessonId);
	console.log(lesson);

	return (
		<div>
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4 w-full">
				<LessonVideo courseId={id} lesson={lesson} moduleId={moduleId} />
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
						<Button size="lg">Watch Complete</Button>
					</div>
					<Separator />
					<VideoDescription description={lesson.description} />
				</div>
			</div>
		</div>
	);
};
export default Course;
