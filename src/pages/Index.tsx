
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Shield, Camera, Brain, BarChart3, BookOpen, Users, GraduationCap, UserPlus, LogIn, Eye, Clock, CheckCircle, Award, Lock, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import ExamCreator from "@/components/ExamCreator";
import QuestionBank from "@/components/QuestionBank";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { type Exam } from "@/lib/examStorage";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'examCreator' | 'questionBank' | 'analytics'>('home');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; type: 'teacher' | 'student' } | null>(null);
  const { toast } = useToast();

  // ML Model accuracy data - February to June
  const mlAccuracyData = [
    { month: 'Feb', accuracy: 96.2, violations: 145 },
    { month: 'Mar', accuracy: 97.1, violations: 132 },
    { month: 'Apr', accuracy: 98.3, violations: 98 },
    { month: 'May', accuracy: 98.7, violations: 89 },
    { month: 'Jun', accuracy: 99.1, violations: 76 },
  ];

  const handleAuth = (formData: any) => {
    const userData = {
      name: formData.name || `${userType} User`,
      email: formData.email,
      type: userType
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    
    toast({
      title: authMode === 'signin' ? "Welcome back!" : "Account created successfully!",
      description: `You are now logged in as a ${userType}.`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('home');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleExamCreated = (exam: Exam) => {
    toast({
      title: "Exam Created!",
      description: `Exam "${exam.title}" has been created successfully.`,
    });
    setCurrentView('home');
  };

  if (currentView === 'examCreator') {
    return (
      <ExamCreator 
        onExamCreated={handleExamCreated}
        onCancel={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'questionBank') {
    return (
      <QuestionBank onBack={() => setCurrentView('home')} />
    );
  }

  if (currentView === 'analytics') {
    return (
      <AnalyticsDashboard onBack={() => setCurrentView('home')} />
    );
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
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setAuthMode('signin');
                          setShowAuthDialog(true);
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </DialogTrigger>
                    <AuthDialog 
                      mode={authMode} 
                      userType={userType}
                      onAuth={handleAuth}
                      onModeChange={setAuthMode}
                      onUserTypeChange={setUserType}
                    />
                  </Dialog>
                  <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setAuthMode('signup');
                          setShowAuthDialog(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </>
              )}
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              onClick={() => {
                if (isAuthenticated) {
                  setCurrentView('examCreator');
                } else {
                  setShowAuthDialog(true);
                  setAuthMode('signup');
                }
              }}
            >
              Get Started
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

        {/* Dashboard Features */}
        {isAuthenticated && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card 
              className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentView('examCreator')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
                <CardTitle>Create Exam</CardTitle>
                <CardDescription>
                  Design new examinations with custom questions and settings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentView('questionBank')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <CardTitle>Question Bank</CardTitle>
                <CardDescription>
                  Manage and organize your examination questions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentView('analytics')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="secondary">Analytics</Badge>
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View comprehensive exam and performance analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Auth Dialog Component
const AuthDialog = ({ mode, userType, onAuth, onModeChange, onUserTypeChange }: {
  mode: 'signin' | 'signup';
  userType: 'teacher' | 'student';
  onAuth: (data: any) => void;
  onModeChange: (mode: 'signin' | 'signup') => void;
  onUserTypeChange: (type: 'teacher' | 'student') => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(formData);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </DialogTitle>
        <DialogDescription>
          {mode === 'signin' 
            ? 'Welcome back! Please enter your credentials.' 
            : 'Join ProctMe and start creating secure online examinations.'
          }
        </DialogDescription>
      </DialogHeader>
      
      <Tabs value={userType} onValueChange={(value) => onUserTypeChange(value as 'teacher' | 'student')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'signup' && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          {mode === 'signup' && userType === 'teacher' && (
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Your school or university"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
          
          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </form>
      </Tabs>
    </DialogContent>
  );
};

export default Index;
