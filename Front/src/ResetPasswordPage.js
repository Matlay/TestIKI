import api from './api.js';
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ResetPasswordPage = ({ darkMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  const api = axios.create({
    baseURL: typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? "https://testiki-33ur.onrender.com" 
  : "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Недействительная ссылка для восстановления пароля");
    }
  }, [searchParams]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Пароль должен содержать минимум 8 символов";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Пароль должен содержать заглавные и строчные буквы, а также цифры";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Произошла ошибка при сбросе пароля");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950" : "bg-gradient-to-br from-neutral-50 to-neutral-100"
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center"
        >
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Пароль успешно изменен!</h2>
          <p className="text-gray-600 mb-6">
            Ваш пароль был успешно обновлен. Вы будете перенаправлены на главную страницу через несколько секунд.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Перейти на главную
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? "bg-gradient-to-br from-violet-500 to-violet-950" : "bg-gradient-to-br from-neutral-50 to-neutral-100"
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Новый пароль</h2>
        <p className="text-gray-600 text-center mb-6">Введите новый пароль для вашего аккаунта</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Новый пароль"
              className="w-full p-3 border rounded-lg pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              <img
                src={showPassword ? "/eye-open.png" : "/eye-closed.png"}
                alt="Toggle password visibility"
                className="w-6 h-6"
              />
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Подтвердите пароль"
              className="w-full p-3 border rounded-lg pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              <img
                src={showConfirmPassword ? "/eye-open.png" : "/eye-closed.png"}
                alt="Toggle confirm password visibility"
                className="w-6 h-6"
              />
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <p>Пароль должен содержать:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Минимум 8 символов</li>
              <li>Заглавные и строчные буквы</li>
              <li>Специальный символ</li>
              <li>Цифры</li>
            </ul>
          </div>

          {error && (
            <div className="text-red-500 text-center p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-indigo-400 to-indigo-500 text-white py-3 rounded-lg disabled:opacity-50"
            disabled={isLoading || !token}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Сохраняем...</span>
              </div>
            ) : (
              "Сохранить новый пароль"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;