export const UI_TEXT = {
  brandHomeLabel: "Aries Resume home",
  heroTitleLineOne: "Want to Score Higher",
  heroTitleLineTwo: "on Your Resume?",
  heroDescription:
    "We calculate your resume score by checking formatting, ATS compatibility, keyword usage, relevance to the job you shared, and more. Find out where your resume is strong and what to improve for the role.",
  scoreLabel: "Total Score",
  scorePending: "Add your resume and a job description to calculate your score.",
  scoreStrong: "Strong match. Review the details below for final refinements.",
  scoreCompetitive: "Competitive match. A few targeted edits can improve it further.",
  scoreNeedsTuning: "Your resume needs targeted changes for this role.",
  scoreLow: "Low alignment. Start with the missing keywords and format signals below.",
  metricsLabel: "Resume score breakdown",
  metricsKeywordsAnalysed: "Keywords analysed",
  metricsKeywordDensity: "Keyword density",
  metricsKeywordCoverage: "Keyword coverage",
  metricsFormatting: "Formatting and ATS readiness",
  metricsSectionsFound: "Resume sections found",
  metricsResumeWords: "Resume words",
  metricsJobWords: "Job description words",
  bannerCopy:
    "Compare your resume with a job description to reveal role-specific improvements.",
  openWorkspace: "Analyse Your Resume",
  keywordTitle: "Keyword Analysis",
  keywordDescription:
    "This category evaluates keywords in your resume and their relevance to the target role.",
  missingKeywordsTitle: "Missing keywords in your resume",
  missingKeywordsEmpty: "No high-priority missing keywords were found.",
  missingKeywordsPending:
    "Complete the resume workspace to see role-specific missing keywords.",
  missingKeywordsWarning:
    "Your resume is missing important keywords from the job description. Add them only where they truthfully reflect your experience.",
  missingKeywordsSuccess:
    "Your resume covers the high-priority keywords found in this job description.",
  formattingTitle: "Formatting and ATS Readiness",
  formattingDescription:
    "Clear formatting helps applicant tracking systems and recruiters read your resume correctly.",
  keywordCoverage: "Keyword coverage",
  keywordDensity: "Keyword density",
  resumeFormat: "Resume format",
  matchedKeywordsTitle: "Matched Job Keywords",
  matchedKeywordsPending:
    "Add a resume and job description to see your personalised report.",
  matchedKeywordsEmpty: "No job keywords are matched yet.",
  detailedAnalysisLabel: "Detailed ATS analysis",
  workspaceEyebrow: "Resume workspace",
  workspaceTitle: "Analyse your resume",
  closeWorkspace: "Close workspace",
  uploadPrompt: "Upload resume PDF or Word file",
  uploadWorking: "Extracting resume text…",
  uploadDone: "Resume text extracted",
  resumeLabel: "Resume text or LaTeX (Overleaf)",
  resumeHelp:
    "Paste editable plain text or LaTeX from Overleaf. LaTeX markup is ignored during ATS scoring.",
  resumePlaceholder:
    "Extracted resume text will appear here. You can also paste or edit Overleaf LaTeX code.",
  jobLabel: "Job description",
  jobPlaceholder:
    "Paste the full job description here. Aries will extract role keywords locally.",
  compareActions: "Resume comparison actions",
  compareResume: "Compare Resume",
  aiCompare: "AI Compare",
  comparingWithAi: "Comparing with AI…",
  regenerateAiSuggestions: "Regenerate AI Suggestions",
  apiKeyLabel: "Gemini API key",
  apiKeyPlaceholder: "Paste Google Gemini API key",
  apiDocs: "Official API key docs",
  createApiKey: "Create API key",
  copyReport: "Copy report",
  exportReport: "Export report",
  generateSuggestions: "Generate suggestions",
  generatingSuggestions: "Generating suggestions…",
  suggestionsPending:
    "Suggestions will appear here after the local ATS score is ready.",
  suggestionsReady: "AI suggestions",
  reportCopied: "Report copied",
  reportDownloaded: "Report downloaded",
  reportCopyError: "The report could not be copied. Try again.",
  reportDownloadError: "The report could not be downloaded. Try again.",
  parseError: "Could not parse the resume file.",
  suggestionsError:
    "Could not get Gemini suggestions. Check the API key and try again.",
  fileTypeError: "Choose a PDF or Word .docx resume file.",
  fileSizeError: "Choose a resume file smaller than 10 MB.",
  emptyFileError:
    "No readable text was found. Try a text-based PDF instead of a scanned image.",
  pdfPageError: "Could not read a page in the PDF.",
  pdfExtractionError: "Could not extract text from the PDF.",
  wordExtractionError: "Could not extract text from the Word document.",
  fileReadError: "Could not read the resume file.",
} as const;

export const EXTERNAL_LINKS = {
  apiKeyDocs: "https://ai.google.dev/gemini-api/docs/api-key",
  createApiKey: "https://aistudio.google.com/apikey",
} as const;
