"use client"
 import { useRouter } from "next/navigation";
 import { useEffect, useState } from "react";
 import ReactPlayer from "react-player/youtube";
  
 
 export const LessonVideo = ({ courseId,lesson,module}) => {
     const [hasWindow, setHasWindow] = useState(false);
     const router = useRouter();
 
     useEffect(() => {
         if (typeof window !== "undefined") {
             setHasWindow(true);
         }
     },[]);

 
 
     return (
        <>
        {
            hasWindow && (
                <ReactPlayer
                    url={lesson.video_url}
                    width="100%"
                    height="470px"
                    controls={true}
                />
            )
        }
        </>
     );
 };