import api from './api.js';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from 'axios';

import HomePage from "./HomePage.js";
import Header from "./Header.js";
import Sidebar from "./Sidebar.js";
import AuthModal from "./AuthModal.js";
import Footer from "./Footer.js";
import About_Us from "./About_Us.js";
import ProfilePage from "./ProfilePage.js";
import TestsPage from './TestsPage.js';
import AnxietyTest from "./components/AnxietyTest.js";
import LoveTest from "./components/LoveTest.js";
import CareerTest from "./components/CareerTest.js";
import LogicTest from "./components/LogicTest.js";
import CreativityTest from "./components/CreativityTest.js";
import FlagsTest from "./components/FlagsTest.js";
import DuneTest from "./components/DuneTest.js";
import MemoryTest from "./components/MemoryTest.js";
import WalkingDeadTest from "./components/WalkingDeadTest.js";
import SmesharikiTest from "./components/SmesharikiTest.js";
import WursTest from "./components/WursTest.js";
import BeckHopelessnessTest from "./components/BeckHopelessnessTest.js";
import IntuitionTest from "./components/IntuitionTest.js";
import BecksAnxietyScale from "./components/BecksAnxietyScale.js";
import AttitudeTest from "./components/AttitudeTest.js";
import NarcissistTest from "./components/NarcissistTest.js";
import EpworthSleepinessScale from "./components/EpworthSleepinessScale.js";
import MindMazeTest from "./components/MindMazeTest.js";
import ResetPasswordPage from "./ResetPasswordPage.js"; // Оставьте только одну строку
import EmailVerificationPage from "./EmailVerificationPage.js";

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: '',
    email: '',
    avatar_url: '/images/default-avatar.png'
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  //добавлено для сброса пароля
  const publicRoutes = ['/reset-password', '/verify-email'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const api = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? "https://testiki-33ur.onrender.com" 
  : "http://localhost:8080",
    withCredentials: true,
    timeout: 10000,
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !isPublicRoute) {
        console.log("401 error, logging out...")
        handleLogout()
      }
      return Promise.reject(error)
    },
  )

  const verifyAuth = async () => {
    try {
      const response = await api.get("/me")
      setIsAuthenticated(true)
      setCurrentUser({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        avatar_url: response.data.avatar_url || "/images/default-avatar.png",
      })
      return true
    } catch (error) {
      console.error("Ошибка проверки аутентификации:", error)
      setIsAuthenticated(false)
      setCurrentUser({
        id: null,
        username: "",
        email: "",
        avatar_url: "/images/default-avatar.png",
      })
      return false
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (isPublicRoute) {
        setIsLoading(false)
        return
      }

      await verifyAuth()
      setIsLoading(false)
    }
    checkAuth()
  }, [isPublicRoute])

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const toggleAuthModal = () => setIsAuthModalOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleTheme = () => setDarkMode((prev) => !prev)

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true)
    setCurrentUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      avatar_url: userData.avatar_url || "/images/default-avatar.png",
    })
    setIsAuthModalOpen(false)
    // НЕ перенаправляем автоматически на профиль
    navigate("/profile")
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout")
    } catch (error) {
      console.error("Ошибка выхода:", error)
    } finally {
      setIsAuthenticated(false)
      setCurrentUser({
        id: null,
        username: "",
        email: "",
        avatar_url: "/images/default-avatar.png",
      })
      navigate("/")
    }
  }

  const updateAvatar = (newAvatarUrl) => {
    setCurrentUser((prev) => ({
      ...prev,
      avatar_url: newAvatarUrl,
    }))
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile")
    } else {
      toggleAuthModal()
    }
  }

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            darkMode ? "border-indigo-400" : "border-indigo-600"
          }`}
        ></div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300
      ${
        darkMode
          ? "bg-gradient-to-br from-violet-500 to-violet-950"
          : "bg-gradient-to-br from-neutral-50 to-neutral-100"
      }`}
    >
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onSidebarToggle={toggleSidebar}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        onThemeToggle={toggleTheme}
        darkMode={darkMode}
      />

      <div className="flex-grow">
        <AnimatePresence>
          {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} darkMode={darkMode} isAuthenticated={isAuthenticated} onAuthModalOpen={toggleAuthModal} />}
          {isAuthModalOpen && <AuthModal onClose={toggleAuthModal} onLoginSuccess={handleLoginSuccess} />}
        </AnimatePresence>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage darkMode={darkMode} isAuthenticated={isAuthenticated} onAuthModalOpen={toggleAuthModal} />
            }
          />
          <Route path="/about" element={<About_Us darkMode={darkMode} />} />
          <Route path="/reset-password" element={<ResetPasswordPage darkMode={darkMode} />} />
          <Route path="/verify-email" element={<EmailVerificationPage darkMode={darkMode} />} />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage
                  user={currentUser}
                  darkMode={darkMode}
                  onAvatarUpdate={updateAvatar}
                  onLogout={handleLogout}
                  onLoginSuccess={handleLoginSuccess}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/tests"
            element={
              <TestsPage
                darkMode={darkMode}
                isAuthenticated={isAuthenticated}
                onSidebarToggle={toggleSidebar}
                onProfileClick={handleProfileClick}
                onThemeToggle={toggleTheme}
              />
            }
          />

          {/* Защищенные маршруты тестов */}
          <Route
            path="/anxiety-test"
            element={isAuthenticated ? <AnxietyTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route path="/love-test" element={isAuthenticated ? <LoveTest darkMode={darkMode} /> : <Navigate to="/" />} />
          <Route
            path="/career-test"
            element={isAuthenticated ? <CareerTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/logic-test"
            element={isAuthenticated ? <LogicTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/creativity-test"
            element={isAuthenticated ? <CreativityTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/flags-test"
            element={isAuthenticated ? <FlagsTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route path="/dune-test" element={isAuthenticated ? <DuneTest darkMode={darkMode} /> : <Navigate to="/" />} />
          <Route
            path="/memory-test"
            element={isAuthenticated ? <MemoryTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/walking-dead-test"
            element={isAuthenticated ? <WalkingDeadTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/smeshariki-test"
            element={isAuthenticated ? <SmesharikiTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route path="/wurs-25" element={isAuthenticated ? <WursTest darkMode={darkMode} /> : <Navigate to="/" />} />
          <Route
            path="/beck-hopelessness-test"
            element={isAuthenticated ? <BeckHopelessnessTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/intuition-test"
            element={isAuthenticated ? <IntuitionTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/becks-anxiety-scale"
            element={isAuthenticated ? <BecksAnxietyScale darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/attitude-test"
            element={isAuthenticated ? <AttitudeTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/narcissist-test"
            element={isAuthenticated ? <NarcissistTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/epworth-sleepiness-scale"
            element={isAuthenticated ? <EpworthSleepinessScale darkMode={darkMode} /> : <Navigate to="/" />}
          />
          <Route
            path="/mind-maze-test"
            element={isAuthenticated ? <MindMazeTest darkMode={darkMode} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  )
}

export default AppWrapper;