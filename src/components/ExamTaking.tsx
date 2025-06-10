
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamResults from "./ExamResults";
import AIProctoring from "./AIProctoring";
import { saveSubmission, type Exam, type Submission } from "@/lib/examStorage";

interface ExamTakingProps {
  exam: Exam;
  studentName: string;
  onComplete: () => void;
}

interface ProctoringEvent {
  type: 'tab_switch' | 'multiple_faces' | 'no_face' | 'voice_detected' | 'suspicious_movement';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

const ExamTaking = ({ exam, studentName, onComplete }: ExamTakingProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [startTime] = useState(Date.now());
  const [proctoringViolations, setProctoringViolations] = useState<ProctoringEvent[]>([]);
  const [proctoringEnabled, setProctoringEnabled] = useState(true);
  const { toast } = useToast();

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    if (timeLeft === 300 && !showTimeWarning) {
      setShowTimeWarning(true);
      toast({
        title: "Time Warning!",
        description: "Only 5 minutes remaining",
        variant: "destructive"
      });
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showTimeWarning, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return "text-red-600";
    if (timeLeft <= 600) return "text-yellow-600";
    return "text-green-600";
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }));
  };

  const calculateScore = () => {
    let score = 0;
    let maxScore = 0;
    
    exam.questions.forEach(question => {
      maxScore += question.points;
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });
    
    return { score, maxScore };
  };

  const handleProctoringViolation = (violation: ProctoringEvent) => {
    setProctoringViolations(prev => [violation, ...prev]);
    
    // Auto-submit if too many high-severity violations
    const highSeverityViolations = [...proctoringViolations, violation].filter(v => v.severity === 'high');
    if (highSeverityViolations.length >= 5) {
      toast({
        title: "Exam Auto-Submitted",
        description: "Too many violations detected. Exam submitted automatically.",
        variant: "destructive"
      });
      handleAutoSubmit();
    }
  };

  const handleAutoSubmit = () => {
    const { score, maxScore } = calculateScore();
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    const newSubmission: Submission = {
      id: Date.now().toString(),
      studentName,
      examId: exam.id,
      answers,
      score,
      maxScore,
      submittedAt: new Date().toISOString(),
      timeTaken
    };
    
    saveSubmission(exam.id, newSubmission);
    setSubmission(newSubmission);
    
    toast({
      title: "Time's Up!",
      description: "Your exam has been automatically submitted",
      variant: "destructive"
    });
  };

  const handleSubmit = () => {
    const { score, maxScore } = calculateScore();
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    const newSubmission: Submission = {
      id: Date.now().toString(),
      studentName,
      examId: exam.id,
      answers,
      score,
      maxScore,
      submittedAt: new Date().toISOString(),
      timeTaken
    };
    
    saveSubmission(exam.id, newSubmission);
    setSubmission(newSubmission);
    setShowSubmitDialog(false);
    
    toast({
      title: "Exam Submitted Successfully!",
      description: `Your score: ${score}/${maxScore}`,
    });
  };

  if (submission) {
    return (
      <ExamResults 
        exam={exam}
        submission={submission}
        onFinish={onComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* AI Proctoring Panel */}
        {proctoringEnabled && (
          <div className="mb-6">
            <AIProctoring 
              isActive={true}
              onViolation={handleProctoringViolation}
              studentName={studentName}
            />
          </div>
        )}

        {/* Header with timer and progress */}
        <div className="bg-white/80 backdrop-blur border-0 shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-gray-600">Student: {studentName}</p>
              {proctoringEnabled && (
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">AI Proctoring Active</span>
                  {proctoringViolations.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {proctoringViolations.length} violations
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 text-lg font-bold ${getTimeColor()}`}>
                <Clock className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
              {timeLeft <= 300 && (
                <Badge variant="destructive" className="mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Time Warning
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              Answered: {answeredQuestions}/{totalQuestions}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <Badge variant="outline">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </Badge>
            </div>
            <CardDescription className="text-base text-gray-700 mt-4">
              {currentQuestion.text}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                  {answers[currentQuestion.id] === index && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {exam.questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 ${
                  answers[exam.questions[index].id] !== undefined
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : ''
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentQuestionIndex === totalQuestions - 1}
            >
              Next
            </Button>
          )}
        </div>

        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredQuestions} out of {totalQuestions} questions.
                {answeredQuestions < totalQuestions && (
                  <span className="block mt-2 text-yellow-600">
                    Warning: You haven't answered all questions. Unanswered questions will be marked as incorrect.
                  </span>
                )}
                {proctoringViolations.length > 0 && (
                  <span className="block mt-2 text-red-600">
                    Note: {proctoringViolations.length} proctoring violations were detected during this exam.
                  </span>
                )}
                <br />
                Are you sure you want to submit your exam? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Continue Exam
              </Button>
              <AlertDialogAction onClick={handleSubmit}>
                Submit Exam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ExamTaking;
