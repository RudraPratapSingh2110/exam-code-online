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

// Enhanced exam management functions
export const updateExam = (examId: string, updates: Partial<Exam>): void => {
  const exams = getExams();
  const examIndex = exams.findIndex(e => e.id === examId);
  
  if (examIndex >= 0) {
    exams[examIndex] = { ...exams[examIndex], ...updates };
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  }
};

export const deleteExam = (examId: string): void => {
  const exams = getExams();
  const filteredExams = exams.filter(e => e.id !== examId);
  localStorage.setItem(EXAMS_KEY, JSON.stringify(filteredExams));
  
  // Also delete related submissions
  const submissions = getSubmissions();
  const filteredSubmissions = submissions.filter(s => s.examId !== examId);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(filteredSubmissions));
};

export const toggleExamStatus = (examId: string): void => {
  const exam = getExamById(examId);
  if (exam) {
    updateExam(examId, { isActive: !exam.isActive });
  }
};

export const duplicateExam = (examId: string): Exam | null => {
  const exam = getExamById(examId);
  if (!exam) return null;
  
  const newExam: Exam = {
    ...exam,
    id: Date.now().toString(),
    title: `${exam.title} (Copy)`,
    code: generateExamCode(),
    createdAt: new Date().toISOString(),
    submissions: []
  };
  
  saveExam(newExam);
  return newExam;
};

// Analytics functions
export const getExamStatistics = (examId: string) => {
  const submissions = getSubmissionsByExam(examId);
  
  if (submissions.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      averageTime: 0
    };
  }
  
  const scores = submissions.map(s => (s.score / s.maxScore) * 100);
  const times = submissions.map(s => s.timeTaken);
  const passThreshold = 60; // 60% pass rate
  
  return {
    totalStudents: submissions.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    highestScore: Math.round(Math.max(...scores)),
    lowestScore: Math.round(Math.min(...scores)),
    passRate: Math.round((scores.filter(s => s >= passThreshold).length / scores.length) * 100),
    averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  };
};

export const exportExamResults = (examId: string): string => {
  const exam = getExamById(examId);
  const submissions = getSubmissionsByExam(examId);
  
  if (!exam) return '';
  
  const csvHeader = 'Student Name,Score,Max Score,Percentage,Time Taken (min),Submitted At\n';
  const csvData = submissions.map(sub => {
    const percentage = Math.round((sub.score / sub.maxScore) * 100);
    const timeInMinutes = Math.round(sub.timeTaken / 60);
    return `${sub.studentName},${sub.score},${sub.maxScore},${percentage}%,${timeInMinutes},${new Date(sub.submittedAt).toLocaleString()}`;
  }).join('\n');
  
  return csvHeader + csvData;
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
