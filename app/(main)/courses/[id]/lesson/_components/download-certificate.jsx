"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const DownloadCertificate = ({ courseId, userId, reports }) => {
  const [isCertificateDownloading, setIsCertificateDownloading] = useState(false);

  async function handleCertificateDownload() {
    try {
      setIsCertificateDownloading(true);

      // Use absolute URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certificate?courseId=${courseId}`);

      if (!response.ok) {
        throw new Error("Failed to download certificate");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Certificate.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Certificate has been downloaded");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsCertificateDownloading(false);
    }
  }

  const totalProgress = reports?.course_progress;

  return (
    <Button className="w-full mt-6" disabled={totalProgress < 100} onClick={handleCertificateDownload}>
      Download Certificate
    </Button>
  );
};
