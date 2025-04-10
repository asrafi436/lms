import { SidebarLessonItem } from "./sidebar-lesson-items";
import { AccordionContent } from "@/components/ui/accordion";

export const SidebarLessons = ({courseId, lessons,userId }) => {
  
  return (
    <AccordionContent>
      <div className="flex flex-col w-full gap-3">
        {/* Loop through the lessons and render SidebarLessonItem for each */}
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <SidebarLessonItem
              key={lesson.lesson_id}
              lesson={lesson}
              isActive={lesson.published === 0} 
              courseId={courseId} // Pass the courseId prop to SidebarLessonItem 
              userId={userId}
            />
          ))
        ) : (
          <div>No lessons available</div>
        )}
      </div>
    </AccordionContent>
  );
};
