import { getCourseList } from "@/queries/courses";
import CourseCard from "../../courses/_components/CourseCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";




const CoursesCatgoryPage = async ({ params: { id } }) => {

    const courses = await getCourseList();
    const filteredCourses = courses.filter(course => course.category_id === id);
    // Get the category title from the first matching course
    const categoryTitle = filteredCourses.length > 0 ? filteredCourses[0].category_title : null;


    return (
        <section
            id="courses"
            className="container space-y-6   dark:bg-transparent py-6 px-24"
        >

            <div className="flex flex-col lg:flex-row items-center justify-between border-b border-emerald-300 py-6 px-4 rounded-xl shadow-sm">
                <h2 className="text-4xl font-bold text-center text-emerald-900">
                    {categoryTitle || "Category Not Found"}
                </h2>
                <Link href="/courses">
                    <Button variant="ghost" className="mt-4 lg:mt-0 text-emerald-700 hover:text-emerald-900">
                        Back to All Courses
                    </Button>
                </Link>
            </div>



            <section className="pb-24 pt-6">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

                    <div className="lg:col-span-4 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-4">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map(course => (
                                <CourseCard key={course.course_id} course={course} />
                            ))
                        ) : (
                            <h2 className="text-2xl font-semibold text-center text-gray-600 mt-10">
                                No course found
                            </h2>
                        )}
                    </div>
                </div>
            </section>
        </section>
    );
};
export default CoursesCatgoryPage;