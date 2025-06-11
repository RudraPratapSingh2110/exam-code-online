
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Users, Settings, ArrowLeft, Plus, Edit, Trash2, Eye, Send, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getExams, type Exam } from "@/lib/examStorage";

type ExamType = 'multiple-choice' | 'essay' | 'mixed';

interface ScheduledExam {
  id: string;
  examId?: string;
  title: string;
  description: string;
  code: string;
  startDate: string;
  endDate: string;
  duration: number;
  maxStudents: number;
  registeredStudents: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  examType: ExamType;
  proctoring: boolean;
  autoGrading: boolean;
  allowRetake: boolean;
  instructions: string;
  createdAt: string;
}

interface ExamSchedulerProps {
  onBack: () => void;
}

const ExamScheduler = ({ onBack }: ExamSchedulerProps) => {
  const [scheduledExams, setScheduledExams] = useState<ScheduledExam[]>([]);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExam, setEditingExam] = useState<ScheduledExam | null>(null);
  const [newExam, setNewExam] = useState({
    examId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 60,
    maxStudents: 50,
    examType: 'multiple-choice' as ExamType,
    proctoring: true,
    autoGrading: true,
    allowRetake: false,
    instructions: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    // Load available exams from storage
    const exams = getExams();
    setAvailableExams(exams);

    // Load scheduled exams from localStorage
    const stored = localStorage.getItem('proctme_scheduled_exams');
    if (stored) {
      setScheduledExams(JSON.parse(stored));
    }
  }, []);

  const saveScheduledExams = (exams: ScheduledExam[]) => {
    localStorage.setItem('proctme_scheduled_exams', JSON.stringify(exams));
    setScheduledExams(exams);
  };

  const handleCreateExam = () => {
    if (!newExam.title || !newExam.startDate || !newExam.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedExam = availableExams.find(e => e.id === newExam.examId);
    
    const exam: ScheduledExam = {
      id: Date.now().toString(),
      examId: newExam.examId || undefined,
      title: newExam.title,
      description: newExam.description,
      code: `EXAM${Date.now().toString().slice(-4)}`,
      startDate: newExam.startDate,
      endDate: newExam.endDate,
      duration: selectedExam ? selectedExam.duration : newExam.duration,
      maxStudents: newExam.maxStudents,
      registeredStudents: 0,
      status: 'scheduled',
      examType: newExam.examType,
      proctoring: newExam.proctoring,
      autoGrading: newExam.autoGrading,
      allowRetake: newExam.allowRetake,
      instructions: newExam.instructions,
      createdAt: new Date().toISOString()
    };

    const updatedExams = [...scheduledExams, exam];
    saveScheduledExams(updatedExams);
    
    setNewExam({ 
      examId: '', title: '', description: '', startDate: '', endDate: '', 
      duration: 60, maxStudents: 50, examType: 'multiple-choice', 
      proctoring: true, autoGrading: true, allowRetake: false, instructions: '' 
    });
    setShowCreateForm(false);

    toast({
      title: "Exam Scheduled!",
      description: `Exam "${exam.title}" has been scheduled successfully`,
    });
  };

  const handleEditExam = (exam: ScheduledExam) => {
    setEditingExam(exam);
    setNewExam({
      examId: exam.examId || '',
      title: exam.title,
      description: exam.description,
      startDate: exam.startDate,
      endDate: exam.endDate,
      duration: exam.duration,
      maxStudents: exam.maxStudents,
      examType: exam.examType,
      proctoring: exam.proctoring,
      autoGrading: exam.autoGrading,
      allowRetake: exam.allowRetake,
      instructions: exam.instructions
    });
    setShowCreateForm(true);
  };

  const handleUpdateExam = () => {
    if (!editingExam) return;

    const updatedExam: ScheduledExam = {
      ...editingExam,
      examId: newExam.examId || undefined,
      title: newExam.title,
      description: newExam.description,
      startDate: newExam.startDate,
      endDate: newExam.endDate,
      duration: newExam.duration,
      maxStudents: newExam.maxStudents,
      examType: newExam.examType,
      proctoring: newExam.proctoring,
      autoGrading: newExam.autoGrading,
      allowRetake: newExam.allowRetake,
      instructions: newExam.instructions
    };

    const updatedExams = scheduledExams.map(e => e.id === editingExam.id ? updatedExam : e);
    saveScheduledExams(updatedExams);
    
    setEditingExam(null);
    setShowCreateForm(false);
    setNewExam({ 
      examId: '', title: '', description: '', startDate: '', endDate: '', 
      duration: 60, maxStudents: 50, examType: 'multiple-choice', 
      proctoring: true, autoGrading: true, allowRetake: false, instructions: '' 
    });

    toast({
      title: "Exam Updated!",
      description: "Exam has been updated successfully",
    });
  };

  const handleDeleteExam = (examId: string) => {
    const updatedExams = scheduledExams.filter(e => e.id !== examId);
    saveScheduledExams(updatedExams);
    
    toast({
      title: "Exam Deleted",
      description: "Scheduled exam has been removed",
    });
  };

  const copyExamCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `Exam code "${code}" copied to clipboard`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleActivateExam = (examId: string) => {
    const updatedExams = scheduledExams.map(e => 
      e.id === examId ? { ...e, status: 'active' as const } : e
    );
    saveScheduledExams(updatedExams);
    
    toast({
      title: "Exam Activated!",
      description: "Students can now join the exam",
    });
  };

  const handleCompleteExam = (examId: string) => {
    const updatedExams = scheduledExams.map(e => 
      e.id === examId ? { ...e, status: 'completed' as const } : e
    );
    saveScheduledExams(updatedExams);
    
    toast({
      title: "Exam Completed!",
      description: "Exam has been marked as completed",
    });
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
              <p className="text-gray-600">Advanced scheduling and management for examinations</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingExam(null);
              setShowCreateForm(!showCreateForm);
              setNewExam({ 
                examId: '', title: '', description: '', startDate: '', endDate: '', 
                duration: 60, maxStudents: 50, examType: 'multiple-choice', 
                proctoring: true, autoGrading: true, allowRetake: false, instructions: '' 
              });
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Exam
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle>{editingExam ? 'Edit Scheduled Exam' : 'Schedule New Examination'}</CardTitle>
              <CardDescription>Configure exam settings, timing, and proctoring options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="examId">Link to Existing Exam (Optional)</Label>
                  <Select value={newExam.examId} onValueChange={(value) => setNewExam({ ...newExam, examId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an existing exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Create New Schedule</SelectItem>
                      {availableExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title} ({exam.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select value={newExam.examType} onValueChange={(value: ExamType) => setNewExam({ ...newExam, examType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="mixed">Mixed Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    disabled={!!newExam.examId}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter exam description..."
                  value={newExam.description}
                  onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter any special instructions for students..."
                  value={newExam.instructions}
                  onChange={(e) => setNewExam({ ...newExam, instructions: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="proctoring"
                    checked={newExam.proctoring}
                    onCheckedChange={(checked) => setNewExam({ ...newExam, proctoring: checked })}
                  />
                  <Label htmlFor="proctoring">Enable AI Proctoring</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoGrading"
                    checked={newExam.autoGrading}
                    onCheckedChange={(checked) => setNewExam({ ...newExam, autoGrading: checked })}
                  />
                  <Label htmlFor="autoGrading">Auto Grading</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowRetake"
                    checked={newExam.allowRetake}
                    onCheckedChange={(checked) => setNewExam({ ...newExam, allowRetake: checked })}
                  />
                  <Label htmlFor="allowRetake">Allow Retakes</Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={editingExam ? handleUpdateExam : handleCreateExam} 
                  className="bg-gradient-to-r from-green-500 to-green-600"
                >
                  {editingExam ? 'Update Exam' : 'Schedule Exam'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowCreateForm(false);
                  setEditingExam(null);
                }}>
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
                        {exam.description && <p className="mb-2">{exam.description}</p>}
                        Code: <span className="font-mono font-bold text-blue-600">{exam.code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyExamCode(exam.code)}
                          className="ml-2 h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditExam(exam)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteExam(exam.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Time</p>
                        <p className="font-medium text-sm">{formatDateTime(exam.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-sm">{exam.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Students</p>
                        <p className="font-medium text-sm">{exam.registeredStudents}/{exam.maxStudents}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Eye className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Proctoring</p>
                        <p className="font-medium text-sm">{exam.proctoring ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {exam.status === 'scheduled' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleActivateExam(exam.id)}
                          className="w-full"
                        >
                          Activate
                        </Button>
                      )}
                      {exam.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCompleteExam(exam.id)}
                          className="w-full"
                        >
                          Complete
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>

                  {exam.instructions && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
                      <p className="text-sm text-gray-600">{exam.instructions}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline">{exam.examType}</Badge>
                    {exam.autoGrading && <Badge variant="outline">Auto Grading</Badge>}
                    {exam.allowRetake && <Badge variant="outline">Retakes Allowed</Badge>}
                    {exam.examId && <Badge variant="outline">Linked Exam</Badge>}
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
