
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, Brain, BarChart3, BookOpen, Users, GraduationCap, UserPlus, LogIn, Eye, Clock, CheckCircle, Award, Lock, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/components/auth/AuthProvider";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ExaminerDashboard from "@/components/ExaminerDashboard";
import StudentDashboard from "@/components/StudentDashboard";

const Index = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const { user, logout } = useAuth();

  // ML Model accuracy data - February to June
  const mlAccuracyData = [
    { month: 'Feb', accuracy: 96.2, violations: 145 },
    { month: 'Mar', accuracy: 97.1, violations: 132 },
    { month: 'Apr', accuracy: 98.3, violations: 98 },
    { month: 'May', accuracy: 98.7, violations: 89 },
    { month: 'Jun', accuracy: 99.1, violations: 76 },
  ];

  // Show login form if requested
  if (showLoginForm) {
    return <LoginForm 
      onSuccess={() => setShowLoginForm(false)} 
      onSwitchToSignUp={() => {
        setShowLoginForm(false);
        setShowSignUpForm(true);
      }}
    />;
  }

  // Show signup form if requested
  if (showSignUpForm) {
    return <SignUpForm 
      onSuccess={() => setShowSignUpForm(false)}
      onSwitchToSignIn={() => {
        setShowSignUpForm(false);
        setShowLoginForm(true);
      }}
    />;
  }

  // Show role-specific dashboard if authenticated
  if (user) {
    if (user.role === 'examiner') {
      return <ExaminerDashboard onBack={logout} />;
    } else if (user.role === 'student') {
      return <StudentDashboard onBack={logout} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">ProctMe</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLoginForm(true)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button 
                onClick={() => setShowSignUpForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            AI-Powered Online
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Proctoring</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ensure exam integrity with advanced AI monitoring, real-time violation detection, and comprehensive analytics for educational institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl"
              onClick={() => setShowLoginForm(true)}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-12 py-6 text-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => setShowSignUpForm(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Comprehensive Proctoring Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Live Video Monitoring</CardTitle>
                <CardDescription>
                  Real-time face detection and behavior analysis to ensure students remain focused during exams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>AI Violation Detection</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms detect suspicious activities like tab switching and unauthorized assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Comprehensive reports on exam performance, violation patterns, and system accuracy metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Question Management</CardTitle>
                <CardDescription>
                  Create, organize, and manage exam questions with our intuitive question bank system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Secure Environment</CardTitle>
                <CardDescription>
                  Browser lockdown and screen sharing prevention to maintain exam security and integrity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Real-time Alerts</CardTitle>
                <CardDescription>
                  Instant notifications for proctors when violations are detected during live examinations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* ML Model Accuracy Chart */}
        <div className="mb-16">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Brain className="h-6 w-6" />
                AI Model Performance & Accuracy
              </CardTitle>
              <CardDescription className="text-center">
                Our machine learning model accuracy and violation detection trends (February - June 2024)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mlAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" domain={[95, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    name="Accuracy %" 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99.1%</div>
                  <div className="text-sm text-gray-600">Current Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2.9%</div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">76</div>
                  <div className="text-sm text-gray-600">Violations Detected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Information Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-center text-blue-800">For Teachers & Examiners</CardTitle>
              <CardDescription className="text-center text-blue-700">
                Complete exam management and proctoring control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span>Create and manage examinations</span>
              </div>
              <div className="flex items-center gap-3 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span>Real-time student monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span>Advanced analytics and reports</span>
              </div>
              <div className="flex items-center gap-3 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span>Question bank management</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-center text-green-800">For Students</CardTitle>
              <CardDescription className="text-center text-green-700">
                Secure and monitored examination experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-green-700">
                <Award className="h-5 w-5" />
                <span>Join exams with unique codes</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <Award className="h-5 w-5" />
                <span>Secure proctored environment</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <Award className="h-5 w-5" />
                <span>Instant results and feedback</span>
              </div>
              <div className="flex items-center gap-3 text-green-700">
                <Award className="h-5 w-5" />
                <span>Performance tracking</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
