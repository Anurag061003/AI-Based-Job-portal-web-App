import axios from "axios";
import pdf from "pdf-parse";

export const extractResumeText = async (fileUrl) => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer"
    });

    const pdfData = await pdf(Buffer.from(response.data));
    return pdfData.text;
  } catch (error) {
    console.error("Resume parsing error:", error);
    return "";
  }
};