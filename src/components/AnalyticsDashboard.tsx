
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Users, BookOpen, Shield, Activity, BarChart3, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

const AnalyticsDashboard = ({ onBack }: AnalyticsDashboardProps) => {
  // Analytics data
  const examStats = {
    totalExams: 145,
    activeExams: 12,
    completedExams: 128,
    totalStudents: 2847,
    violationsDetected: 89,
    avgAccuracy: 98.7
  };

  const monthlyData = [
    { month: 'Jan', exams: 12, students: 234, violations: 8 },
    { month: 'Feb', exams: 18, students: 289, violations: 12 },
    { month: 'Mar', exams: 15, students: 267, violations: 7 },
    { month: 'Apr', exams: 22, students: 345, violations: 15 },
    { month: 'May', exams: 28, students: 412, violations: 9 },
    { month: 'Jun', exams: 25, students: 378, violations: 11 },
  ];

  const violationTypes = [
    { name: 'Tab Switching', value: 35, color: '#ef4444' },
    { name: 'Face Not Visible', value: 28, color: '#f97316' },
    { name: 'Multiple Faces', value: 18, color: '#eab308' },
    { name: 'Voice Detected', value: 12, color: '#22c55e' },
    { name: 'Suspicious Movement', value: 7, color: '#3b82f6' },
  ];

  const aiAccuracyData = [
    { week: 'Week 1', accuracy: 96.2, falsePositives: 3.8 },
    { week: 'Week 2', accuracy: 97.1, falsePositives: 2.9 },
    { week: 'Week 3', accuracy: 98.3, falsePositives: 1.7 },
    { week: 'Week 4', accuracy: 98.7, falsePositives: 1.3 },
  ];

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
              <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights and performance analytics</p>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{examStats.totalExams}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Exams</p>
                  <p className="text-2xl font-bold text-green-600">{examStats.activeExams}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-purple-600">{examStats.totalStudents}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Violations</p>
                  <p className="text-2xl font-bold text-red-600">{examStats.violationsDetected}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                  <p className="text-2xl font-bold text-indigo-600">{examStats.avgAccuracy}%</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">{examStats.completedExams}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Exam Trends */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Exam Activity
              </CardTitle>
              <CardDescription>Exams conducted and student participation trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="exams" fill="#3b82f6" name="Exams" />
                  <Bar dataKey="students" fill="#8b5cf6" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Model Accuracy */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Model Performance
              </CardTitle>
              <CardDescription>Weekly accuracy trends and false positive rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aiAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="week" stroke="#666" />
                  <YAxis stroke="#666" domain={[95, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} name="Accuracy %" />
                  <Line type="monotone" dataKey="falsePositives" stroke="#f59e0b" strokeWidth={2} name="False Positives %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Violation Types Breakdown */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Violation Types
              </CardTitle>
              <CardDescription>Distribution of detected violations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={violationTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {violationTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {violationTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      ></div>
                      <span>{type.name}</span>
                    </div>
                    <span className="font-medium">{type.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent System Activity
              </CardTitle>
              <CardDescription>Latest events and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-1 bg-green-500 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Exam "Advanced Mathematics" completed successfully</p>
                    <p className="text-xs text-green-600">45 students participated • 2 violations detected</p>
                    <p className="text-xs text-green-500">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="p-1 bg-yellow-500 rounded-full mt-1">
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">Multiple tab switching detected in "Physics Quiz"</p>
                    <p className="text-xs text-yellow-600">Student ID: STU_2847 • Action: Warning issued</p>
                    <p className="text-xs text-yellow-500">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-1 bg-blue-500 rounded-full mt-1">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">New exam "Computer Science Fundamentals" created</p>
                    <p className="text-xs text-blue-600">Duration: 120 minutes • Questions: 50 • Auto-grading enabled</p>
                    <p className="text-xs text-blue-500">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-1 bg-purple-500 rounded-full mt-1">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800">AI model updated with improved accuracy</p>
                    <p className="text-xs text-purple-600">Face detection accuracy increased to 99.2%</p>
                    <p className="text-xs text-purple-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
