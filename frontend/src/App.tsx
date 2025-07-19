import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/theme-context"
import { ConfirmationProvider } from "./contexts/confirmation-context"
import Layout from "./components/layout"
// import Dashboard from "./pages/dashboard"
import { Dashboard } from "./components/dashboard/dashboard"
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
import QuizExplorer from "./pages/UserQuizRender"
import { SocketProvider } from "./contexts/socketContext"
import StartExam from "./pages/StartExam"
import MonitoringPage from "./pages/MonitoringPage"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import UserManagement from "./pages/Admin/UserManagement"
import CharacterCustomizer from "./pages/CharacterCustomizer"

export default function App() {
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HeroSection />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/quiz" element={<QuizExplorer />} />
                  <Route path="/quiz/monitoring/:quizId" element={<MonitoringPage />} />
                  <Route path="/admin" element={<Navigate to={"/admin/dashboard"} />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/Users" element={<UserManagement />} />
                  <Route path="/home" element={<HeroSection />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/start/:quizId" element={<StartExam />} />
                  <Route path="/quiz-creation" element={<CreateQuizPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/otp" element={<OtpPage />} />
                  <Route path="/github-success" element={<GitHubSuccess />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/character" element={<CharacterCustomizer />} />
                </Routes>
              </Layout>
            </Router>
          </SocketProvider>
          <Toaster />
        </AuthProvider>
      </ConfirmationProvider>
    </ThemeProvider>
  )
}
