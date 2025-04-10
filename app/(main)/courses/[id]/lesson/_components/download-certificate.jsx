import { Button } from "@/components/ui/button";
 
 export const DownloadCertificate = ({courseId,userId, reports}) => {

    // console.log("Reports Data: ",reports.course_progress);
    const totalPogress= reports.course_progress;
 
     return (
         <Button className="w-full mt-6" disabled={ totalPogress < 100}>
            Download Certificate 
          </Button>
     )
     
 }