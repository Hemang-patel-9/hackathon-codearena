import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/theme-context"
import { ConfirmationProvider } from "./contexts/confirmation-context"
import Layout from "./components/layout"
import Dashboard from "./pages/dashboard"
import { Toaster } from "./components/ui/toaster"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import { AuthProvider } from "./contexts/authContext";
import LoginPage from "./pages/Login"
import ProfilePage from "./pages/Profile"
import OtpPage from "./pages/otpVarificationPage"
import GitHubSuccess from "./pages/GithubSuccess"
import { HeroSection } from "./pages/Home"
import { CreateQuizPage } from "./components/create-quiz/create-quiz-page"
import { SocketProvider } from "./contexts/socketContext"
import QuizExplorer from "./pages/Quizzes"
import StartExam from "./pages/StartExam"

export default function App() {
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/home" element={<HeroSection />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/quizzes" element={<QuizExplorer />} />
                  <Route path="/start" element={<StartExam />} />
                  <Route path="/quiz-creation" element={<CreateQuizPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/otp" element={<OtpPage />} />
                  <Route path="/github-success" element={<GitHubSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>``
            </Router>
          </SocketProvider>
          <Toaster />
        </AuthProvider>
      </ConfirmationProvider>
    </ThemeProvider>
  )
}
