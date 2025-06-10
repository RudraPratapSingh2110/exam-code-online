
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamResults from "./ExamResults";
import { saveSubmission, type Exam, type Submission } from "@/lib/examStorage";

interface ExamTakingProps {
  exam: Exam;
  studentName: string;
  onComplete: () => void;
}

const ExamTaking = ({ exam, studentName, onComplete }: ExamTakingProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60); // Convert to seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 && !isCompleted) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: Number(value)
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    const score = exam.questions.reduce((total, question) => {
      const userAnswer = answers[question.id];
      return userAnswer === question.correctAnswer ? total + question.points : total;
    }, 0);

    const maxScore = exam.questions.reduce((total, question) => total + question.points, 0);

    const newSubmission: Submission = {
      id: Date.now().toString(),
      studentName,
      examId: exam.id,
      answers,
      score,
      maxScore,
      submittedAt: new Date().toISOString(),
      timeTaken: (exam.duration * 60) - timeLeft
    };

    saveSubmission(exam.id, newSubmission);
    setSubmission(newSubmission);
    setIsCompleted(true);

    toast({
      title: "Exam Submitted Successfully!",
      description: `Your score: ${score}/${maxScore}`,
    });
  };

  if (isCompleted && submission) {
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
        {/* Header */}
        <div className="bg-white/80 backdrop-blur rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-gray-600">Student: {studentName}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-lg font-bold">
                <Clock className="h-5 w-5" />
                <span className={timeLeft < 300 ? "text-red-600" : "text-gray-800"}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Time Remaining</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress: {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>Answered: {answeredQuestions}/{totalQuestions}</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {currentQuestionIndex + 1}</span>
              <span className="text-sm font-normal text-gray-600">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
              </span>
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {currentQuestion.text}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {answers[currentQuestion.id] !== undefined && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                <span className="text-sm text-gray-600">
                  {answers[currentQuestion.id] !== undefined ? "Answered" : "Not answered"}
                </span>
              </div>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  onClick={handleSubmitExam}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg max-w-4xl mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {exam.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-full ${
                    answers[exam.questions[index].id] !== undefined
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      : index === currentQuestionIndex
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamTaking;
