import { CourseProgress } from "@/components/course-progress";
import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";
import { Lock } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { CourseSidebarMobile } from "./_components/course-sidebar-mobile";
import { CourseSidebar } from "./_components/course-sidebar";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { redirect } from "next/navigation";


const CourseLayout = async ({ children, params: { id } }) => {
  


  const loggedinUser = await getLoggedInUser();
  // console.log("Logged in user:", loggedinUser.id);
   if (!loggedinUser) {
     redirect("/login");
   }
   
   // Fetch enrollment data
  const res = await fetch("http://localhost:3000/api/studentWiseEnrollments", {
    cache: "no-store", // to make sure data is fresh
  });
  const data = await res.json();

  const isEnrolled =
    Array.isArray(data.enrollments) &&
    data.enrollments.some(
      (enrollment) =>
        enrollment.student_id === loggedinUser.id && enrollment.course_id === id
    );

    // console.log("courseId:",id)

  if (!isEnrolled) {
    redirect("/courses");
  }

   
   

  return (
    <div className="">
      <div className="h-[80px] lg:pl-96 fixed top-[60px] inset-y-0 w-full z-10">
      <div className="flex lg:hidden p-4 border-b h-full items-center bg-white shadow-sm relative">
          {/* Course Sidebar For Mobile */}
          <CourseSidebarMobile  courseId={id}/>
          {/* <NavbarRoutes /> */}
        </div>
      </div>
     
      <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="hidden lg:flex h-full w-96 flex-col inset-y-0 z-50">
        {/* sidebar starts */}
        <CourseSidebar courseId={id} />
        {/* sidebar ends */}
      </div>

      <main className="lg:pl-96 pt-[80px] lg:pt-[20px] h-full col-span-10 px-4">{children}</main>
      
      </div>
     
      
    </div>
  );
};
export default CourseLayout;
