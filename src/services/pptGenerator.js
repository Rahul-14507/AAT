import PptxGenJS from "pptxgenjs";

export const generatePPT = async (
  subject,
  problem,
  slidesData,
  studentDetails
) => {
  try {
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";
    pptx.author = "AAT Automator";
    pptx.company = "Student";
    pptx.title = subject;

    // Define Master Slides
    pptx.defineSlideMaster({
      title: "MASTER_INTRO",
      background: { path: "/templates/intro_template.png" },
    });

    pptx.defineSlideMaster({
      title: "MASTER_CONTENT",
      background: { path: "/templates/content_template.png" },
    });

    // Title Slide
    let slide = pptx.addSlide({ masterName: "MASTER_INTRO" });

    // Overlay white box to cover existing text on template if needed
    // Assuming the template has text we want to overwrite
    // Coordinates based on visual estimation of the provided image
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 2.5,
      w: "100%",
      h: 4,
      fill: "FFFFFF",
      line: { color: "FFFFFF" }, // Masking the middle area
    });

    // Add Text Fields
    // Course Title
    slide.addText(`Course Title: ${subject}`, {
      x: 1.5,
      y: 2.8,
      w: "80%",
      fontSize: 20,
      color: "333333",
      bold: true,
    });

    // Presenter Name
    slide.addText(`Presenter's Name : ${studentDetails?.name || ""}`, {
      x: 1.5,
      y: 3.5,
      w: "80%",
      fontSize: 20,
      color: "333333",
    });

    // Presenter ID
    slide.addText(`Presenters ID: ${studentDetails?.id || ""}`, {
      x: 1.5,
      y: 4.2,
      w: "80%",
      fontSize: 20,
      color: "333333",
    });

    // Department
    slide.addText(`Department Name : ${studentDetails?.dept || ""}`, {
      x: 1.5,
      y: 4.9,
      w: "80%",
      fontSize: 20,
      color: "333333",
    });

    // Content Slides
    slidesData.forEach((s) => {
      let slide = pptx.addSlide({ masterName: "MASTER_CONTENT" });

      // Title
      slide.addText(s.title, {
        x: 0.5,
        y: 0.5,
        w: "90%",
        h: 0.8,
        fontSize: 24,
        bold: true,
        color: "003366",
        breakLine: false,
      });

      // Bullets
      const bulletPoints = s.content.map((line) => ({
        text: line,
        options: { bullet: true },
      }));

      slide.addText(bulletPoints, {
        x: 0.5,
        y: 1.3,
        w: "90%",
        h: 5.5,
        fontSize: 16,
        color: "333333",
        lineSpacing: 28,
        valign: "top",
      });
    });

    // Thank You Slide
    let thankYouSlide = pptx.addSlide({ masterName: "MASTER_INTRO" });

    // Overlay white box
    thankYouSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 2.5,
      w: "100%",
      h: 4,
      fill: "FFFFFF",
      line: { color: "FFFFFF" },
    });

    // Thank You Title
    thankYouSlide.addText("Thank You!", {
      x: 1.5,
      y: 2.8,
      w: "80%",
      fontSize: 36,
      color: "003366",
      bold: true,
    });

    // Student Details
    thankYouSlide.addText(`Presented by: ${studentDetails?.name || ""}`, {
      x: 1.5,
      y: 4.0,
      w: "80%",
      fontSize: 20,
      color: "333333",
    });

    thankYouSlide.addText(`ID: ${studentDetails?.id || ""}`, {
      x: 1.5,
      y: 4.6,
      w: "80%",
      fontSize: 18,
      color: "555555",
    });

    thankYouSlide.addText(`${studentDetails?.dept || ""}`, {
      x: 1.5,
      y: 5.1,
      w: "80%",
      fontSize: 18,
      color: "555555",
    });

    await pptx.writeFile({
      fileName: `${subject}_AAT_Presentation.pptx`,
    });
  } catch (err) {
    console.error("PPT Generation Error:", err);
    throw err;
  }
};

export const generateWordDoc = (subject, problem, reportHtml) => {
  const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${subject} Report</title>
      <style>
          body { font-family: 'Calibri', sans-serif; line-height: 1.5; }
          h1 { color: #2e74b5; font-size: 24pt; border-bottom: 2px solid #2e74b5; padding-bottom: 10px; margin-bottom: 20px; }
          h2 { color: #1f4d78; font-size: 18pt; margin-top: 25px; }
          h3 { color: #1f4d78; font-size: 14pt; margin-top: 20px; }
          p { margin-bottom: 12px; text-align: justify; }
          li { margin-bottom: 5px; }
      </style>
      </head><body>
      <h1>AAT Report: ${subject}</h1>
      <p><strong>Problem Statement:</strong> ${problem}</p>
      <hr/>
  `;

  const footer = "</body></html>";
  const sourceHTML = header + reportHtml + footer;

  const source =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `${subject}_AAT_Report.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};
