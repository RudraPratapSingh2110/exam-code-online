
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Clock, AlertTriangle, CheckCircle, Eye, Activity } from "lucide-react";
import { getExams, type Exam } from "@/lib/examStorage";

interface ActiveStudent {
  id: string;
  name: string;
  currentQuestion: number;
  timeRemaining: number;
  answeredQuestions: number;
  status: 'active' | 'submitted' | 'warning';
  lastActivity: Date;
}

interface ExamMonitorProps {
  onBack: () => void;
}

const ExamMonitor = ({ onBack }: ExamMonitorProps) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [activeStudents, setActiveStudents] = useState<ActiveStudent[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const activeExams = getExams().filter(exam => exam.isActive);

  useEffect(() => {
    if (selectedExam) {
      // Simulate real-time student data
      const mockStudents: ActiveStudent[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          currentQuestion: 5,
          timeRemaining: 45 * 60,
          answeredQuestions: 4,
          status: 'active',
          lastActivity: new Date(Date.now() - 2000)
        },
        {
          id: '2',
          name: 'Bob Smith',
          currentQuestion: 3,
          timeRemaining: 50 * 60,
          answeredQuestions: 3,
          status: 'active',
          lastActivity: new Date(Date.now() - 5000)
        },
        {
          id: '3',
          name: 'Carol Williams',
          currentQuestion: 8,
          timeRemaining: 15 * 60,
          answeredQuestions: 7,
          status: 'warning',
          lastActivity: new Date(Date.now() - 1000)
        },
        {
          id: '4',
          name: 'David Brown',
          currentQuestion: 10,
          timeRemaining: 0,
          answeredQuestions: 10,
          status: 'submitted',
          lastActivity: new Date(Date.now() - 30000)
        }
      ];
      
      setActiveStudents(mockStudents);

      // Set up refresh interval
      const interval = setInterval(() => {
        setActiveStudents(prev => prev.map(student => ({
          ...student,
          timeRemaining: student.status === 'active' ? Math.max(0, student.timeRemaining - 1) : student.timeRemaining,
          status: student.timeRemaining <= 300 && student.status === 'active' ? 'warning' : student.status
        })));
      }, 1000);

      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [selectedExam]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
                     : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeColor = (timeRemaining: number) => {
    if (timeRemaining <= 300) return 'text-red-600';
    if (timeRemaining <= 900) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!selectedExam) {
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
              <h1 className="text-3xl font-bold text-gray-800">Exam Monitor</h1>
              <p className="text-gray-600">Real-time monitoring of active examinations</p>
            </div>
          </div>

          <div className="grid gap-6">
            {activeExams.length === 0 ? (
              <Card className="text-center py-12 bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent>
                  <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Active Exams</h3>
                  <p className="text-gray-600">No examinations are currently active for monitoring</p>
                </CardContent>
              </Card>
            ) : (
              activeExams.map((exam) => (
                <Card 
                  key={exam.id} 
                  className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedExam(exam)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        <CardDescription className="text-base mt-2">
                          Code: <span className="font-mono font-bold text-blue-600">{exam.code}</span>
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <Activity className="h-3 w-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Active Students</p>
                          <p className="font-medium">{exam.submissions?.length || 0}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{exam.duration} minutes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Eye className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Questions</p>
                          <p className="font-medium">{exam.questions.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600">
                      <Activity className="h-4 w-4 mr-2" />
                      Start Monitoring
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  const activeCount = activeStudents.filter(s => s.status === 'active').length;
  const warningCount = activeStudents.filter(s => s.status === 'warning').length;
  const submittedCount = activeStudents.filter(s => s.status === 'submitted').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedExam(null)}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exams
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedExam.title}</h1>
              <p className="text-gray-600">Live Monitoring • Code: {selectedExam.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-2xl font-bold text-blue-600">{submittedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-purple-600">{activeStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Student Activity Monitor
            </CardTitle>
            <CardDescription>Real-time tracking of student progress and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeStudents.map((student) => (
                <div key={student.id} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          Last activity: {Math.floor((Date.now() - student.lastActivity.getTime()) / 1000)}s ago
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status === 'active' && <Activity className="h-3 w-3 mr-1" />}
                      {student.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {student.status === 'submitted' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Question</p>
                      <p className="font-medium">{student.currentQuestion}/{selectedExam.questions.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Answered</p>
                      <p className="font-medium">{student.answeredQuestions}/{selectedExam.questions.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Time Remaining</p>
                      <p className={`font-medium ${getTimeColor(student.timeRemaining)}`}>
                        {formatTime(student.timeRemaining)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Progress</p>
                      <Progress 
                        value={(student.answeredQuestions / selectedExam.questions.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamMonitor;
