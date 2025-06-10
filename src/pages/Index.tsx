
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, UserCheck, GraduationCap, Calendar, Activity, Users } from "lucide-react";
import ExaminerDashboard from "@/components/ExaminerDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import ExamScheduler from "@/components/ExamScheduler";
import ExamMonitor from "@/components/ExamMonitor";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'examiner' | 'student' | 'scheduler' | 'monitor'>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'examiner':
        return <ExaminerDashboard onBack={() => setCurrentView('home')} />;
      case 'student':
        return <StudentDashboard onBack={() => setCurrentView('home')} />;
      case 'scheduler':
        return <ExamScheduler onBack={() => setCurrentView('home')} />;
      case 'monitor':
        return <ExamMonitor onBack={() => setCurrentView('home')} />;
      default:
        return null;
    }
  };

  if (currentView !== 'home') {
    return renderCurrentView();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ExamPro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive online examination platform with advanced scheduling, real-time monitoring, and intelligent analytics
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Examiner Portal */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Examiner Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Create, manage, and analyze examinations with comprehensive tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Create exams with multiple question types
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Question bank management system
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Advanced analytics and reporting
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Export results and data analysis
                </li>
              </ul>
              <Button 
                onClick={() => setCurrentView('examiner')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Access Examiner Tools
              </Button>
            </CardContent>
          </Card>

          {/* Student Portal */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Student Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Enhanced exam-taking experience with progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Join exams with unique access codes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Real-time timer with smart warnings
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Track your exam history and scores
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Auto-submit protection features
                </li>
              </ul>
              <Button 
                onClick={() => setCurrentView('student')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                Enter Student Portal
              </Button>
            </CardContent>
          </Card>

          {/* Exam Scheduler */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Exam Scheduler</CardTitle>
              <CardDescription className="text-gray-600">
                Schedule and manage examination sessions with time controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Schedule exams with date/time constraints
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Manage student registration limits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Automatic exam activation/deactivation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Session management dashboard
                </li>
              </ul>
              <Button 
                onClick={() => setCurrentView('scheduler')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                Access Scheduler
              </Button>
            </CardContent>
          </Card>

          {/* Real-time Monitor */}
          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur group md:col-span-2 lg:col-span-3">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Real-time Exam Monitor</CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Live monitoring dashboard for tracking student progress, detecting warnings, and ensuring exam integrity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold text-blue-600">Student Tracking</p>
                  <p className="text-sm text-blue-600">Real-time progress</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="font-semibold text-yellow-600">Live Activity</p>
                  <p className="text-sm text-yellow-600">Current question tracking</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold text-green-600">Time Management</p>
                  <p className="text-sm text-green-600">Countdown monitoring</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold text-purple-600">Smart Alerts</p>
                  <p className="text-sm text-purple-600">Warning notifications</p>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentView('monitor')}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6"
              >
                <Activity className="h-5 w-5 mr-2" />
                Launch Monitoring Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur rounded-full shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">Secure • Reliable • Advanced Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
