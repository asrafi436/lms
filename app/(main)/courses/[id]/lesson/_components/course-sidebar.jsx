// "use client";
// import { useState } from "react";
import { CourseProgress } from "@/components/course-progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { PlayCircle } from "lucide-react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ReviewModal } from "./review-modal";
import { DownloadCertificate } from "./download-certificate";
import { GiveReview } from "./give-review";
import { SidebarModules } from "./sidebar-modules";

export const CourseSidebar = ({courseId, module, userId, course, reports}) => {
  // const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const isActive = true;
  const isCompleted = true;
  const totalPogress= reports.course_progress;


  return (
    <>
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold text-2xl">{course?.title}</h1>
          {/* Check purchase */}
          {
            <div className="mt-10">
              <CourseProgress variant="success" value={totalPogress} />
            </div>
          }
        </div>

        <SidebarModules courseId={courseId} module={module} userId={userId} reports={reports}/>





        <div className="w-full px-6">
          <GiveReview />
          <DownloadCertificate  courseId={courseId}  userId={userId} reports={reports}/>
        </div>
      </div>

    </>
  );
};
