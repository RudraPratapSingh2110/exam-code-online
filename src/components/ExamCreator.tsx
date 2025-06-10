
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveExam, generateExamCode, type Exam, type Question } from "@/lib/examStorage";

interface ExamCreatorProps {
  onExamCreated: (exam: Exam) => void;
  onCancel: () => void;
}

const ExamCreator = ({ onExamCreated, onCancel }: ExamCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1
    }
  ]);
  const { toast } = useToast();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const handleSaveExam = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter an exam title",
        variant: "destructive"
      });
      return;
    }

    const incompleteQuestions = questions.filter(q => 
      !q.text.trim() || q.options.some(opt => !opt.trim())
    );

    if (incompleteQuestions.length > 0) {
      toast({
        title: "Incomplete Questions",
        description: "Please complete all questions and their options",
        variant: "destructive"
      });
      return;
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      code: generateExamCode(),
      duration,
      isActive,
      questions,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    saveExam(newExam);
    onExamCreated(newExam);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create New Exam</h1>
              <p className="text-gray-600">Design your examination questions and settings</p>
            </div>
          </div>
          <Button
            onClick={handleSaveExam}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Exam
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Exam Settings */}
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
              <CardDescription>Configure your exam details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter exam description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Make exam active immediately</Label>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Questions</h2>
              <Button
                onClick={addQuestion}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id} className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text *</Label>
                    <Textarea
                      placeholder="Enter your question here"
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Answer Options *</Label>
                    <RadioGroup
                      value={question.correctAnswer.toString()}
                      onValueChange={(value) => updateQuestion(question.id, "correctAnswer", Number(value))}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3">
                          <RadioGroupItem value={optionIndex.toString()} />
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500 w-16">
                            {question.correctAnswer === optionIndex ? "Correct" : ""}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex items-center gap-4">
                    <Label htmlFor={`points-${question.id}`}>Points:</Label>
                    <Input
                      id={`points-${question.id}`}
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) => updateQuestion(question.id, "points", Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreator;
