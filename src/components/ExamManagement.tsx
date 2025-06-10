
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Edit, 
  Trash2, 
  Power, 
  Copy, 
  Download, 
  BarChart3, 
  Users, 
  Clock, 
  Trophy,
  ArrowLeft 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  type Exam, 
  deleteExam, 
  toggleExamStatus, 
  duplicateExam, 
  getExamStatistics,
  exportExamResults,
  getExams 
} from "@/lib/examStorage";

interface ExamManagementProps {
  exam: Exam;
  onBack: () => void;
  onExamUpdated: () => void;
}

const ExamManagement = ({ exam, onBack, onExamUpdated }: ExamManagementProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const stats = getExamStatistics(exam.id);

  const handleToggleStatus = () => {
    toggleExamStatus(exam.id);
    onExamUpdated();
    toast({
      title: "Exam Status Updated",
      description: `Exam is now ${exam.isActive ? 'inactive' : 'active'}`,
    });
  };

  const handleDuplicate = () => {
    const newExam = duplicateExam(exam.id);
    if (newExam) {
      onExamUpdated();
      toast({
        title: "Exam Duplicated",
        description: `New exam created with code: ${newExam.code}`,
      });
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteExam(exam.id);
      onExamUpdated();
      onBack();
      toast({
        title: "Exam Deleted",
        description: "The exam and all related data have been removed",
        variant: "destructive"
      });
    }, 500);
  };

  const handleExportResults = () => {
    const csvData = exportExamResults(exam.id);
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exam.title.replace(/\s+/g, '_')}_results.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Results Exported",
        description: "CSV file has been downloaded",
      });
    }
  };

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
            <p className="text-gray-600">Exam Code: <span className="font-mono font-bold text-blue-600">{exam.code}</span></p>
          </div>
          <Badge variant={exam.isActive ? "default" : "secondary"}>
            {exam.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Questions</p>
                      <p className="text-2xl font-bold">{exam.questions.length}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Students</p>
                      <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-2xl font-bold">{exam.duration}m</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pass Rate</p>
                      <p className="text-2xl font-bold">{stats.passRate}%</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest student submissions for this exam</CardDescription>
              </CardHeader>
              <CardContent>
                {exam.submissions && exam.submissions.length > 0 ? (
                  <div className="space-y-4">
                    {exam.submissions.slice(-5).reverse().map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{submission.studentName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {submission.score}/{submission.maxScore}
                          </p>
                          <p className="text-sm text-gray-600">
                            {Math.round((submission.score / submission.maxScore) * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No submissions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Score:</span>
                      <span className="font-bold">{stats.averageScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Highest Score:</span>
                      <span className="font-bold text-green-600">{stats.highestScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lowest Score:</span>
                      <span className="font-bold text-red-600">{stats.lowestScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Time:</span>
                      <span className="font-bold">{Math.round(stats.averageTime / 60)} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Exam Duration:</span>
                      <span className="font-bold">{exam.duration} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completion Rate:</span>
                      <span className="font-bold">{stats.totalStudents > 0 ? '100' : '0'}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {stats.totalStudents > 0 && (
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Export Results</CardTitle>
                  <CardDescription>Download exam results as CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleExportResults} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results to CSV
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Exam Actions</CardTitle>
                <CardDescription>Manage this examination</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                    onClick={handleToggleStatus}
                    variant="outline"
                    className="w-full"
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {exam.isActive ? 'Deactivate' : 'Activate'} Exam
                  </Button>
                  
                  <Button
                    onClick={handleDuplicate}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Exam
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Exam
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the exam
                          and all associated student submissions.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExamManagement;
