
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamTaking from "./ExamTaking";
import { getExamByCode, type Exam } from "@/lib/examStorage";

interface StudentInterfaceProps {
  onBack: () => void;
}

const StudentInterface = ({ onBack }: StudentInterfaceProps) => {
  const [examCode, setExamCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJoinExam = async () => {
    if (!examCode.trim() || !studentName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both exam code and your name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const exam = getExamByCode(examCode.trim());
      
      if (!exam) {
        toast({
          title: "Invalid Exam Code",
          description: "Please check the exam code and try again",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (!exam.isActive) {
        toast({
          title: "Exam Not Available",
          description: "This exam is currently not active",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      setCurrentExam(exam);
      setIsLoading(false);
    }, 1000);
  };

  const handleExamComplete = () => {
    setCurrentExam(null);
    setExamCode("");
    setStudentName("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Portal</h1>
            <p className="text-gray-600">Enter your exam code to get started</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Join Examination</CardTitle>
              <CardDescription>
                Enter the exam code provided by your examiner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Your Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="border-gray-200 focus:border-purple-500"
                />
              </div>
              
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
                onClick={handleJoinExam}
                disabled={isLoading || !examCode.trim() || !studentName.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isLoading ? "Joining..." : "Join Exam"}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Make sure you have a stable internet connection
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentInterface;
