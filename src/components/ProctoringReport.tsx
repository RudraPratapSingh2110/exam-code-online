
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, Monitor, Mic, Download, Clock } from "lucide-react";
import { Submission } from "@/lib/examStorage";

interface ProctoringEvent {
  type: 'tab_switch' | 'multiple_faces' | 'no_face' | 'voice_detected' | 'suspicious_movement';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface ProctoringData {
  studentName: string;
  examId: string;
  startTime: string;
  endTime: string;
  violations: ProctoringEvent[];
  tabSwitches: number;
  faceDetectionAlerts: number;
  voiceDetections: number;
  totalViolations: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ProctoringReportProps {
  submission: Submission;
  proctoringData?: ProctoringData;
}

const ProctoringReport = ({ submission, proctoringData }: ProctoringReportProps) => {
  const [expandedViolations, setExpandedViolations] = useState(false);

  // Mock proctoring data if not provided
  const mockProctoringData: ProctoringData = proctoringData || {
    studentName: submission.studentName,
    examId: submission.examId,
    startTime: submission.submittedAt,
    endTime: submission.submittedAt,
    violations: [
      {
        type: 'tab_switch',
        timestamp: new Date().toISOString(),
        description: 'Student switched to another tab',
        severity: 'high'
      },
      {
        type: 'voice_detected',
        timestamp: new Date().toISOString(),
        description: 'Voice detected during exam',
        severity: 'medium'
      }
    ],
    tabSwitches: 2,
    faceDetectionAlerts: 1,
    voiceDetections: 3,
    totalViolations: 6,
    riskLevel: 'medium'
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const exportReport = () => {
    const reportData = {
      student: mockProctoringData.studentName,
      exam: mockProctoringData.examId,
      score: `${submission.score}/${submission.maxScore}`,
      duration: `${Math.round(submission.timeTaken / 60)} minutes`,
      violations: mockProctoringData.totalViolations,
      riskLevel: mockProctoringData.riskLevel,
      submittedAt: new Date(submission.submittedAt).toLocaleString(),
      details: mockProctoringData.violations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proctoring-report-${submission.studentName}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Proctoring Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              AI Proctoring Report
            </div>
            <Badge className={getRiskLevelColor(mockProctoringData.riskLevel)}>
              Risk Level: {mockProctoringData.riskLevel.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Monitor className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{mockProctoringData.tabSwitches}</div>
              <div className="text-sm text-gray-600">Tab Switches</div>
            </div>
            
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{mockProctoringData.faceDetectionAlerts}</div>
              <div className="text-sm text-gray-600">Face Alerts</div>
            </div>
            
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Mic className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{mockProctoringData.voiceDetections}</div>
              <div className="text-sm text-gray-600">Voice Detections</div>
            </div>
            
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{mockProctoringData.totalViolations}</div>
              <div className="text-sm text-gray-600">Total Violations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Exam Performance</span>
            <Button onClick={exportReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold">{submission.score}/{submission.maxScore}</div>
              <div className="text-sm text-gray-500">
                {Math.round((submission.score / submission.maxScore) * 100)}%
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Time Taken</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <Clock className="h-5 w-5" />
                {Math.round(submission.timeTaken / 60)}m
              </div>
              <div className="text-sm text-gray-500">
                {Math.round(submission.timeTaken / 60)} minutes total
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Submitted</div>
              <div className="text-lg font-semibold">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(submission.submittedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Violation Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedViolations(!expandedViolations)}
            >
              {expandedViolations ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expandedViolations && (
            <div className="space-y-3">
              {mockProctoringData.violations.map((violation, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityColor(violation.severity)}>
                        {violation.severity}
                      </Badge>
                      <span className="text-sm font-medium capitalize">
                        {violation.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{violation.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(violation.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!expandedViolations && mockProctoringData.violations.length > 0 && (
            <div className="text-center text-gray-500 py-4">
              Click "Show Details" to view {mockProctoringData.violations.length} violations
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">AI Analysis & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {mockProctoringData.riskLevel === 'high' && (
              <p className="text-red-700">
                ⚠️ High risk of academic dishonesty detected. Manual review recommended.
              </p>
            )}
            {mockProctoringData.tabSwitches > 3 && (
              <p className="text-orange-700">
                🔍 Multiple tab switches detected. Consider investigating external resource usage.
              </p>
            )}
            {mockProctoringData.faceDetectionAlerts > 0 && (
              <p className="text-yellow-700">
                👥 Face detection alerts suggest possible assistance from others.
              </p>
            )}
            {mockProctoringData.totalViolations === 0 && (
              <p className="text-green-700">
                ✅ No violations detected. Clean exam session.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProctoringReport;
