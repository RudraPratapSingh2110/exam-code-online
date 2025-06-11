
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, UserCheck, GraduationCap, Calendar, Activity, Users, Shield, Brain, Eye, ArrowRight, CheckCircle, Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import ExaminerDashboard from "@/components/ExaminerDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import ExamScheduler from "@/components/ExamScheduler";
import ExamMonitor from "@/components/ExamMonitor";

const Index = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'examiner' | 'student' | 'scheduler' | 'monitor'>('home');
  const [showLogin, setShowLogin] = useState(false);

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
              Next-Generation AI-Powered Online Examination & Proctoring Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-500">
              <Button 
                onClick={() => setShowLogin(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-400 text-blue-100 hover:bg-blue-400/10 text-lg px-8 py-4 rounded-full"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* AI Proctoring */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">AI-Powered Proctoring</CardTitle>
                <CardDescription className="text-blue-200">
                  Advanced AI monitoring with face detection, voice analysis, and behavior tracking
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Secure Authentication */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Secure Authentication</CardTitle>
                <CardDescription className="text-blue-200">
                  Multi-layer security with JWT authentication and role-based access control
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Real-time Monitoring */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Live Monitoring</CardTitle>
                <CardDescription className="text-blue-200">
                  Real-time exam monitoring with instant violation alerts and analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-blue-200">Exams Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">50K+</div>
              <div className="text-blue-200">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">95%</div>
              <div className="text-blue-200">Fraud Detection</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-12">Trusted by Educational Leaders</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-4">"ProctMe revolutionized our online assessments with its AI proctoring capabilities."</p>
                  <div className="text-blue-300 font-semibold">Dr. Sarah Johnson</div>
                  <div className="text-blue-400 text-sm">Stanford University</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-4">"The security features and analytics provide unmatched exam integrity."</p>
                  <div className="text-blue-300 font-semibold">Prof. Michael Chen</div>
                  <div className="text-blue-400 text-sm">MIT</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-4">"Students love the intuitive interface and fair proctoring system."</p>
                  <div className="text-blue-300 font-semibold">Dr. Emily Rodriguez</div>
                  <div className="text-blue-400 text-sm">Harvard University</div>
                </CardContent>
              </Card>
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
