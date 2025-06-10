
import { useState, useEffect, useRef, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, EyeOff, Mic, MicOff, Users, Monitor, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProctoringEvent {
  type: 'tab_switch' | 'multiple_faces' | 'no_face' | 'voice_detected' | 'suspicious_movement';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface AIProctoringProps {
  isActive: boolean;
  onViolation: (event: ProctoringEvent) => void;
  studentName: string;
}

const AIProctoring = ({ isActive, onViolation, studentName }: AIProctoringProps) => {
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const [voiceDetectionEnabled, setVoiceDetectionEnabled] = useState(false);
  const [tabSwitchingEnabled, setTabSwitchingEnabled] = useState(true);
  const [currentFaceCount, setCurrentFaceCount] = useState(0);
  const [isTabFocused, setIsTabFocused] = useState(true);
  const [violations, setViolations] = useState<ProctoringEvent[]>([]);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  // Tab switching detection
  useEffect(() => {
    if (!isActive || !tabSwitchingEnabled) return;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabFocused(isVisible);
      
      if (!isVisible) {
        const violation: ProctoringEvent = {
          type: 'tab_switch',
          timestamp: new Date().toISOString(),
          description: 'Student switched to another tab or window',
          severity: 'high'
        };
        
        addViolation(violation);
        onViolation(violation);
        
        toast({
          title: "Tab Switch Detected!",
          description: "Please return to the exam window immediately",
          variant: "destructive"
        });
      }
    };

    const handleBlur = () => {
      if (document.hasFocus()) return;
      
      const violation: ProctoringEvent = {
        type: 'tab_switch',
        timestamp: new Date().toISOString(),
        description: 'Exam window lost focus',
        severity: 'medium'
      };
      
      addViolation(violation);
      onViolation(violation);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isActive, tabSwitchingEnabled, onViolation, toast]);

  // Face detection setup
  const setupFaceDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: voiceDetectionEnabled 
      });
      
      mediaStreamRef.current = stream;
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate face detection (in real implementation, you'd use face-api.js or similar)
      detectionIntervalRef.current = setInterval(() => {
        detectFaces();
      }, 2000);

    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission('denied');
      toast({
        title: "Camera Access Required",
        description: "Please enable camera access for face monitoring",
        variant: "destructive"
      });
    }
  }, [voiceDetectionEnabled, toast]);

  // Voice detection setup
  const setupVoiceDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const detectVoice = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        if (average > 20) { // Threshold for voice detection
          const violation: ProctoringEvent = {
            type: 'voice_detected',
            timestamp: new Date().toISOString(),
            description: 'Voice or audio detected during exam',
            severity: 'medium'
          };
          
          addViolation(violation);
          onViolation(violation);
        }
      };
      
      setInterval(detectVoice, 1000);
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      setMicPermission('denied');
    }
  }, [onViolation]);

  // Simulated face detection (replace with actual AI model)
  const detectFaces = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // Simulate face detection results
    const simulatedFaceCount = Math.random() > 0.1 ? 1 : Math.random() > 0.7 ? 0 : 2;
    setCurrentFaceCount(simulatedFaceCount);

    if (simulatedFaceCount === 0) {
      const violation: ProctoringEvent = {
        type: 'no_face',
        timestamp: new Date().toISOString(),
        description: 'No face detected in camera view',
        severity: 'high'
      };
      
      addViolation(violation);
      onViolation(violation);
      
    } else if (simulatedFaceCount > 1) {
      const violation: ProctoringEvent = {
        type: 'multiple_faces',
        timestamp: new Date().toISOString(),
        description: `${simulatedFaceCount} faces detected - possible assistance`,
        severity: 'high'
      };
      
      addViolation(violation);
      onViolation(violation);
      
      toast({
        title: "Multiple Faces Detected!",
        description: "Only the registered student should be visible",
        variant: "destructive"
      });
    }
  }, [onViolation, toast]);

  const addViolation = (violation: ProctoringEvent) => {
    setViolations(prev => [violation, ...prev].slice(0, 10)); // Keep last 10 violations
  };

  const startProctoring = async () => {
    if (faceDetectionEnabled) {
      await setupFaceDetection();
    }
    if (voiceDetectionEnabled) {
      await setupVoiceDetection();
    }
  };

  const stopProctoring = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive) {
      startProctoring();
    } else {
      stopProctoring();
    }

    return () => stopProctoring();
  }, [isActive, faceDetectionEnabled, voiceDetectionEnabled]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Proctoring Status Panel */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-purple-600" />
            AI Proctoring Active
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Monitor className={`h-4 w-4 ${isTabFocused ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm">
                Tab: {isTabFocused ? 'Focused' : 'Switched'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Camera className={`h-4 w-4 ${currentFaceCount === 1 ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm">
                Faces: {currentFaceCount}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mic className={`h-4 w-4 ${micPermission === 'granted' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-sm">
                Audio: {micPermission === 'granted' ? 'Monitoring' : 'Disabled'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                Violations: {violations.length}
              </span>
            </div>
          </div>

          {/* Settings */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={faceDetectionEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
              className="text-xs"
            >
              {faceDetectionEnabled ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
              Face Detection
            </Button>
            
            <Button
              variant={voiceDetectionEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setVoiceDetectionEnabled(!voiceDetectionEnabled)}
              className="text-xs"
            >
              {voiceDetectionEnabled ? <Mic className="h-3 w-3 mr-1" /> : <MicOff className="h-3 w-3 mr-1" />}
              Voice Detection
            </Button>
            
            <Badge variant={tabSwitchingEnabled ? "default" : "secondary"} className="text-xs">
              Tab Monitoring: {tabSwitchingEnabled ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Camera Feed */}
      {faceDetectionEnabled && (
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Camera Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full max-w-xs rounded-lg border"
                autoPlay
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full max-w-xs rounded-lg"
                style={{ display: 'none' }}
              />
              {currentFaceCount !== 1 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {currentFaceCount === 0 ? 'No Face' : 'Multiple Faces'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Violations Log */}
      {violations.length > 0 && (
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {violations.slice(0, 3).map((violation, index) => (
              <Alert key={index} className={`p-3 ${getSeverityColor(violation.severity)}`}>
                <AlertDescription className="text-xs">
                  <div className="flex justify-between items-start">
                    <span>{violation.description}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {violation.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(violation.timestamp).toLocaleTimeString()}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Permission Alerts */}
      {(cameraPermission === 'denied' || micPermission === 'denied') && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Camera and microphone access is required for AI proctoring. Please enable permissions and refresh.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AIProctoring;
