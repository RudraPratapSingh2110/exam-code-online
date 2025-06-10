
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Eye, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExamCreator from "./ExamCreator";
import { getExams, type Exam } from "@/lib/examStorage";

interface ExaminerDashboardProps {
  onBack: () => void;
}

const ExaminerDashboard = ({ onBack }: ExaminerDashboardProps) => {
  const [showCreator, setShowCreator] = useState(false);
  const [exams, setExams] = useState<Exam[]>(getExams());
  const { toast } = useToast();

  const handleExamCreated = (newExam: Exam) => {
    setExams([...exams, newExam]);
    setShowCreator(false);
    toast({
      title: "Exam Created Successfully!",
      description: `Exam code: ${newExam.code}`,
    });
  };

  if (showCreator) {
    return (
      <ExamCreator 
        onExamCreated={handleExamCreated}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Examiner Dashboard</h1>
              <p className="text-gray-600">Create and manage your examinations</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreator(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Exam
          </Button>
        </div>

        {exams.length === 0 ? (
          <Card className="text-center py-12 bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Exams Created Yet</h3>
              <p className="text-gray-600 mb-6">Start by creating your first examination</p>
              <Button
                onClick={() => setShowCreator(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Create Your First Exam
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">{exam.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mt-1">
                        Code: <span className="font-mono font-bold text-blue-600">{exam.code}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        Questions
                      </span>
                      <span className="font-medium">{exam.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Duration
                      </span>
                      <span className="font-medium">{exam.duration} mins</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        Students
                      </span>
                      <span className="font-medium">{exam.submissions?.length || 0}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminerDashboard;
