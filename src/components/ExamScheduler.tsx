
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Settings, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledExam {
  id: string;
  title: string;
  code: string;
  startDate: string;
  endDate: string;
  duration: number;
  maxStudents: number;
  registeredStudents: number;
  status: 'scheduled' | 'active' | 'completed';
}

interface ExamSchedulerProps {
  onBack: () => void;
}

const ExamScheduler = ({ onBack }: ExamSchedulerProps) => {
  const [scheduledExams, setScheduledExams] = useState<ScheduledExam[]>([
    {
      id: '1',
      title: 'Mathematics Final Exam',
      code: 'MATH01',
      startDate: '2024-06-15T09:00',
      endDate: '2024-06-15T11:00',
      duration: 120,
      maxStudents: 50,
      registeredStudents: 23,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Programming Quiz',
      code: 'PROG01',
      startDate: '2024-06-12T14:00',
      endDate: '2024-06-12T15:00',
      duration: 60,
      maxStudents: 30,
      registeredStudents: 30,
      status: 'active'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    startDate: '',
    endDate: '',
    duration: 60,
    maxStudents: 50
  });

  const { toast } = useToast();

  const handleCreateExam = () => {
    if (!newExam.title || !newExam.startDate || !newExam.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const exam: ScheduledExam = {
      id: Date.now().toString(),
      title: newExam.title,
      code: `EXAM${Date.now().toString().slice(-4)}`,
      startDate: newExam.startDate,
      endDate: newExam.endDate,
      duration: newExam.duration,
      maxStudents: newExam.maxStudents,
      registeredStudents: 0,
      status: 'scheduled'
    };

    setScheduledExams([...scheduledExams, exam]);
    setNewExam({ title: '', startDate: '', endDate: '', duration: 60, maxStudents: 50 });
    setShowCreateForm(false);

    toast({
      title: "Exam Scheduled!",
      description: `Exam "${exam.title}" has been scheduled successfully`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
              <h1 className="text-3xl font-bold text-gray-800">Exam Scheduler</h1>
              <p className="text-gray-600">Schedule and manage examination sessions</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Exam
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Schedule New Examination</CardTitle>
              <CardDescription>Set up a new exam session with date and time constraints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Maximum Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    min="1"
                    value={newExam.maxStudents}
                    onChange={(e) => setNewExam({ ...newExam, maxStudents: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={newExam.startDate}
                    onChange={(e) => setNewExam({ ...newExam, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newExam.endDate}
                    onChange={(e) => setNewExam({ ...newExam, endDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateExam} className="bg-gradient-to-r from-green-500 to-green-600">
                  Schedule Exam
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {scheduledExams.length === 0 ? (
            <Card className="text-center py-12 bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent>
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Scheduled Exams</h3>
                <p className="text-gray-600 mb-6">Create your first scheduled examination</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Schedule Your First Exam
                </Button>
              </CardContent>
            </Card>
          ) : (
            scheduledExams.map((exam) => (
              <Card key={exam.id} className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{exam.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Code: <span className="font-mono font-bold text-blue-600">{exam.code}</span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Time</p>
                        <p className="font-medium">{formatDateTime(exam.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{exam.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Students</p>
                        <p className="font-medium">{exam.registeredStudents}/{exam.maxStudents}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamScheduler;
