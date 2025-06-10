
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookOpen, Clock, Trophy, Target, Calendar, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamTaking from "./ExamTaking";
import { getExams, getStudentSubmissions, type Exam, type Submission } from "@/lib/examStorage";

interface StudentDashboardProps {
  onBack: () => void;
}

const StudentDashboard = ({ onBack }: StudentDashboardProps) => {
  const [examCode, setExamCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const exams = getExams().filter(exam => exam.isActive);
    setAvailableExams(exams);
    
    if (studentName) {
      const submissions = getStudentSubmissions(studentName);
      setStudentSubmissions(submissions);
    }
  }, [studentName]);

  const handleJoinExam = (exam?: Exam) => {
    if (!studentName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      let targetExam = exam;
      
      if (!targetExam && examCode) {
        targetExam = availableExams.find(e => e.code === examCode.trim());
      }
      
      if (!targetExam) {
        toast({
          title: "Invalid Exam Code",
          description: "Please check the exam code and try again",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Check if student already submitted this exam
      const existingSubmission = studentSubmissions.find(s => s.examId === targetExam.id);
      if (existingSubmission) {
        toast({
          title: "Already Submitted",
          description: "You have already taken this exam",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      setCurrentExam(targetExam);
      setIsLoading(false);
    }, 1000);
  };

  const handleExamComplete = () => {
    setCurrentExam(null);
    setExamCode("");
    // Refresh submissions
    if (studentName) {
      const submissions = getStudentSubmissions(studentName);
      setStudentSubmissions(submissions);
    }
  };

  const calculateStats = () => {
    if (studentSubmissions.length === 0) return null;
    
    const totalScore = studentSubmissions.reduce((sum, sub) => sum + sub.score, 0);
    const totalMaxScore = studentSubmissions.reduce((sum, sub) => sum + sub.maxScore, 0);
    const averagePercentage = (totalScore / totalMaxScore) * 100;
    const bestScore = Math.max(...studentSubmissions.map(sub => (sub.score / sub.maxScore) * 100));
    
    return {
      totalExams: studentSubmissions.length,
      averagePercentage: Math.round(averagePercentage),
      bestScore: Math.round(bestScore)
    };
  };

  if (currentExam) {
    return (
      <ExamTaking 
        exam={currentExam}
        studentName={studentName}
        onComplete={handleExamComplete}
      />
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-white/50 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-gray-600">Welcome to your examination portal</p>
          </div>
        </div>

        {/* Student Info Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Your Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="border-gray-200 focus:border-indigo-500"
                />
              </div>
              
              {stats && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="font-bold text-blue-600">{stats.totalExams}</div>
                    <div className="text-xs text-blue-600">Exams Taken</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="font-bold text-green-600">{stats.averagePercentage}%</div>
                    <div className="text-xs text-green-600">Average</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="font-bold text-purple-600">{stats.bestScore}%</div>
                    <div className="text-xs text-purple-600">Best Score</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Join by Code */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                Join by Exam Code
              </CardTitle>
              <CardDescription>
                Enter the exam code provided by your instructor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examCode">Exam Code</Label>
                <Input
                  id="examCode"
                  placeholder="Enter exam code (e.g., ABC123)"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                  className="border-gray-200 focus:border-purple-500 font-mono text-center text-lg tracking-wider"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={() => handleJoinExam()}
                disabled={isLoading || !examCode.trim() || !studentName.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isLoading ? "Joining..." : "Join Exam"}
              </Button>
            </CardContent>
          </Card>

          {/* Available Exams */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Available Exams
              </CardTitle>
              <CardDescription>
                Click to join any active examination
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableExams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active exams available</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {availableExams.map((exam) => {
                    const hasSubmitted = studentSubmissions.some(s => s.examId === exam.id);
                    return (
                      <div
                        key={exam.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-all ${
                          hasSubmitted ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">{exam.title}</h4>
                            <p className="text-sm text-gray-600">Code: {exam.code}</p>
                          </div>
                          {hasSubmitted && (
                            <Badge variant="secondary">Completed</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exam.duration} mins
                            </span>
                            <span>{exam.questions.length} questions</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleJoinExam(exam)}
                            disabled={hasSubmitted || !studentName.trim()}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                          >
                            {hasSubmitted ? "Completed" : "Start Exam"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exam History */}
        {studentSubmissions.length > 0 && (
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Your Exam History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentSubmissions.map((submission) => {
                  const exam = availableExams.find(e => e.id === submission.examId) || 
                             getExams().find(e => e.id === submission.examId);
                  const percentage = Math.round((submission.score / submission.maxScore) * 100);
                  
                  return (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                      <div>
                        <h4 className="font-medium">{exam?.title || 'Unknown Exam'}</h4>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {submission.score}/{submission.maxScore}
                        </div>
                        <Badge variant={percentage >= 60 ? "default" : "destructive"}>
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
