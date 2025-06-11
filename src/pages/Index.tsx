
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, UserCheck, GraduationCap, Calendar, Activity, Users, Shield, Brain, Eye, ArrowRight, CheckCircle, Star, TrendingUp, BarChart3, Target, Zap, Monitor, Clock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import ExaminerDashboard from "@/components/ExaminerDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import ExamScheduler from "@/components/ExamScheduler";
import ExamMonitor from "@/components/ExamMonitor";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Index = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'examiner' | 'student' | 'scheduler' | 'monitor'>('home');
  const [showLogin, setShowLogin] = useState(false);

  // ML Model Accuracy Data for Chart
  const mlAccuracyData = [
    { month: 'Jan', accuracy: 87.2, violations: 145 },
    { month: 'Feb', accuracy: 89.1, violations: 132 },
    { month: 'Mar', accuracy: 91.3, violations: 118 },
    { month: 'Apr', accuracy: 93.7, violations: 97 },
    { month: 'May', accuracy: 95.2, violations: 84 },
    { month: 'Jun', accuracy: 96.8, violations: 71 },
    { month: 'Jul', accuracy: 97.4, violations: 58 },
    { month: 'Aug', accuracy: 98.1, violations: 42 },
    { month: 'Sep', accuracy: 98.6, violations: 31 },
    { month: 'Oct', accuracy: 98.9, violations: 24 },
    { month: 'Nov', accuracy: 99.2, violations: 18 },
    { month: 'Dec', accuracy: 99.5, violations: 12 }
  ];

  if (!user && showLogin) {
    return <LoginForm onSuccess={() => setShowLogin(false)} />;
  }

  const renderCurrentView = () => {
    if (!user) return null;
    
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl animate-bounce">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6 animate-fade-in">
              ProctMe
            </h1>
            <p className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8 animate-fade-in delay-300">
              Revolutionary AI-Powered Online Examination & Proctoring Platform with Advanced Security
            </p>
            <div className="flex justify-center animate-fade-in delay-500">
              <Button 
                onClick={() => setShowLogin(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Get Started <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Core Features Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Comprehensive Feature Suite</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Proctoring */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">AI-Powered Proctoring</CardTitle>
                  <CardDescription className="text-blue-200">
                    Real-time face detection, voice analysis, tab switching alerts, and behavior tracking with 99.5% accuracy
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Secure Authentication */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Multi-Layer Security</CardTitle>
                  <CardDescription className="text-blue-200">
                    Advanced JWT authentication, role-based access control, and encrypted data transmission
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Real-time Monitoring */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Monitor className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Live Monitoring Dashboard</CardTitle>
                  <CardDescription className="text-blue-200">
                    Real-time exam monitoring with instant violation alerts, analytics, and comprehensive reporting
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Smart Scheduling */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Smart Exam Scheduling</CardTitle>
                  <CardDescription className="text-blue-200">
                    Advanced scheduling with time controls, student limits, auto-activation, and exam lifecycle management
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Question Management */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Question Bank System</CardTitle>
                  <CardDescription className="text-blue-200">
                    Comprehensive question management with multiple formats, auto-grading, and randomization features
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Analytics & Reporting */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Advanced Analytics</CardTitle>
                  <CardDescription className="text-blue-200">
                    Detailed performance analytics, violation reports, and ML-powered insights for exam integrity
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* AI Technology Showcase */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white text-center mb-8">AI Technology Performance</h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-4">Machine Learning Model Accuracy</h3>
                  <p className="text-blue-200 mb-4">
                    Our proprietary AI models continuously learn and improve, achieving industry-leading accuracy in detecting academic violations and ensuring exam integrity.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">99.5%</div>
                      <div className="text-blue-200 text-sm">Detection Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">0.1%</div>
                      <div className="text-blue-200 text-sm">False Positives</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h4 className="text-xl font-bold text-white mb-3">Key AI Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-blue-200">Face Detection & Recognition</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-blue-200">Voice Activity Monitoring</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-blue-200">Tab Switching Detection</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-blue-200">Behavioral Pattern Analysis</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4 text-center">ML Model Accuracy Over Time</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mlAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" domain={[85, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#60A5FA"
                      fill="url(#colorAccuracy)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">Advanced Technology Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Precision Monitoring</h3>
                <p className="text-blue-200">Advanced computer vision algorithms for precise face detection and behavioral analysis</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Real-time Processing</h3>
                <p className="text-blue-200">Lightning-fast AI processing with sub-second violation detection and alerting</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Continuous Learning</h3>
                <p className="text-blue-200">Machine learning models that continuously improve accuracy and reduce false positives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header with user info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to ProctMe
              </h1>
              <p className="text-gray-600">Hello, {user.name} ({user.role})</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Role-specific dashboard sections */}
        {user.role === 'examiner' ? (
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Examiner Portal */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Exam Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Create, manage, and analyze examinations with comprehensive tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Create exams with multiple question types
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Question bank management system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Advanced analytics and reporting
                  </li>
                </ul>
                <Button 
                  onClick={() => setCurrentView('examiner')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Access Exam Tools
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
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Schedule exams with date/time constraints
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Manage student registration limits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Automatic exam activation/deactivation
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
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur group md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Live Monitor</CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time monitoring dashboard for tracking student progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Live student tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    Real-time violation alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                    AI proctoring insights
                  </li>
                </ul>
                <Button 
                  onClick={() => setCurrentView('monitor')}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Launch Monitor
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Student Portal */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">Student Portal</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Enhanced exam-taking experience with AI-powered proctoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Exam Features</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        Join exams with unique access codes
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        Real-time timer with smart warnings
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        Auto-submit protection features
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">AI Proctoring</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        Face detection and monitoring
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        Tab switching detection
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        Voice activity monitoring
                      </li>
                    </ul>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentView('student')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-lg py-6"
                >
                  Enter Student Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur rounded-full shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">Secure • AI-Powered • Reliable Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
