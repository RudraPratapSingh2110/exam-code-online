
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Submission {
  id: string;
  studentName: string;
  examId: string;
  answers: { [questionId: string]: number };
  score: number;
  maxScore: number;
  submittedAt: string;
  timeTaken: number; // in seconds
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  code: string;
  duration: number; // in minutes
  isActive: boolean;
  questions: Question[];
  createdAt: string;
  submissions?: Submission[];
}

// Storage keys
const EXAMS_KEY = 'exampro_exams';
const SUBMISSIONS_KEY = 'exampro_submissions';

// Generate unique exam code
export const generateExamCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Exam management functions
export const saveExam = (exam: Exam): void => {
  const exams = getExams();
  const existingIndex = exams.findIndex(e => e.id === exam.id);
  
  if (existingIndex >= 0) {
    exams[existingIndex] = exam;
  } else {
    exams.push(exam);
  }
  
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
};

export const getExams = (): Exam[] => {
  const stored = localStorage.getItem(EXAMS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getExamByCode = (code: string): Exam | null => {
  const exams = getExams();
  return exams.find(exam => exam.code === code) || null;
};

export const getExamById = (id: string): Exam | null => {
  const exams = getExams();
  return exams.find(exam => exam.id === id) || null;
};

// Submission management functions
export const saveSubmission = (examId: string, submission: Submission): void => {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  
  // Also update the exam with the submission
  const exam = getExamById(examId);
  if (exam) {
    if (!exam.submissions) {
      exam.submissions = [];
    }
    exam.submissions.push(submission);
    saveExam(exam);
  }
};

export const getSubmissions = (): Submission[] => {
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getSubmissionsByExam = (examId: string): Submission[] => {
  const submissions = getSubmissions();
  return submissions.filter(sub => sub.examId === examId);
};

// Initialize with sample data if no exams exist
export const initializeSampleData = (): void => {
  const existingExams = getExams();
  if (existingExams.length === 0) {
    const sampleExam: Exam = {
      id: "sample-1",
      title: "Sample JavaScript Quiz",
      description: "A basic quiz to test JavaScript fundamentals",
      code: "JS101A",
      duration: 30,
      isActive: true,
      questions: [
        {
          id: "q1",
          text: "What is the correct way to declare a variable in JavaScript?",
          options: [
            "var myVariable = 5;",
            "variable myVariable = 5;",
            "v myVariable = 5;",
            "declare myVariable = 5;"
          ],
          correctAnswer: 0,
          points: 1
        },
        {
          id: "q2",
          text: "Which of the following is NOT a JavaScript data type?",
          options: [
            "string",
            "boolean",
            "float",
            "undefined"
          ],
          correctAnswer: 2,
          points: 1
        },
        {
          id: "q3",
          text: "What does DOM stand for?",
          options: [
            "Document Object Model",
            "Data Object Management",
            "Dynamic Object Method",
            "Document Oriented Model"
          ],
          correctAnswer: 0,
          points: 1
        }
      ],
      createdAt: new Date().toISOString(),
      submissions: []
    };
    
    saveExam(sampleExam);
  }
};

// Initialize sample data when the module loads
initializeSampleData();
