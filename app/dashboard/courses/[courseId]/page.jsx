import { IconBadge } from "@/components/icon-badge";
import {CircleDollarSign,File,LayoutDashboard,ListChecks} from "lucide-react";
import { CategoryForm } from "./_components/category-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { ModulesForm } from "./_components/module-form";
import { PriceForm } from "./_components/price-form";
import { TitleForm } from "./_components/title-form";
import { SubtitleForm } from "./_components/subtitle-form";
import { CourseActions } from "./_components/course-action";
import AlertBanner from "@/components/alert-banner";
import { QuizSetForm } from "./_components/quiz-set-form";
import { getCourseDetails } from "@/queries/courses";
import { getCategories } from "@/queries/courses";
import {getCourseModules } from "@/queries/modules.js";

  
 const EditCourse = async ({ params }) => {
  const { courseId } = params;

  const course = await getCourseDetails(courseId);
  // console.log("Received course Data:", course);

  const categories = await getCategories();
  // console.log("Categories Data:", categories);

  const modules = await getCourseModules(courseId);
  // console.log("Module length:", modules.modules.length);


   
 
   const mappedCategories = categories.map(c => {
     return {
       value: c.title,
       label: c.title,
       id: c.id,
     }
   });

  //  console.log("Categories map Data:", mappedCategories);



  if (!course) {
    return <div className="p-6">Course not found!</div>;
  }

  return (
    <>

    <AlertBanner
      label="This course is unpublished. It will not be visible in the course."
      variant="warning"
    />
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={{ title: course.title }} courseId={course.id} />
          <SubtitleForm initialData={{ subtitle: course.subtitle }} courseId={course.id} />
          <DescriptionForm initialData={{ description: course.description }} courseId={course.id} />
          <ImageForm initialData={{imageUrl: `/assets/images/courses/${course?.thumbnail}`}} courseId={course.id} />
          <CategoryForm initialData={{value: course?.category_title }} courseId={courseId} options={mappedCategories} />
          <QuizSetForm initialData={{ quizsetId: course.quizset_id }} courseId={course.id} />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2 mb-6">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Modules</h2>
            </div>
            <ModulesForm initialData={modules.modules} courseId={course.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={{ price: course.price }} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>

  </>
  );
};
export default EditCourse;
