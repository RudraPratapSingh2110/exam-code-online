
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, UserCheck, GraduationCap } from "lucide-react";
import ExaminerDashboard from "@/components/ExaminerDashboard";
import StudentInterface from "@/components/StudentInterface";

const Index = () => {
  const [userRole, setUserRole] = useState<'examiner' | 'student' | null>(null);

  if (userRole === 'examiner') {
    return <ExaminerDashboard onBack={() => setUserRole(null)} />;
  }

  if (userRole === 'student') {
    return <StudentInterface onBack={() => setUserRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ExamPro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive online examination platform for educators and students
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Examiner</CardTitle>
              <CardDescription className="text-gray-600">
                Create and manage examinations with unique access codes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Create custom exams with multiple question types
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Generate unique exam codes for student access
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Monitor exam progress and results
                </li>
              </ul>
              <Button 
                onClick={() => setUserRole('examiner')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Continue as Examiner
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Student</CardTitle>
              <CardDescription className="text-gray-600">
                Join examinations using unique codes provided by your examiner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Join exams with unique access codes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Take exams in a secure environment
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  View results instantly after completion
                </li>
              </ul>
              <Button 
                onClick={() => setUserRole('student')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              >
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">Secure • Reliable • Easy to Use</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
