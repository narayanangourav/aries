import { UI_TEXT } from "../content";

const PDF_MIME_TYPE = "application/pdf";
const WORD_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_EXTENSION = ".pdf";
const WORD_EXTENSION = ".docx";
const MAX_RESUME_FILE_BYTES = 10 * 1024 * 1024;

const isPdfFile = (file: File): boolean =>
  file.type === PDF_MIME_TYPE || file.name.toLowerCase().endsWith(PDF_EXTENSION);

const isWordFile = (file: File): boolean =>
  file.type === WORD_MIME_TYPE ||
  file.name.toLowerCase().endsWith(WORD_EXTENSION);

const validateResumeFile = (file: File): void => {
  if (!isPdfFile(file) && !isWordFile(file)) {
    throw new Error(UI_TEXT.fileTypeError);
  }

  if (file.size > MAX_RESUME_FILE_BYTES) {
    throw new Error(UI_TEXT.fileSizeError);
  }
};

const extractWordText = async (file: File): Promise<string> => {
  try {
    const mammothModule = await import("mammoth");
    const result = await mammothModule.default.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    });
    return result.value.trim();
  } catch {
    throw new Error(UI_TEXT.wordExtractionError);
  }
};

const extractPdfText = async (file: File): Promise<string> => {
  try {
    const [pdfjs, worker] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.mjs?url"),
    ]);

    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

    const data = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data }).promise;
    const pageTexts = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, index) => {
        try {
          const page = await pdf.getPage(index + 1);
          const content = await page.getTextContent();
          return content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
        } catch (error) {
          throw error instanceof Error
            ? error
            : new Error(UI_TEXT.pdfPageError);
        }
      }),
    );

    return pageTexts.join("\n\n").trim();
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(UI_TEXT.pdfExtractionError);
  }
};

export const extractResumeText = async (file: File): Promise<string> => {
  try {
    validateResumeFile(file);
    const text = isPdfFile(file)
      ? await extractPdfText(file)
      : await extractWordText(file);
    const trimmedText = text.trim();

    if (!trimmedText) {
      throw new Error(UI_TEXT.emptyFileError);
    }

    return trimmedText;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(UI_TEXT.fileReadError);
  }
};
