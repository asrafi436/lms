import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import { ArrowLeft, BookOpenCheck, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ModuleTitleForm } from "./_components/module-title-form";
import { LessonForm } from "./_components/lesson-form";
import { CourseActions } from "../../_components/course-action";
import { getModuleById } from "@/queries/modules";
import { getLessonById } from "@/queries/lessons";

const Module = async ({ params }) => {
  const { courseId, moduleId } = params;

  // Fetch module data
  const module = await getModuleById(moduleId);
  // Fetch lessons data for the module
  const lessons = await getLessonById(moduleId);

  // console.log("Fetched lessons:", lessons);

  if (!module) {
    return (
      <div className="p-6">
        <AlertBanner label="Module not found." variant="destructive" />
        <Link href={`/dashboard/courses/${courseId}`} className="text-blue-600 hover:underline">
          ← Back to course
        </Link>
      </div>
    );
  }

  return (
    <>
      {!module.isPublished && (
        <AlertBanner
          label="This module is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-end">
              <CourseActions />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize Your Module</h2>
              </div>
              <ModuleTitleForm
                initialData={module}
                courseId={courseId}
                chapterId={moduleId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={BookOpenCheck} />
                <h2 className="text-xl">Module Lessons</h2>
              </div>
              {/* Pass lessons as an array (or single lesson if that's the case) */}
              <LessonForm initialData={Array.isArray(lessons) ? lessons : [lessons]} moduleId={moduleId} courseId={courseId}/>
            </div>
          </div>
          <div>{/* Reserved for future (e.g. video upload) */}</div>
        </div>
      </div>
    </>
  );
};

export default Module;
