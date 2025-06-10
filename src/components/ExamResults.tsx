
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, User, Trophy } from "lucide-react";
import { type Exam, type Submission } from "@/lib/examStorage";

interface ExamResultsProps {
  exam: Exam;
  submission: Submission;
  onFinish: () => void;
}

const ExamResults = ({ exam, submission, onFinish }: ExamResultsProps) => {
  const percentage = Math.round((submission.score / submission.maxScore) * 100);
  const timeTakenMinutes = Math.floor(submission.timeTaken / 60);
  const timeTakenSeconds = submission.timeTaken % 60;

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80) return { grade: "A", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60) return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 50) return { grade: "D", color: "text-orange-600", bg: "bg-orange-100" };
    return { grade: "F", color: "text-red-600", bg: "bg-red-100" };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Header */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Exam Completed!</CardTitle>
              <CardDescription className="text-lg">
                {exam.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{submission.score}</div>
                  <div className="text-sm text-gray-600">out of {submission.maxScore}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{percentage}%</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${gradeInfo.bg} ${gradeInfo.color} mt-2`}>
                    Grade: {gradeInfo.grade}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">
                    {timeTakenMinutes}:{timeTakenSeconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">minutes</div>
                  <div className="text-xs text-gray-500 mt-1">Time Taken</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-gray-600">Student Name</div>
                <div className="font-semibold">{submission.studentName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Submission Time</div>
                <div className="font-semibold">
                  {new Date(submission.submittedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and see the correct solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {exam.questions.map((question, index) => {
                const userAnswer = submission.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-lg">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? `+${question.points}` : '0'} pts
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{question.text}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        
                        let bgColor = "";
                        if (isCorrectAnswer) bgColor = "bg-green-100 border-green-300";
                        else if (isUserAnswer && !isCorrect) bgColor = "bg-red-100 border-red-300";
                        else bgColor = "bg-gray-50 border-gray-200";
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 border rounded ${bgColor}`}
                          >
                            <div className="flex items-center justify-between">
                              <span>
                                <span className="font-medium mr-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                              </span>
                              {isCorrectAnswer && (
                                <span className="text-green-600 text-sm font-medium">Correct</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="text-red-600 text-sm font-medium">Your Answer</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <Button
              onClick={onFinish}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Return to Student Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
