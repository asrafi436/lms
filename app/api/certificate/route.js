import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { getCourseDetails } from "@/queries/courses";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { getCourseReports } from "@/queries/reports";
import { formatMyDate } from "@/lib/date";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get("courseId");

    const course = await getCourseDetails(courseId);
    const loggedInUser = await getLoggedInUser();
    const report = await getCourseReports(courseId, loggedInUser.id);
    const completionDate = formatMyDate(Date.now());

    const completionInfo = {
      name: `${loggedInUser?.first_name} ${loggedInUser?.last_name}`,
      completionDate,
      courseName: course.title,
      instructor: `${course?.instructor_first_name} ${course?.instructor_last_name}`,
      instructorDesignation: `${course?.designation}`,
      sign: "/sign.png",
    };

    // Font & Image fetch URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const kalamFontBytes = await fetch(`${baseUrl}/fonts/kalam/Kalam-Regular.ttf`).then(res => res.arrayBuffer());
    const montserratItalicFontBytes = await fetch(`${baseUrl}/fonts/montserrat/Montserrat-Italic.ttf`).then(res => res.arrayBuffer());
    const montserratFontBytes = await fetch(`${baseUrl}/fonts/montserrat/Montserrat-Medium.ttf`).then(res => res.arrayBuffer());
    const logoBytes = await fetch(`${baseUrl}/logo.png`).then(res => res.arrayBuffer());
    const signBytes = await fetch(`${baseUrl}${completionInfo.sign}`).then(res => res.arrayBuffer());
    const patternBytes = await fetch(`${baseUrl}/pattern.jpg`).then(res => res.arrayBuffer());

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const kalamFont = await pdfDoc.embedFont(kalamFontBytes);
    const montserratItalic = await pdfDoc.embedFont(montserratItalicFontBytes);
    const montserrat = await pdfDoc.embedFont(montserratFontBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();

    // Embed and scale the logo
    const logo = await pdfDoc.embedPng(logoBytes);
    const logoWidth = 277;  // Original width of the logo
    const logoHeight = 80;  // Original height of the logo
    const logoScale = 0.5;  // Scale factor for the logo
    const logoScaledWidth = logoWidth * logoScale;
    const logoScaledHeight = logoHeight * logoScale;
    page.drawImage(logo, {
      x: width / 2 - logoScaledWidth / 2, // Centered horizontally
      y: height - 120,  // 120px from the top of the page
      width: logoScaledWidth,
      height: logoScaledHeight,
    });

    // Title
    const titleText = "Certificate Of Completion";
    const titleFontSize = 30;
    const titleTextWidth = montserrat.widthOfTextAtSize(titleText, titleFontSize);
    page.drawText(titleText, {
      x: width / 2 - titleTextWidth / 2,
      y: height - (logoScaledHeight + 125),
      size: titleFontSize,
      font: montserrat,
      color: rgb(0, 0.53, 0.71),
    });

    // Name Label
    const nameLabelText = "This certificate is hereby bestowed upon";
    const nameLabelFontSize = 20;
    const nameLabelTextWidth = montserratItalic.widthOfTextAtSize(nameLabelText, nameLabelFontSize);
    page.drawText(nameLabelText, {
      x: width / 2 - nameLabelTextWidth / 2,
      y: height - (logoScaledHeight + 170),
      size: nameLabelFontSize,
      font: montserratItalic,
      color: rgb(0, 0, 0),
    });

    // Name
    const nameText = completionInfo.name;
    const nameFontSize = 40;
    const nameTextWidth = timesRomanFont.widthOfTextAtSize(nameText, nameFontSize);
    page.drawText(nameText, {
      x: width / 2 - nameTextWidth / 2,
      y: height - (logoScaledHeight + 220),
      size: nameFontSize,
      font: kalamFont,
      color: rgb(0, 0, 0),
    });

    // Details
    const detailsText = `This is to certify that ${completionInfo.name} successfully completed the ${completionInfo.courseName} course on ${completionInfo.completionDate} by ${completionInfo.instructor}`;
    page.drawText(detailsText, {
      x: width / 2 - 700 / 2,
      y: height - 330,
      size: 16,
      font: montserrat,
      color: rgb(0, 0, 0),
      maxWidth: 700,
      wordBreaks: [" "],
    });

    // Instructor Signature
    const signatureBoxWidth = 300;
    page.drawText(completionInfo.instructor, {
      x: width - signatureBoxWidth,
      y: 90,
      size: 16,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(completionInfo.instructorDesignation, {
      x: width - signatureBoxWidth,
      y: 72,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: width - signatureBoxWidth, y: 110 },
      end: { x: width - 60, y: 110 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    const sign = await pdfDoc.embedPng(signBytes);
    page.drawImage(sign, {
      x: width - signatureBoxWidth,
      y: 120,
      width: 180,
      height: 54,
    });

    // Embed and scale the background pattern
    const pattern = await pdfDoc.embedJpg(patternBytes);
    const patternWidth = 995;  // Original width of the pattern
    const patternHeight = 701; // Original height of the pattern
    const patternScaleWidth = width;  // Scale the pattern to the full width of the page
    const patternScaleHeight = (patternHeight / patternWidth) * patternScaleWidth; // Maintain aspect ratio

    page.drawImage(pattern, {
      x: 0,
      y: 0,
      width: patternScaleWidth,
      height: patternScaleHeight,
      opacity: 0.2,  // Adjust opacity to make it faint
    });

    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      headers: { "content-type": "application/pdf" },
    });
  } catch (error) {
    console.error("Certificate generation failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
