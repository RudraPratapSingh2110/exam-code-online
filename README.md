
# ProctMe - AI-Powered Online Examination Platform

## 🚀 What is ProctMe?

ProctMe is a smart online exam platform that helps teachers create and monitor exams while ensuring students take them fairly. It uses AI technology to watch students during exams and detect any cheating attempts.

## 🎯 Key Features

### For Teachers
- **Create Exams**: Build custom exams with multiple-choice questions
- **Question Bank**: Store and reuse questions for future exams
- **Real-time Monitoring**: Watch students take exams live
- **AI Proctoring**: Automatic cheating detection
- **Analytics**: View detailed reports and statistics
- **Scheduling**: Set exam dates and times

### For Students
- **Easy Access**: Join exams using simple access codes
- **Fair Testing**: Clean, distraction-free exam interface
- **Instant Results**: Get scores immediately after submission
- **Progress Tracking**: See your progress during the exam

## 🤖 How AI Proctoring Works (In Simple Terms)

The AI proctoring system acts like a digital supervisor that watches students during exams:

### 1. **Face Detection**
- Uses your camera to make sure only you are taking the exam
- Alerts if no face is detected (you left your seat)
- Warns if multiple faces are detected (someone is helping you)

### 2. **Tab Switching Detection**
- Monitors if you switch to other browser tabs or applications
- Prevents students from googling answers or using other resources
- Automatically records violations

### 3. **Voice Detection**
- Listens for voices or conversations during the exam
- Detects if someone is giving you answers verbally
- Records audio violations

### 4. **Automatic Actions**
- Collects all violations and creates a report
- Can automatically submit exam if too many violations occur
- Provides detailed reports to teachers

## 📁 Project Structure Explained

```
src/
├── components/           # Reusable UI pieces
│   ├── auth/            # Login and signup forms
│   ├── ui/              # Basic UI components (buttons, cards, etc.)
│   ├── AIProctoring.tsx      # AI monitoring system
│   ├── ExamCreator.tsx       # Tool for teachers to create exams
│   ├── ExamTaking.tsx        # Interface for students taking exams
│   ├── ExamResults.tsx       # Shows exam results
│   └── ProctoringReport.tsx  # Detailed AI violation reports
├── pages/               # Main application pages
│   └── Index.tsx        # Landing page with login/signup
├── lib/                 # Helper functions and storage
│   └── examStorage.ts   # Saves exams and results locally
└── hooks/               # Custom React functionality
```

## 🔧 How Each Component Works

### Authentication System (`auth/`)
- **LoginForm.tsx**: Where users enter email/password to sign in
- **SignUpForm.tsx**: Where new users create accounts
- **AuthProvider.tsx**: Manages user login status throughout the app

### Exam Management
- **ExamCreator.tsx**: Teachers use this to build new exams
  - Add questions with multiple choice answers
  - Set time limits and point values
  - Choose which answer is correct

- **QuestionBank.tsx**: Library where teachers store reusable questions
- **ExamScheduler.tsx**: Set when exams should be available

### Student Experience
- **StudentInterface.tsx**: Main page for students
  - Enter exam codes to join exams
  - View available exams

- **ExamTaking.tsx**: The actual exam interface
  - Shows questions one by one
  - Timer counting down
  - AI proctoring active during exam

### AI Proctoring System
- **AIProctoring.tsx**: The "digital supervisor"
  - Activates camera and microphone
  - Monitors face detection
  - Watches for tab switching
  - Records all violations

- **ProctoringReport.tsx**: Detailed report for teachers
  - Shows all violations that occurred
  - Risk assessment (low/medium/high)
  - Recommendations for manual review

### Analytics & Monitoring
- **AnalyticsDashboard.tsx**: Statistics and charts for teachers
- **ExamMonitor.tsx**: Live monitoring of ongoing exams
- **ExamResults.tsx**: Individual student results

## 🏗️ How Everything Connects

1. **Teacher Journey**:
   - Sign up/Login → Teacher Dashboard → Create Exam → Monitor Students → View Reports

2. **Student Journey**:
   - Sign up/Login → Enter Exam Code → Take Exam with AI Monitoring → View Results

3. **Data Flow**:
   - All data stored locally in browser (localStorage)
   - In production, would connect to a real database
   - AI monitoring data sent to teacher reports

## 🧠 AI Technology Simplified

### Face Detection
```javascript
// Simplified explanation:
1. Camera captures video feed
2. AI analyzes each frame for faces
3. Counts: 0 faces = student left, 2+ faces = getting help
4. Reports violations to teacher
```

### Tab Monitoring
```javascript
// How it works:
1. Browser API detects when tab loses focus
2. Records timestamp of switch
3. Counts total switches
4. High switches = high risk of cheating
```

### Voice Detection
```javascript
// Audio monitoring:
1. Microphone captures audio
2. Analyzes sound levels
3. Detects human voice patterns
4. Records when voices detected during exam
```

## 🚀 Getting Started

### For Development
1. Clone the project
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Open `http://localhost:5173` in your browser

### For Teachers
1. Click "Sign Up" on homepage
2. Choose "Teacher/Examiner" role
3. Create your account
4. Start creating exams!

### For Students
1. Click "Sign Up" on homepage
2. Choose "Student" role
3. Create your account
4. Get exam codes from your teacher

## 🔒 Privacy & Security

- **Camera/Microphone**: Only used during exams with student permission
- **Data Storage**: All data stored locally in browser (not sent to external servers)
- **Violation Records**: Only visible to teachers, not shared publicly
- **Student Privacy**: No personal conversations recorded, only exam violations

## 🎨 Technologies Used

- **React**: For building user interfaces
- **TypeScript**: For safer, more reliable code
- **Tailwind CSS**: For styling and design
- **Web APIs**: For camera, microphone, and tab detection
- **Local Storage**: For saving data in browser

## 🤝 Support

If you need help:
1. Check this README for common questions
2. Look at the code comments for technical details
3. Test with demo accounts (examiner@proctme.com / student@proctme.com)

## 📈 Future Enhancements

- Connect to real database (Supabase)
- Advanced AI features (emotion detection, eye tracking)
- Mobile app support
- Integration with school systems
- Automated grading for essay questions

---

**ProctMe** - Making online exams fair and secure with AI technology! 🎓✨
