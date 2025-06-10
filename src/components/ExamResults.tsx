
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User, BookOpen, Shield, BarChart3 } from "lucide-react";
import ProctoringReport from "./ProctoringReport";
import { type Exam, type Submission } from "@/lib/examStorage";

interface ExamResultsProps {
  exam: Exam;
  submission: Submission;
  onFinish: () => void;
}

const ExamResults = ({ exam, submission, onFinish }: ExamResultsProps) => {
  const [showProctoringReport, setShowProctoringReport] = useState(false);
  
  const percentage = Math.round((submission.score / submission.maxScore) * 100);
  const timeInMinutes = Math.round(submission.timeTaken / 60);
  
  const getGradeColor = (percent: number) => {
    if (percent >= 90) return "text-green-600";
    if (percent >= 80) return "text-blue-600";
    if (percent >= 70) return "text-yellow-600";
    if (percent >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeLetter = (percent: number) => {
    if (percent >= 90) return "A";
    if (percent >= 80) return "B";
    if (percent >= 70) return "C";
    if (percent >= 60) return "D";
    return "F";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Exam Completed!</h1>
          <p className="text-gray-600 text-lg">Thank you for taking the examination</p>
        </div>

        {/* Results Summary */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-xl mb-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">{exam.title}</CardTitle>
            <CardDescription className="text-lg">
              Results for {submission.studentName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className={`text-8xl font-bold mb-4 ${getGradeColor(percentage)}`}>
                {getGradeLetter(percentage)}
              </div>
              <div className="text-3xl font-semibold text-gray-700 mb-2">
                {submission.score} / {submission.maxScore}
              </div>
              <div className={`text-2xl font-medium ${getGradeColor(percentage)}`}>
                {percentage}%
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-semibold text-blue-600">{submission.studentName}</div>
                <div className="text-sm text-gray-600">Student</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold text-green-600">{percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-semibold text-purple-600">{timeInMinutes}m</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                <div className="text-lg font-semibold text-indigo-600">{exam.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Performance</span>
                <span className="text-sm text-gray-600">{submission.score}/{submission.maxScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Proctoring Section */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              AI Proctoring Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">
                  This exam was monitored using AI-powered proctoring technology
                </p>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Exam Integrity Verified
                </Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowProctoringReport(!showProctoringReport)}
                className="ml-4"
              >
                {showProctoringReport ? 'Hide' : 'View'} Proctoring Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Proctoring Report */}
        {showProctoringReport && (
          <div className="mb-8">
            <ProctoringReport submission={submission} />
          </div>
        )}

        {/* Question Review */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>
              Review your answers and see which questions you got right or wrong
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exam.questions.map((question, index) => {
                const userAnswer = submission.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = userAnswer !== undefined;
                
                return (
                  <div key={question.id} className={`p-4 rounded-lg border-2 ${
                    !wasAnswered ? 'border-gray-300 bg-gray-50' :
                    isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700">Q{index + 1}.</span>
                        {!wasAnswered ? (
                          <Badge variant="secondary">Not Answered</Badge>
                        ) : isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <Badge variant="outline">{question.points} pts</Badge>
                    </div>
                    
                    <p className="text-gray-800 mb-3 font-medium">{question.text}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        
                        return (
                          <div key={optionIndex} className={`p-2 rounded border ${
                            isCorrectAnswer ? 'border-green-400 bg-green-100' :
                            isUserAnswer && !isCorrectAnswer ? 'border-red-400 bg-red-100' :
                            'border-gray-200 bg-white'
                          }`}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                            {option}
                            {isCorrectAnswer && (
                              <Badge variant="outline" className="ml-2 text-green-700 border-green-400">
                                Correct Answer
                              </Badge>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <Badge variant="outline" className="ml-2 text-red-700 border-red-400">
                                Your Answer
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center">
          <Button
            onClick={onFinish}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
